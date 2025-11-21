import React from 'react';
import classNames from "classnames";
import "./fieldBox.scss"

const FieldBox = ({className, name, value}) => {
    return (
        <div className={classNames("field", className)}>
            <label className={classNames("label" , className)}>{name}</label>
            <span className={classNames("value", className)}>{value}</span>
        </div>
    );
};

export default FieldBox;