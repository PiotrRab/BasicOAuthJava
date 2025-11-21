import React from 'react';
import PrivateNavBar from "../navBar/PrivateNavBar";

const PrivateLayout = ({children}) => {
    return (
        <div>
            <div className="layout">
                <PrivateNavBar/>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PrivateLayout;