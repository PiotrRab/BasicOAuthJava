import React from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../appConfig/Endpoint";
import Button from "../../elements/commonElements/button/Button";

const LoginButton = ({authenticated}) => {
    const navigate = useNavigate();

    const logout = () => POST('/auth/logout', {}, ()=>navigate('/'))

    return (
        <div className="login-button">
            {!authenticated ?
                <Button className="login-link" onClick={()=>navigate('/login')}>
                    Zaloguj się
                </Button> :
                <Button className="login-link" onClick={logout}>
                    Wyloguj się
                </Button>
            }
        </div>
    );
};

export default LoginButton;