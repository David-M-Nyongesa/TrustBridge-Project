import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);
const API_URL = "http://localhost:3001";
const STORAGE_KEY = "tb-user";

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  });

  function persist(nextUser) {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function login(email, password) {
    try {
      const res = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(email)}`
      );
      const matches = await res.json();
      const found = matches[0];
      if (!found || found.password !== password) {
        return { ok: false, error: "Wrong email or password." };
      }

      const { password: _pw, ...safeUser } = found;
      persist(safeUser);
      return { ok: true };
    } catch {
      return { ok: false, error: "Can't reach the server — is JSON Server running?" };
    }
  }

  async function signup({ name, email, password, role }) {
    try {
      // Duplicate check before creating.
      const existingRes = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(email)}`
      );
      const existing = await existingRes.json();
      if (existing.length > 0) {
        return { ok: false, error: "That email is already registered — log in instead." };
      }

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password, 
          role,
          joined: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();

      const { password: _pw, ...safeUser } = created;
      persist(safeUser);
      return { ok: true };
    } catch {
      return { ok: false, error: "Signup failed — is JSON Server running?" };
    }
  }

  function logout() {
    persist(null);
  }

  const value = {
    user,
    isOwner: user?.role === "owner",
    login,
    signup,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error("useUser must be used inside a <UserProvider>");
  }
  return ctx;
}
