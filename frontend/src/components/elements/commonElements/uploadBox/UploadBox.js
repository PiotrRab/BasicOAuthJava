import React from 'react';
import "./uploadBox.scss"
import classNames from "classnames";

const UploadBox = ({
                       children,
                       className
                   }) => {


    return (
        <div className={classNames("upload-box", className)}>
            {children}
        </div>
    );
};

export default UploadBox;