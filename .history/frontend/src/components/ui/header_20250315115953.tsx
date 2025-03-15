import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* ✅ Logo */}
        <Link to="/" className="logo no-underline">
          XRPL Green Bonds
        </Link>

        {/* ✅ Navigation Links */}
        <div className="links ml-auto mr-10"> {/* Moves links further from the right */}
          <nav className="flex space-x-10">
            <Link to="/bonds" className="nav-link">Bonds</Link>
            <Link to="/" className="nav-link">Sign In</Link>
            <Link to="/marketplace" className="nav-link">Marketplace</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
