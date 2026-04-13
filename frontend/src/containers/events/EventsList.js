import React, {useEffect, useMemo, useState} from 'react';
import {DELETE, GET} from "../../appConfig/Endpoint";
import Table from "../../components/elements/common/table/Table";
import Card from "../../components/layouts/card/Card";
import Button from "../../components/elements/common/button/Button";
import CardHeader from "../../components/layouts/card/CardHeader";
import EventEditModal from "./EventEditModal";
import './events-list.scss'

const EventsList = () => {
    const [events, setEvents] = useState([])
    const [eventModal, setEventModal] = useState(null)

    const actions = {
        getEvents: () => GET('/events', null, {}, data => setEvents(data)),
        deleteEvent: (id) => DELETE('/events', id, () => actions.getEvents())
    }

    useEffect(() => actions.getEvents(), [eventModal])


    const columns = useMemo(() => [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            accessor: 'id',
            columnClass: 'actions',
            Cell: ({row}) => <div className="button-container">
                <Button onClick={() => setEventModal(row.original)} className="edit">Edit</Button>
                <Button onClick={() => actions.deleteEvent(row.original.id)} className="delete">Delete</Button>
            </div>
        }
    ], [events]);

    return (
        <Card className="events-list">
            <CardHeader title="Events" subtitle="All" className="dashboard">
                <Button onClick={() => setEventModal(true)} className="add">Add Event</Button>
            </CardHeader>
            <Table
                columns={columns}
                data={events}
            />
            {eventModal &&
                <EventEditModal
                    event={eventModal}
                    onClose={() => setEventModal(null)}
                />
            }
        </Card>
    );
};

export default EventsList;
