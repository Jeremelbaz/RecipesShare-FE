import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png"

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className='logo-container myFont'>
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/posts/create">New Recipe</Link></li>
                    <li><Link to="/register">Sign In</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/profil">Profil</Link></li>
                </ul>
            </div>
            <div className="logout">
                <Link to="/logout">Logout</Link>
            </div>
        </nav>
    );
};

export default Navbar;
