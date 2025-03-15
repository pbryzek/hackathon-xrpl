import React from "react";
import { Link } from "react-router-dom";
import { Home, Leaf, LogIn } from "lucide-react"; 
import "../index1.css"
import "../index.css"

const Header: React.FC = () => {
  return (
    <header className="w-full bg-green-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-wider flex items-center gap-2">
          <Leaf className="w-6 h-6 text-white" />
          XRPL Green Bonds
        </Link>

        <nav className="flex space-x-6">
          <Link to="/bonds" className="bg-white text-green-500 px-4 py-2 rounded-lg hover:bg-green-200">
            Bonds
          </Link>
          <Link to="/auth" className="bg-white text-green-500 px-4 py-2 rounded-lg hover:bg-green-200">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
