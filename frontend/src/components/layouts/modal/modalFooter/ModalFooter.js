import React from 'react'
import './modalFooter.scss'
import classNames from "classnames";

const ModalFooter = ({children, className}) => {
    return (
        <div className={classNames('footer',className)}>
            {children}
        </div>
    )
}

export default ModalFooter