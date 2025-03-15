import React from "react";
import { Link } from "react-router-dom";
import { Home, Leaf, LogIn } from "lucide-react"; // ✅ Icons for a modern look

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* ✅ Logo */}
        <Link to="/" className="text-2xl font-extrabold text-primary tracking-wider flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          XRPL Green Bonds
        </Link>

        {/* ✅ Navigation Links (Inline Tailwind Classes) */}
        <nav className="flex space-x-6">
          <Link
            to="/bonds"
            className="flex items-center gap-2 text-white/90 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            <Home className="w-5 h-5" /> Bonds
          </Link>
          <Link
            to="/auth"
            className="flex items-center gap-2 text-white/90 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            <LogIn className="w-5 h-5" /> Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
