import React, {useEffect, useMemo, useState} from 'react';
import {GET} from "../../../appConfig/Endpoint";
import Table from "../../elements/common/table/Table";

const Dashboard = () => {
    const [users, setUsers] = useState( [])

    useEffect(() => GET('/users', null, {}, data => setUsers(data)),[])

    const columns = useMemo(() => [
        {
            Header: 'Email',
            accessor: 'email',
        }
    ], [users]);

    return (
        <div>
            <Table columns={columns} data={users}/>
        </div>
    );
};

export default Dashboard;