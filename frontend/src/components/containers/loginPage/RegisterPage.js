import React from 'react';
import Input from "../../elements/inputComponents/input/Input";
import Button from "../../elements/common/button/Button";
import MainLayout from "../../layouts/mainLayout/MainLayout";
import {useNavigate} from "react-router-dom";
import {POST} from "../../../appConfig/Endpoint";
import {useFormik} from "formik";
import './LoginPage.scss';

const RegisterPage = () => {

    const navigate = useNavigate();

    const login = (data, callback) => POST('/auth/register', data, callback)

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
                    <h1 className="title">Zarejestruj się</h1>
                    <div className="input-wrapper">
                        <Input
                            label="Email"
                            formik={formik}
                            name="email"
                            type="email"
                            placeholder="Adres email"
                        />
                        <Input
                            label="Hasło"
                            formik={formik}
                            name="password"
                            type="password"
                            placeholder="Hasło"
                        />
                    </div>
                    <Button type="submit" className="login" onClick={() => formik.handleSubmit()}>
                        Register
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;