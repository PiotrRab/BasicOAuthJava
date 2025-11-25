import React from 'react';
import Input from "../../elements/inputComponents/input/Input";
import {useFormik} from "formik";
import './LoginPage.scss';
import Button from "../../elements/common/button/Button";
import {useNavigate} from "react-router-dom";
import {POST} from "../../../appConfig/Endpoint";
import MainLayout from "../../layouts/mainLayout/MainLayout";

const LoginPage = () => {
    const navigate = useNavigate();

    const login = (data, callback) => POST('/auth/login', data, callback, false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values) => login(values, () => {
            navigate('/dashboard')
        })
    });

    return (
        <MainLayout>
            <div className="login-page">
                <div className="card">
                    <h1 className="title">Zaloguj się</h1>
                    <div className="input-wrapper">
                        <Input
                            label="Email"
                            formik={formik}
                            name="email"
                            type="email"
                            placeholder="Email"
                        />
                        <Input
                            label="Password"
                            formik={formik}
                            name="password"
                            type="password"
                            placeholder="password"
                        />
                    </div>
                    <Button type="submit" className="login" onClick={() => formik.handleSubmit()}>
                        Login
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginPage;