import React, {useEffect, useState} from 'react';
import Modal from "../../components/layouts/modal/Modal";
import ModalHeader from "../../components/layouts/modal/modalHeader/ModalHeader";
import ModalBody from "../../components/layouts/modal/modalBody/ModalBody";
import ModalFooter from "../../components/layouts/modal/modalFooter/ModalFooter";
import Button from "../../components/elements/common/button/Button";
import Input from "../../components/elements/common/input/Input";
import {useFormik} from "formik";
import {GET, POST, PUT} from "../../appConfig/Endpoint";

const EventEditModal = ({event, onClose}) => {
    const [availableGuests, setAvailableGuests] = useState([]);

    useEffect(() => {
        GET('/guests', null, {}, data => setAvailableGuests(data));
    }, []);

    const actions = {
        updateEvent: (id) => PUT('/events', id, formik.values, onClose),
        addEvent: () => POST('/events', formik.values, onClose)
    }

    const formik = useFormik({
        initialValues: {
            name: event.name || '',
            date: event.date || '',
            guestIds: event.guests ? event.guests.map(g => g.id) : []
        },
        onSubmit: () => {
            event.id ? actions.updateEvent(event.id) : actions.addEvent()
            onClose()
        }
    })

    const handleGuestChange = (guestId) => {
        const currentGuests = [...formik.values.guestIds];
        const index = currentGuests.indexOf(guestId);
        if (index > -1) {
            currentGuests.splice(index, 1);
        } else {
            currentGuests.push(guestId);
        }
        formik.setFieldValue('guestIds', currentGuests);
    };

    return (
        <Modal>
            <ModalHeader title="Edit Event" subtitle={event.name ? event.name : 'New'}>
            </ModalHeader>
            <ModalBody>
                <Input
                    formik={formik}
                    name="name"
                    label="Name"
                />
                <Input
                    formik={formik}
                    name="date"
                    label="Date"
                    type="date"
                />
                <div className="guests-selection">
                    <label className="label">Guests</label>
                    <div className="checkbox-group">
                        {availableGuests.map(guest => (
                            <div key={guest.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`guest-${guest.id}`}
                                    checked={formik.values.guestIds.includes(guest.id)}
                                    onChange={() => handleGuestChange(guest.id)}
                                />
                                <label htmlFor={`guest-${guest.id}`}>{guest.firstName} {guest.lastName}</label>
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

export default EventEditModal;
