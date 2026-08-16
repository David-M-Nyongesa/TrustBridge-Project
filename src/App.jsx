import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Browse from "./pages/Browse";
import ListingDetail from "./pages/ListingDetail";
import PostListing from "./pages/PostListing";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-ink transition-colors dark:bg-ink dark:text-gray-100">
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">
            <Routes>
              <Route path="/" element={<Browse />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/post" element={<PostListing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="*"
                element={
                  <p className="py-20 text-center text-gray-500 dark:text-gray-400">
                    Page not found.
                  </p>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}