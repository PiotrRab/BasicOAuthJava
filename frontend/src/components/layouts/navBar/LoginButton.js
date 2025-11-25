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
                        Register
                    </Button>
                    <Button className="login" onClick={()=>navigate('/login')}>
                        Login
                    </Button>
                </div> :
                <Button className="logout" onClick={logout}>
                    Logut
                </Button>
            }
        </div>
    );
};

export default LoginButton;