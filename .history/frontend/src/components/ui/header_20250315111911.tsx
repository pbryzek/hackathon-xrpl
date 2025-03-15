import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-primary text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* ✅ Logo or Title */}
        <Link to="/" className="text-2xl font-bold">
          XRPL Green Bonds
        </Link>

        {/* ✅ Navigation Links */}
        <nav className="space-x-6">
          <Link to="/bonds" className="hover:underline">Bonds</Link>
          <Link to="/auth" className="hover:underline">Sign In</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
