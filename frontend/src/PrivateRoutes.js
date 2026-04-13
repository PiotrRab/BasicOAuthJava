import React from 'react';
import {Route, Routes} from "react-router-dom";
import PrivateLayout from "./components/layouts/mainLayout/PrivateLayout";
import Users from "./containers/users/Users";
import TagsList from "./containers/tags/TagsList";
import GuestsList from "./containers/guests/GuestsList";
import EventsList from "./containers/events/EventsList";
import RoomLayout from "./containers/room-layout/RoomLayout";

const PrivateRoutes = () => {
    return (
        <PrivateLayout>
            <Routes>
                <Route path="/users" element={<Users/>}/>
                <Route path="/tags" element={<TagsList/>}/>
                <Route path="/guests" element={<GuestsList/>}/>
                <Route path="/events" element={<EventsList/>}/>
                <Route path="/room-layout" element={<RoomLayout/>}/>
            </Routes>
        </PrivateLayout>
    );
};

export default PrivateRoutes;
