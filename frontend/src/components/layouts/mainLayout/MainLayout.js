import React from 'react';
import NavBar from "../navBar/NavBar";
import './MainLayout.scss';
import {GET} from "../../../appConfig/Endpoint";
import {useSelector} from "react-redux";

const MainLayout = ({children}) => {
    const authenticated = useSelector(state => state.auth.authenticated);

    return (
        <div className="layout">
            <NavBar authenticated={authenticated}/>
            <div className="content">
                {children}
            </div>

        </div>
    );
};

export default MainLayout;