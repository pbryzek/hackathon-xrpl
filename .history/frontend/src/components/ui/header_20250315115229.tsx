import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* ✅ Logo */}
        <Link to="/" className="logo">
          XRPL Green Bonds
        </Link>

        {/* ✅ Navigation Links */}
        <div className="links">
        <nav className="flex space-x-6">
          <Link to="/bonds" className="nav-link">Bonds</Link>
          <Link to="/auth" className="nav-link">Sign In</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
        </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
