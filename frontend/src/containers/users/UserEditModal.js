import React from 'react';
import Modal from "../../components/layouts/modal/Modal";
import ModalHeader from "../../components/layouts/modal/modalHeader/ModalHeader";
import ModalBody from "../../components/layouts/modal/modalBody/ModalBody";
import ModalFooter from "../../components/layouts/modal/modalFooter/ModalFooter";
import Button from "../../components/elements/common/button/Button";
import Input from "../../components/elements/common/input/Input";
import {useFormik} from "formik";
import {POST, PUT} from "../../appConfig/Endpoint";

const UserEditModal = ({user, onClose}) => {

    const actions = {
        updateUser:(id)=> PUT('/users', id, formik.values, onClose),
        addUser:()=> POST('/users', formik.values, onClose)
    }

    const formik = useFormik({
        initialValues: {
            email: user.email,
            password: '',
            role: user.role,
        },
        onSubmit: () => {
            user.id ? actions.updateUser(user.id) : actions.addUser()
            onClose()
        }
    })

    return (
        <Modal>
            <ModalHeader title="Edit user" subtitle={ user.email ? user.email : 'New'}>

            </ModalHeader>
            <ModalBody>
                <Input
                    formik={formik}
                    name="email"
                    label="Email"
                />
                <Input
                    formik={formik}
                    name="password"
                    label="Password"
                />
            </ModalBody>
            <ModalFooter>
                <Button onClick={()=>onClose()} className="cancel">Cancel</Button>
                <Button onClick={()=>formik.handleSubmit()} className="save">Save</Button>
            </ModalFooter>
        </Modal>
    );
};

export default UserEditModal;