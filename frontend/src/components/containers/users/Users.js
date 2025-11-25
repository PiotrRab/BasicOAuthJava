import React, {useEffect, useMemo, useState} from 'react';
import {DELETE, GET} from "../../../appConfig/Endpoint";
import Table from "../../elements/common/table/Table";
import Card from "../../layouts/card/Card";
import Button from "../../elements/common/button/Button";
import './Users.scss'

const Users = () => {
    const [users, setUsers] = useState([])
    const [userModal, setUserModal] = useState(null)

    const actions = {
        getUser: () => GET('/users', null, {}, data => setUsers(data)),
        deleteUser: (id) => DELETE('/users', id, data => setUsers(data))
    }

    useEffect(() => actions.getUser(), [])


    const columns = useMemo(() => [
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Role',
            accessor: 'role',
        },
        {
            accessor: 'id',
            columnClass: 'actions',
            Cell: ({row}) => <div className="button-container">
                <Button onClick={() => setUserModal(row.original.id)} className="edit">Edit</Button>
                <Button onClick={() => actions.deleteUser(row.original.id)} className="delete">Delete</Button>
            </div>
        }
    ], [users]);

    return (
        <Card title="Users" subtitle="All" className="dashboard">
            <Table columns={columns} data={users}/>
        </Card>
    );
};

export default Users;