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
        <div className="links ml-auto mr-10"> {/* Moves links further from the right */}
          <nav className="flex space-x-8">
            <Link to="/bonds" className="nav-link no-underline">Bonds</Link>
            <Link to="/auth" className="nav-link no-underline">Sign In</Link>
            <Link to="/marketplace" className="nav-link no-underline">Marketplace</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
