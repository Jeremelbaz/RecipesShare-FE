import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from './services/user-service';
import recipeshare_logo from "./assets/recipeshare_logo.png"

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle logout errors.
        }
    };

    return (
        <nav className="navbar myFont">
            <div className="nav-left">
                <Link to="/posts" className='logo-container'>
                    <img src={recipeshare_logo} alt="Logo" className="logo" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/posts">Home</Link></li>
                    <li><Link to="/posts/create">New Recipe</Link></li>
                    <li ><Link to="/profile">My Profile</Link></li>
                    <li><Link to="/">Sign In</Link></li>
                </ul>
            </div>
            <button onClick={handleLogout} className="logout">Logout</button>
        </nav>
    );
};

export default Navbar;
