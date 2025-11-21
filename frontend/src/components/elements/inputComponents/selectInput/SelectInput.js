import React, {useEffect, useRef, useState} from 'react';
import './select.scss';
import classNames from "classnames";
import Button from "../../commonElements/button/Button";
import Icon from "../../commonElements/icon/Icon";
import {ReactComponent as dropDown} from "../../../assets/dropDown.svg";

const SelectInput = ({
                         className,
                         name,
                         label,
                         options = [],
                         formik,
                         onChange,
                         onCreate,
                         disabled,
                         defaultValue
                     }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedValue = formik.values[name];
    const containerRef = useRef(null);

    useEffect(() => {
        if (disabled) {
            setIsOpen(false);
        }
    }, [disabled]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    useEffect(() => {
        if (!formik.values[name] && defaultValue) {
            formik.setFieldValue(name, defaultValue.value);
            if (onChange) {
                onChange(defaultValue.value);
            }
        }
    }, [defaultValue, formik, name, onChange]);

    const getOptionId = (option) => {
        return (typeof option.value === 'object' && option.value.id) ? option.value.id : option.value;
    };

    const handleOptionClick = (option) => {
        if (option.value === "createNew") {
            onCreate();
        } else {
            formik.setFieldValue(name, option.value);
            if (onChange) {
                onChange(option.value);
            }
            if (name === "currentTenant" && option.value?.id) {
                formik.setFieldValue("rentalStatus", "Rented");
            } else if (name === "currentTenant" && !option.value?.id) {
                formik.setFieldValue("rentalStatus", "Free");
            }
        }
        setIsOpen(false);
    }
    const toggleOpen = () => {
        if (!disabled) {
            setIsOpen((previous) => !previous);
        }
    };

    const selectedLabel = options.find(option => {
        const optionId = getOptionId(option);
        return optionId === selectedValue?.id || optionId === selectedValue;
    })?.label;

    return (
        <div ref={containerRef} className={classNames('select', className, {open: isOpen}, {disabled: disabled})}>
            {label && <label htmlFor={name}>{label}</label>}
            <Button type="button"
                    variant={classNames("selected-option", className, selectedLabel).toLowerCase()}
                    onClick={toggleOpen}>
                    <span className={classNames("selected-option", selectedLabel).toLowerCase()}>
                        {defaultValue ? selectedLabel || (options.length > 0 && options[0].label) :
                            !selectedLabel && options.length > 0 ? options[options.length - 1].label : selectedLabel ? selectedLabel : ''}
                    </span>
                <Icon icon={dropDown} className="drop-down"/>
            </Button>
            {isOpen && (
                <ul
                    className="options">
                    {options.map(option => (
                        <li
                            key={getOptionId(option)}
                            className={String(getOptionId(option)).toLowerCase()}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </li>))}
                </ul>
            )}
            {formik.touched[name] && formik.errors[name] && (<div className='error'>{formik.errors[name]}</div>)}
        </div>
    );
};

export default SelectInput;