import React from 'react'
import './modalHeader.scss'
import classNames from "classnames";

const ModalHeader = ({title, subtitle, children, className}) => {
  return (
    <div className={classNames('modal-header',className)}>
        <span className="title">{title}{subtitle}</span>
        {children}
    </div>
  )
}

export default ModalHeader