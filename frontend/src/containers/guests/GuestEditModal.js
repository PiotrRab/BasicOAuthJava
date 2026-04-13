import React, {useEffect, useState} from 'react';
import Modal from "../../components/layouts/modal/Modal";
import ModalHeader from "../../components/layouts/modal/modalHeader/ModalHeader";
import ModalBody from "../../components/layouts/modal/modalBody/ModalBody";
import ModalFooter from "../../components/layouts/modal/modalFooter/ModalFooter";
import Button from "../../components/elements/common/button/Button";
import Input from "../../components/elements/common/input/Input";
import {useFormik} from "formik";
import {GET, POST, PUT} from "../../appConfig/Endpoint";

const GuestEditModal = ({guest, onClose}) => {
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        GET('/tags', null, {}, data => setAvailableTags(data));
    }, []);

    const actions = {
        updateGuest: (id) => PUT('/guests', id, formik.values, onClose),
        addGuest: () => POST('/guests', formik.values, onClose)
    }

    const formik = useFormik({
        initialValues: {
            firstName: guest.firstName || '',
            lastName: guest.lastName || '',
            tagIds: guest.tags ? guest.tags.map(t => t.id) : []
        },
        onSubmit: () => {
            guest.id ? actions.updateGuest(guest.id) : actions.addGuest()
            onClose()
        }
    })

    const handleTagChange = (tagId) => {
        const currentTags = [...formik.values.tagIds];
        const index = currentTags.indexOf(tagId);
        if (index > -1) {
            currentTags.splice(index, 1);
        } else {
            currentTags.push(tagId);
        }
        formik.setFieldValue('tagIds', currentTags);
    };

    return (
        <Modal>
            <ModalHeader title="Edit Guest" subtitle={guest.firstName ? `${guest.firstName} ${guest.lastName}` : 'New'}>
            </ModalHeader>
            <ModalBody>
                <Input
                    formik={formik}
                    name="firstName"
                    label="First Name"
                />
                <Input
                    formik={formik}
                    name="lastName"
                    label="Last Name"
                />
                <div className="tags-selection">
                    <label className="label">Tags</label>
                    <div className="checkbox-group">
                        {availableTags.map(tag => (
                            <div key={tag.id} className="checkbox-item">
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
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => onClose()} className="cancel">Cancel</Button>
                <Button onClick={() => formik.handleSubmit()} className="save">Save</Button>
            </ModalFooter>
        </Modal>
    );
};

export default GuestEditModal;
