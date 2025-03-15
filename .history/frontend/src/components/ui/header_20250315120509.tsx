import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  
  // Function to check if the link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="logo no-underline flex items-center gap-2">
          <span className="text-green-600">XRPL</span> Green Bonds
        </Link>

        {/* Navigation Links */}
        <div className="links"> 
          <nav className="flex space-x-6">
            <Link to="/bonds" className={`nav-link ${isActive('/bonds') ? 'active' : ''}`}>
              Bonds
            </Link>
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
              Marketplace
            </Link>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
