import React from 'react';
import Modal from "../../components/layouts/modal/Modal";
import ModalHeader from "../../components/layouts/modal/modalHeader/ModalHeader";
import ModalBody from "../../components/layouts/modal/modalBody/ModalBody";
import ModalFooter from "../../components/layouts/modal/modalFooter/ModalFooter";
import Button from "../../components/elements/common/button/Button";
import Input from "../../components/elements/common/input/Input";
import {useFormik} from "formik";
import {POST, PUT} from "../../appConfig/Endpoint";

const TagEditModal = ({tag, onClose}) => {

    const actions = {
        updateTag: (id) => PUT('/tags', id, formik.values, onClose),
        addTag: () => POST('/tags', formik.values, onClose)
    }

    const formik = useFormik({
        initialValues: {
            name: tag.name || '',
        },
        onSubmit: () => {
            tag.id ? actions.updateTag(tag.id) : actions.addTag()
            onClose()
        }
    })

    return (
        <Modal>
            <ModalHeader title="Edit Tag" subtitle={tag.name ? tag.name : 'New'}>
            </ModalHeader>
            <ModalBody>
                <Input
                    formik={formik}
                    name="name"
                    label="Name"
                />
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => onClose()} className="cancel">Cancel</Button>
                <Button onClick={() => formik.handleSubmit()} className="save">Save</Button>
            </ModalFooter>
        </Modal>
    );
};

export default TagEditModal;
