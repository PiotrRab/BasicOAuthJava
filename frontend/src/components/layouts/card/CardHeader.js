import React from 'react';
import "./CardHeader.scss"

const CardHeader = ({children, title, subtitle}) => {
    return (
        <div className="header">
            <div className="breadcrumbs">
                <span className="title">{title}</span>-<span className="subtitle">{subtitle}</span>
            </div>
            {children}
        </div>
    );
};

export default CardHeader;