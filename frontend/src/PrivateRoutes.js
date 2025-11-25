import React from 'react';
import {Route, Routes} from "react-router-dom";
import PrivateLayout from "./components/layouts/mainLayout/PrivateLayout";
import Users from "./components/containers/users/Users";

const PrivateRoutes = () => {
    return (
        <PrivateLayout>
            <Routes>
                <Route path="/users" element={<Users/>}/>
            </Routes>
        </PrivateLayout>
    );
};

export default PrivateRoutes;