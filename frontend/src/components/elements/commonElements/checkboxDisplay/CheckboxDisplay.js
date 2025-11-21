import React from 'react';
import './checkboxDisplay.scss'
import classNames from "classnames";

const CheckboxDisplay = ({
                             label,
                             children,
                             setChecked,
                             checked,
                             className
                         }) => {

    const handleChange = () => {
        setChecked(!checked);
    };

    return (
        <div className={classNames("checkbox-display", className)}>
            <div className="checkbox-input">
                <span className="checkbox-label">
                    {label}
                </span>
                <input type="checkbox" checked={checked} onChange={handleChange}/>
            </div>
            {checked && (
                <div className="checkbox-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CheckboxDisplay;