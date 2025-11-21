import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import LoginPage from "./components/containers/loginPage/LoginPage";
import WelcomePage from "./components/containers/welcomePage/WelcomePage";
import { GET } from "./appConfig/Endpoint";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "./store";

const App = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const authorized = callback => GET("/auth/me", null, null, callback);

    useEffect(() => {
        authorized((isAuth) => dispatch(setAuthenticated(isAuth)));
    }, [location.pathname, dispatch]);

    return (
        <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<PrivateRoutes />} />
        </Routes>
    );
};

export default App;
