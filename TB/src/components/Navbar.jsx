import { NavLink, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTheme } from "../hooks/useTheme";

const linkBase = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors";
const linkCls = ({ isActive }) =>
  `${linkBase} ${
    isActive
      ? "bg-primary text-white"
      : "text-gray-600 hover:bg-primary/10 hover:text-primary dark:text-gray-300 dark:hover:bg-white/10"
  }`;

export default function Navbar() {
  const { user, isOwner, logout } = useUser();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-ink/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-4 text-lg font-bold text-primary">
          Trust<span className="text-ink dark:text-gray-100">Bridge</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={linkCls}>Browse</NavLink>
          <NavLink to="/post" className={linkCls}>Post a listing</NavLink>
          <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Switch theme"
            title="Switch theme"
            className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm transition-colors hover:border-primary dark:border-white/15"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {user ? (
            <>
              <span className="hidden text-sm font-medium sm:inline">
                {user.name.split(" ")[0]}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  isOwner
                    ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-indigo-200"
                    : "bg-royal/10 text-royal dark:bg-royal/40 dark:text-indigo-200"
                }`}
              >
                {user.role}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-royal"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
