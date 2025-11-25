import React from 'react';
import classnames from "classnames";
import "./Card.scss"

const Card = ({className, title, subtitle, children}) => {
    return (
        <div className={classnames("card", className)}>
            <div className="header">
                <span className="title">{title}</span>-<span className="subtitle">{subtitle}</span>
            </div>
            {children}
        </div>
    );
};

export default Card;