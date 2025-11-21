import React from 'react'
import './button.scss'
import classNames from 'classnames'

const Button = ({
                    children,
                    onClick,
                    className,
                    type,
                    reference,
                }) => {

    return (
        <button
            ref={reference}
            onClick={onClick}
            type={type}
            className={classNames('button', className)}
        >
            {children}
        </button>
    )
}

export default Button