import app from "../../config/firebase_config";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";

import styles from "./Login.module.css";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {authActions} from "../../store/authentication-slice";

let phoneNumber = null;
let recaptchaVerifier = null;
let confirmationResult = null;

function LoginPage() {
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const [accountNumber, setAccountNumber] = useState("");
    const [password, setPassword] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");

    const [staffId, setStaffId] = useState("");
    const [staffPassword, setStaffPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [isStaffLogin, setIsStaffLogin] = useState(false);

    useEffect(() => {
        const auth = getAuth(app);
        recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
    }, [])

    const submitHandler = async event => {
        try {
            event.preventDefault();
            if (accountNumber.length !== 24) {
                alert("Enter a valid account number!");
                return;
            }
            setIsLoading(true);
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({accountNumber: accountNumber, password: password}),
            };
            const response = await (await fetch(`${backendUrl}/user/login`, requestOptions)).json();
            if (response === false) {
                alert("Details do not match!");
                setIsLoading(false);
                return;
            }
            phoneNumber = response;
            otpLogin().then(() => null);
        } catch (error) {
            console.log(error);
        }
    }

    const otpLogin = async () => {
        try {
            const auth = getAuth(app);
            confirmationResult = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, recaptchaVerifier);
            setIsSuccess(true);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const otpHandler = async event => {
        try {
            event.preventDefault();
            if (enteredOtp.length !== 6 || isNaN(enteredOtp)) {
                alert("Enter a valid 6 digit OTP");
                return;
            }
            setIsLoading(true);
            const result = await confirmationResult.confirm(enteredOtp);
            const user = result.user;
            const userToken = await user.getIdToken();
            setIsLoading(false);
            dispatch(authActions.loginUser({userToken: userToken}));
            const requestOptions = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({accountNumber: accountNumber}),
            };
            await fetch(`${backendUrl}/user/trackLogin`, requestOptions);
            navigator("/main", {replace: true});
        } catch (error) {
            alert("OTP is incorrect. Try again!");
            setIsLoading(false);
        }
    }

    const staffLoginHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: staffId, password: staffPassword}),
        };
        const id = await (await fetch(`${backendUrl}/staff/login`, requestOptions)).json();
        setIsLoading(false);
        if (id) {
            dispatch(authActions.loginStaff({staffId: id}));
            navigator("/staff", {replace: true});
        } else {
            alert("Incorrect Details!");
        }
    }

    const staffLoginForm = <form className={styles.mainForm} onSubmit={staffLoginHandler}>
        <label htmlFor={"userID"}>User ID:</label>
        <input type={"text"} name={"userID"} required={true} placeholder={"User ID"} value={staffId}
               onChange={event => setStaffId(event.target.value)}/>
        <label htmlFor={"password"}>Password:</label>
        <input type={"password"} required={true} placeholder={"Password"} name={"password"} value={staffPassword}
               onChange={event => setStaffPassword(event.target.value)}/>
        {isLoading ? <LoadingSpinner/> : <input type={"submit"} className={styles.submitButton}/>}
        <button className={"btn btn-outline-info"} type={"button"} onClick={() => setIsStaffLogin(false)}>Customer?
            Login Here!
        </button>
    </form>;

    const formContent = isSuccess ?
        <>
            <form className={styles.mainForm} onSubmit={otpHandler}>
                <label htmlFor={"otp"}>{`OTP sent on ${phoneNumber}`}</label>
                <input type={"text"} name={"otp"} required={true} placeholder={"Enter OTP"}
                       value={enteredOtp}
                       onChange={event => setEnteredOtp(event.target.value)}/>
                {isLoading ? <LoadingSpinner/> : <input type={"submit"} className={styles.submitButton}/>}
            </form>
        </> : <>
            <div id={"recaptcha-container"}></div>
            <form className={styles.mainForm} onSubmit={submitHandler}>
                <label htmlFor={"account_number"}>Account Number:</label>
                <input type={"text"} name={"account_number"} required={true} placeholder={"A/C No."}
                       value={accountNumber}
                       onChange={event => setAccountNumber(event.target.value)}/>
                <label htmlFor={"password"}>Password</label>
                <input type={"password"} name={"password"} required={true} placeholder={"Password"} value={password}
                       onChange={event => setPassword(event.target.value)}/>
                {isLoading ? <LoadingSpinner/> : <input type={"submit"} className={styles.submitButton}/>}
                <button className={"btn btn-outline-info"} type={"button"} onClick={() => setIsStaffLogin(true)}>Bank
                    Staff? Login Here!
                </button>
            </form>
        </>;

    return <div className={`${styles.mainDiv} flex-fill`}>
        {isStaffLogin ? staffLoginForm : formContent}
    </div>
}

export default LoginPage;