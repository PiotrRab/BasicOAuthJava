import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import PrivateLayout from "./components/layouts/mainLayout/PrivateLayout";
import Dashboard from "./components/containers/dashboard/Dashboard";
import {GET} from "./appConfig/Endpoint";

const PrivateRoutes = () => {
    return (
        <PrivateLayout>
            <Routes>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </PrivateLayout>
    );
};

export default PrivateRoutes;