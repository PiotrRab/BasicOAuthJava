import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {GET, POST, PUT} from "../../appConfig/Endpoint";
import Input from "../../components/elements/common/input/Input";
import Button from "../../components/elements/common/button/Button";
import * as Yup from "yup";

const GuestForm = ({ onSuccess, editingGuest, clearEditing }) => {
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        GET("/api/tags", null, null, setAvailableTags);
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            tagIds: []
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("Imię jest wymagane"),
            lastName: Yup.string().required("Nazwisko jest wymagane")
        }),
        onSubmit: (values, { resetForm }) => {
            const callback = () => {
                onSuccess();
                resetForm();
                if (editingGuest) clearEditing();
            };

            if (editingGuest) {
                PUT("/api/guests", editingGuest.id, values, callback);
            } else {
                POST("/api/guests", values, callback);
            }
        }
    });

    useEffect(() => {
        if (editingGuest) {
            formik.setValues({
                firstName: editingGuest.firstName,
                lastName: editingGuest.lastName,
                tagIds: editingGuest.tags ? editingGuest.tags.map(t => t.id) : []
            });
        }
    }, [editingGuest]);

    const handleTagChange = (tagId) => {
        const currentTagIds = [...formik.values.tagIds];
        const index = currentTagIds.indexOf(tagId);
        if (index > -1) {
            currentTagIds.splice(index, 1);
        } else {
            currentTagIds.push(tagId);
        }
        formik.setFieldValue("tagIds", currentTagIds);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="guest-form">
            <Input name="firstName" label="Imię" formik={formik} />
            <Input name="lastName" label="Nazwisko" formik={formik} />

            <div className="tags-selection">
                <label className="label">Tagi:</label>
                <div className="checkboxes-wrapper">
                    {availableTags.map(tag => (
                        <div key={tag.id} className="tag-checkbox">
                            <input
                                type="checkbox"
                                id={`tag-${tag.id}`}
                                checked={formik.values.tagIds.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                            />
                            <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-actions">
                <Button type="submit">
                    {editingGuest ? "Zaktualizuj" : "Dodaj Gościa"}
                </Button>
                {editingGuest && (
                    <Button onClick={() => { clearEditing(); formik.resetForm(); }}>
                        Anuluj
                    </Button>
                )}
            </div>
        </form>
    );
};

export default GuestForm;
