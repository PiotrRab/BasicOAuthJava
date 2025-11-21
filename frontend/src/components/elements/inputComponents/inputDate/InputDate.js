import React from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import classNames from 'classnames';
import {format, isValid, parseISO} from 'date-fns';
import enGB from "date-fns/locale/en-GB";
import "./inputDate.scss"


const InputDate = ({
                       name,
                       label,
                       onBlur,
                       placeholder = "",
                       className,
                       formatInput = "dd-MM-yyyy",
                       isRequired = true,
                       disabled = false,
                       formik,
                       monthYear = false,
                       minDate,
                       maxDate,
                       defaultDate
                   }) => {
    registerLocale("en-GB", enGB);


    const getSelectedDate = (value) => {
        if (!value) return null;
        try {
            const date = parseISO(value);
            return isValid(date) ? date : null;
        } catch (error) {
            return null;
        }
    };

    const handleDateChange = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        formik.setFieldValue(name, formattedDate);
    };
    const handleBlurInternal = (e) => {
        if ((!formik.values[name] || formik.values[name] === "1970-01-01") && defaultDate) {
            const fallback = typeof defaultDate === 'string'
                ? defaultDate
                : format(defaultDate, 'yyyy-MM-dd');
            formik.setFieldValue(name, fallback);
        }
        if (onBlur) {
            onBlur(e);
        } else {
            formik.handleBlur(e);
        }
    };

    return (
        <div className={classNames("input-date-field", className, {disabled: disabled, error: formik.submitCount > 0 && formik.errors[name] && formik.touched[name]} )}>
            <div className="input-label">
                {label && (
                    <label htmlFor={name} className={classNames("label", {required: isRequired})}>
                        {label}
                    </label>
                )}
            </div>
            <div className={classNames("input-wrapper", {name}, className)}>
                <DatePicker
                    id={name}
                    name={name}
                    selected={getSelectedDate(formik.values[name])}
                    onChange={handleDateChange}
                    onBlur={handleBlurInternal}
                    dateFormat={formatInput}
                    placeholderText={placeholder}
                    disabled={disabled}
                    className="input-date"
                    showMonthYearPicker={monthYear}
                    minDate={minDate}
                    maxDate={maxDate}
                    autoComplete="off"
                    locale="en-GB"
                    dayClassName={(date) => {
                        const startDate = formik.values.startDate ? new Date(formik.values.startDate) : null;
                        const endDate = formik.values.endDate ? new Date(formik.values.endDate) : null;

                        if (startDate && date.toDateString() === startDate.toDateString()) {
                            return "start-date";
                        }

                        if (endDate && date.toDateString() === endDate.toDateString()) {
                            return "end-date";
                        }

                        if (startDate && endDate && date > startDate && date < endDate) {
                            return "date-range";
                        }

                        return "";
                    }}
                />
            </div>
        </div>
    );
};

export default InputDate;
