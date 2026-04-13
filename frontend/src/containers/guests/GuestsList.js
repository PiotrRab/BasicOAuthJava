import React, {useEffect, useMemo, useState} from 'react';
import {DELETE, GET} from "../../appConfig/Endpoint";
import Table from "../../components/elements/common/table/Table";
import Card from "../../components/layouts/card/Card";
import Button from "../../components/elements/common/button/Button";
import CardHeader from "../../components/layouts/card/CardHeader";
import GuestEditModal from "./GuestEditModal";
import './guests-list.scss';

const GuestsList = () => {
    const [guests, setGuests] = useState([])
    const [guestModal, setGuestModal] = useState(null)

    const actions = {
        getGuests: () => GET('/guests', null, {}, data => setGuests(data)),
        deleteGuest: (id) => DELETE('/guests', id, () => actions.getGuests())
    }

    // Odśwież listę po zamknięciu modala
    useEffect(() => {
        actions.getGuests();
    }, [guestModal]);

    const columns = useMemo(() => [
        {
            Header: 'First Name',
            accessor: 'firstName',
        },
        {
            Header: 'Last Name',
            accessor: 'lastName',
        },
        {
            Header: 'Tags',
            accessor: 'tags',
            Cell: ({value}) => (
                <div className="tags-container">
                    {value && value.map(t => (
                        <span key={t.id} className="tag-badge">{t.name}</span>
                    ))}
                </div>
            )
        },
        {
            accessor: 'id',
            columnClass: 'actions',
            Cell: ({row}) => (
                <div className="button-container">
                    <Button onClick={() => setGuestModal(row.original)} className="edit">Edit</Button>
                    <Button onClick={() => actions.deleteGuest(row.original.id)} className="delete">Delete</Button>
                </div>
            )
        }
    ], [guests]);

    return (
        <Card className="guests-list">
            <CardHeader title="Guest List" subtitle="Manage your attendees" className="dashboard">
                <Button onClick={() => setGuestModal(true)} className="add">Add Guest</Button>
            </CardHeader>
            <Table
                columns={columns}
                data={guests}
            />
            {guestModal && (
                <GuestEditModal
                    guest={guestModal === true ? {} : guestModal}
                    onClose={() => setGuestModal(null)}
                />
            )}
        </Card>
    );
};

export default GuestsList;
