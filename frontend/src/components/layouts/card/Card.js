import React from 'react';
import classnames from "classnames";
import "./Card.scss"

const Card = ({className, children}) => {
    return (
        <div className={classnames("card", className)}>
            {children}
        </div>
    );
};

export default Card;