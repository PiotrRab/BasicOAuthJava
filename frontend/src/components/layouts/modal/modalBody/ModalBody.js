import React from 'react'
import './modalBody.scss'
import classNames from "classnames";

const ModalBody = ({children, className}) => {
    return (
        <div className={classNames('body', className)}>
            {children}
        </div>
    )
}

export default ModalBody