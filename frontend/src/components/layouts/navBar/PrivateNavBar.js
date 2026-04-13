import React from 'react';
import {Link} from "react-router-dom";
import './NavBar.scss';
import LoginButton from "./LoginButton";
import {useSelector} from "react-redux";

const PrivateNavBar = () => {
    const authenticated = useSelector(state => state.auth.authenticated);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Starter
                </Link>
                <Link to="/users" className="nav-link">
                    Users
                </Link>
                <Link to="/tags" className="nav-link">
                    Tags
                </Link>
                <Link to="/guests" className="nav-link">
                    Guests
                </Link>
                <Link to="/events" className="nav-link">
                    Events
                </Link>
                <Link to="/room-layout" className="nav-link">
                    Room Layout
                </Link>
                <LoginButton authenticated={authenticated}/>
            </div>
        </nav>
    );
};

export default PrivateNavBar;
