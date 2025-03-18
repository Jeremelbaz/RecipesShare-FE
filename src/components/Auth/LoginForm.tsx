import { useRef } from 'react';
import logo from '../../assets/logo.png';
import { loginUser, googleSignin } from '../../services/user-service';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import style from '../../styles/LoginForm.module.css';

function Login() {
    const navigate = useNavigate();
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const login = async () => {
        console.log("Logging in user");
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            try {
                const res = await loginUser({
                    email: emailInputRef.current.value,
                    password: passwordInputRef.current.value
                });
                console.log(res);
                navigate('/');
            } catch (error) {
                console.error("Login Failed, error: " + error);
            }
        }
    };

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse);
        try {
            const res = await googleSignin(credentialResponse);
            console.log(res);
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleLoginFailure = () => {
        console.log("Google login failed");
    };

    return (
        <div className={`vstack gap-3 col-md-7 mx-auto ${style.myFont}`}>
            <div className={style.container}>
                <div className={style.siteLogo}>
                    <img src={logo} className={style.siteLogo} />
                </div>
            </div>
            <div className="form-floating">
                <input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder="" />
                <label htmlFor="floatingInput">Email</label>
            </div>
            <div className="form-floating">
                <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="" />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <button type="button" className={style.loginButton} onClick={login}>Login</button>
            <div className={style.container}>
                <div className={style.googleStatus}>
                    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
                </div>
            </div>
        </div>
    );
}

export default Login;
