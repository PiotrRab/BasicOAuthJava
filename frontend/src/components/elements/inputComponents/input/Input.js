import React, {useEffect, useRef} from "react";
import "./input.scss";
import classNames from "classnames";

const Input = ({
                   type = "text",
                   name,
                   label,
                   formik,
                   placeholder = "",
                   className,
                   disabled,
                   checked,
                   onChange,
                   isRequired = true,
                   suffix,
                   onBlur,
                   children
               }) => {

    const inputRef = useRef(null);
    const measureRef = useRef(null);

    useEffect(() => {
        if (suffix && inputRef.current && measureRef.current) {
            measureRef.current.textContent = formik.values[name] || placeholder;
            const newWidth = measureRef.current.offsetWidth;
            inputRef.current.style.width = `${newWidth}px`;
        }
    }, [formik.values[name], name, placeholder, disabled]);


    return (
        <div className={classNames("input-field", name, className, {
            disabled: disabled,
            error: formik.submitCount > 0 && formik.errors[name] && formik.touched[name]
        })}>
            <div className="input-label">
                {label && <label htmlFor={name} className={classNames("label", {required: isRequired})}>
                    {label}
                </label>}
            </div>
            <div className={classNames("input-wrapper", name, className)}>
                <input
                    type={type}
                    id={name}
                    ref={inputRef}
                    name={name}
                    value={formik.values[name]}
                    onChange={onChange ? onChange : formik.handleChange}
                    onBlur={onBlur ? onBlur : formik.handleBlur}
                    className="input"
                    placeholder={disabled ? "-" : placeholder}
                    disabled={disabled}
                    checked={checked}
                />
                {suffix && disabled &&
                    <span className="suffix">{suffix}</span>
                }
                {children}
                <div
                    className="width-machine"
                    ref={measureRef}>
                </div>
            </div>
        </div>
    );
};

export default Input;