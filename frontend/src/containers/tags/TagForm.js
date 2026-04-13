import React, {useEffect} from "react";
import {useFormik} from "formik";
import {POST, PUT} from "../../appConfig/Endpoint";
import Input from "../../components/elements/common/input/Input";
import Button from "../../components/elements/common/button/Button";
import * as Yup from "yup";

const TagForm = ({ onSuccess, editingTag, clearEditing }) => {

    const formik = useFormik({
        initialValues: {
            name: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Nazwa tagu jest wymagana")
        }),
        onSubmit: (values, { resetForm }) => {
            const callback = (data) => {
                onSuccess();
                resetForm();
                if (editingTag) clearEditing();
            };

            if (editingTag) {
                PUT("/api/tags", editingTag.id, values, callback);
            } else {
                POST("/api/tags", values, callback);
            }
        }
    });

    useEffect(() => {
        if (editingTag) {
            formik.setValues({ name: editingTag.name });
        }
    }, [editingTag]);

    return (
        <form onSubmit={formik.handleSubmit} className="tag-form">
            <Input
                name="name"
                label="Nazwa tagu"
                formik={formik}
                placeholder="Np. Rodzina"
            />
            <div className="form-actions">
                <Button type="submit">
                    {editingTag ? "Zaktualizuj" : "Dodaj Tag"}
                </Button>
                {editingTag && (
                    <Button onClick={() => { clearEditing(); formik.resetForm(); }}>
                        Anuluj
                    </Button>
                )}
            </div>
        </form>
    );
};

export default TagForm;
