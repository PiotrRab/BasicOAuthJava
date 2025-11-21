import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import './NavBar.scss';
import {GET, POST} from "../../../appConfig/Endpoint";
import {useFormik} from "formik";
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
                <Link to="/dashboard" className="nav-link">
                    Dashboard
                </Link>
                <LoginButton authenticated={authenticated}/>
            </div>
        </nav>
    );
};

export default PrivateNavBar;