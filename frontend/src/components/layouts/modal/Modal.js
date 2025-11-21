import React from 'react'
import './modal.scss'
import classNames from "classnames";

const Modal = ({children,className, onClick}) => {
    return (
        <div className={classNames('modal', className)} onClick={onClick}>
            <div className='modal-container' onClick={(e)=> e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal