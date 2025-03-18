import { ChangeEvent, useRef, useState } from 'react'
import avatar from '../../assets/user.png'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { uploadPhoto } from '../../services/file-service'
import { registrUser, googleSignin, IUser } from '../../services/user-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom';
import style from '../../styles/RegistrationForm.module.css'

function Registration() {
    const [imgSrc, setImgSrc] = useState<File>()
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)
    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }
    const selectImg = () => {
        console.log("Selecting image...")
        fileInputRef.current?.click()
    }

    const register = async () => {
        console.log("registering user");
        //const url = await uploadPhoto(imgSrc!);
        //console.log("upload returned:" + url);
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            const user: IUser = {
                email: emailInputRef.current?.value,
                password: passwordInputRef.current?.value,
              //  profileImage: url
            }
            try{
                const res = await registrUser(user)
                console.log(res)
                navigate('/');
            } catch (error){
                console.error("Registration Failed, error: " + error)
            }
            
        }
    }

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse)
        try {
            const res = await googleSignin(credentialResponse)
            console.log(res)
            // navigate to /
            navigate('/');
        } catch (e) {
            console.log(e)
        }
    }

    const onGoogleLoginFailure = () => {
        console.log("Google login failed")
    }


    return (
        <div className={`vstack gap-3 col-md-7 mx-auto ${style.myFont}`}>
            <div className={style.container} >
                <div className={style.siteLogo}>
                    <img src={logo} className={style.siteLogo} />
                </div>
            </div>
            <div className="d-flex justify-content-center position-relative">
                <img src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} className={`${style.userImage} img-fluid`} />
                <button type="button" className={`${style.imageButton} btn-success position-absolute bottom-0 end-0`} onClick={selectImg}>
                    Upload Profile Picture
                    <FontAwesomeIcon icon={faImage} className={style.cameraIcon}/>
                </button>
            </div>

            <input className={style.imageSelector} ref={fileInputRef} type="file" onChange={imgSelected}></input>

            <div className="form-floating">
                <input ref={emailInputRef} type="text" className="form-control" id="floatingInput" placeholder="" />
                <label htmlFor="floatingInput">Email</label>
            </div>
            <div className="form-floating">
                <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="" />
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <button type="button" className={style.registerButton} onClick={register}>Register</button>
            <div className={style.container} >
                <div className={style.googleStatus}>
                    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
                </div>
            </div>
        </div>)
}

export default Registration