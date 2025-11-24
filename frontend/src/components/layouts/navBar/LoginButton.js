import React from 'react';
import {useNavigate} from "react-router-dom";
import {POST} from "../../../appConfig/Endpoint";
import Button from "../../elements/common/button/Button";

const LoginButton = ({authenticated}) => {
    const navigate = useNavigate();

    const logout = () => POST('/auth/logout', {}, ()=>navigate('/'))

    return (
        <div className="login-button">
            {!authenticated ?
                <div className="button-container">
                    <Button className="login" onClick={()=>navigate('/register')}>
                        Zarejstruj się
                    </Button>
                    <Button className="login" onClick={()=>navigate('/login')}>
                        Zaloguj się
                    </Button>
                </div> :
                <Button className="logout" onClick={logout}>
                    Wyloguj się
                </Button>
            }
        </div>
    );
};

export default LoginButton;