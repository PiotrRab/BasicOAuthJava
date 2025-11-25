import React, {useEffect, useMemo, useState} from 'react';
import {GET} from "../../../appConfig/Endpoint";
import Table from "../../elements/common/table/Table";
import Card from "../../layouts/card/Card";

const Dashboard = () => {
    const [users, setUsers] = useState( [])

    useEffect(() => GET('/users', null, {}, data => setUsers(data)),[])

    const columns = useMemo(() => [
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Role',
            accessor: 'role',
        }
    ], [users]);

    return (
        <Card title="Users" subtitle="All">
            <Table columns={columns} data={users}/>
        </Card>
    );
};

export default Dashboard;