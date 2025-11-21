import React, {useEffect, useState} from 'react';
import * as actions from "./AttributesAcions"
import Input from "../input/Input";
import classNames from "classnames";
import "./selectAttributes.scss"

const SelectAttributes = ({
                        formik,
                        isRequired=false,
                        disabled,
                        label,
                        name
                    }) => {
    const [attributes, setAttributes] = useState([])

    useEffect(() => {
        actions.loadAttributes((loadedAttributes) => {
            setAttributes(loadedAttributes)
        })
    }, []);


    const handleCheckboxChange = (attributeId, event) => {
        const checked = event.target.checked;
        let current = formik.values.attributes;
        if (checked) {
            if (!current.some(attr => attr.id === attributeId)) {
                current = [...current, {id: attributeId}];
            }
        } else {
            current = current.filter(attr => attr.id !== attributeId);
        }
        formik.setFieldValue("attributes", current);
    };

    const displayedAttributes = disabled
        ? attributes.filter(attr => formik.values.attributes.some(selected => selected.id === attr.id))
        : attributes;

    return (
        <div>
            <div className={classNames("select-attributes",{hidden:displayedAttributes.length===0})}>
                {label && <label htmlFor={name} className={classNames("label", {required: isRequired})}>
                    {label}
                </label>}
            </div>
            {displayedAttributes.map((attribute) => (
                <div key={attribute.id}>
                    <Input
                        label={attribute.name}
                        type="checkbox"
                        name="attributes"
                        formik={formik}
                        onChange={(e) => handleCheckboxChange(attribute.id, e)}
                        checked={formik.values.attributes.some(attr => attr.id === attribute.id)}
                        isRequired={isRequired}
                        disabled={disabled}
                    />
                </div>
            ))}
        </div>
    );
};

export default SelectAttributes;