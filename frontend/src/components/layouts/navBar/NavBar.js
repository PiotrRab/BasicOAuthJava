import React from 'react';
import {Link} from 'react-router-dom';
import './NavBar.scss';
import LoginButton from "./LoginButton";

const NavBar = ({authenticated}) => {

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Starter
                </Link>
                {authenticated && <Link to="/users" className="nav-link">Users</Link>}
                <LoginButton authenticated={authenticated}/>
            </div>
        </nav>
    );
};

export default NavBar;