import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './NavBar.scss';
import {useFormik} from "formik";
import {POST} from "../../../appConfig/Endpoint";
import LoginButton from "./LoginButton";

const NavBar = ({authenticated}) => {

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Starter
                </Link>
                {authenticated && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
                <LoginButton authenticated={authenticated}/>
            </div>
        </nav>
    );
};

export default NavBar;