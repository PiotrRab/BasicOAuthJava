import React from 'react';
import Input from "../../components/elements/common/input/Input";
import Button from "../../components/elements/common/button/Button";
import MainLayout from "../../components/layouts/mainLayout/MainLayout";
import {useNavigate} from "react-router-dom";
import {POST} from "../../appConfig/Endpoint";
import {useFormik} from "formik";
import './LoginPage.scss';

const RegisterPage = () => {

    const navigate = useNavigate();

    const login = (data, callback) => POST('/auth/register', data, callback, false)

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
                        Register
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;