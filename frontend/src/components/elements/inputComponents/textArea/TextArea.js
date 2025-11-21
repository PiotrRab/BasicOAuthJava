import React from 'react'
import './textArea.scss'
import classNames from "classnames";

const TextArea = ({
                      name,
                      label,
                      formik,
                      textareaClassName,
                      rows,
                      cols,
                      isRequired = true,
                      disabled,
                      placeholder = ""
                  }) => {

    return (
        <div className={classNames("textarea-field", name, {
            disabled: disabled,
            error: formik.submitCount > 0 && formik.errors[name] && formik.touched[name]
        })}>
            <div className="input-label">
                {label && <label htmlFor={name} className={classNames("label", {required: isRequired})}>
                    {label}
                </label>}
            </div>
            <textarea
                id={name}
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={classNames(textareaClassName, name, {
                    disabled: disabled,
                    error: formik.submitCount > 0 && formik.errors[name] && formik.touched[name]
                })}
                rows={rows}
                cols={cols}
                placeholder={disabled ? "-" : placeholder}
                disabled={disabled}
            />
        </div>
    )
}

export default TextArea