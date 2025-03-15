import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  
  console.log("Current Path:", location.pathname); // ✅ Debugging

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="logo no-underline flex items-center gap-2">
          <span className="text-green-600">XRPL</span> Green Bonds
        </Link>
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
    </header>
  );
};

export default Header;
