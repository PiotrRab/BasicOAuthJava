import React from 'react';
import classNames from "classnames";
import "./icon.scss"


const Icon = ({className, icon}) => {
    return (
        <div className={classNames('icon', className)}>
            {React.createElement(icon)}
        </div>
    );
};

export default Icon;