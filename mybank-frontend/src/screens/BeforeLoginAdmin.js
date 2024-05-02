import app from "../config/firebase_config";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

import styles from "./BeforeLoginAdmin.module.css";
import {useState} from "react";
import {useDispatch} from "react-redux";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import {authActions} from "../store/authentication-slice";
import {useNavigate} from "react-router-dom";

function BeforeLoginAdmin() {
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const [enteredID, setEnteredID] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        if (enteredID.length <= 0 || enteredPassword.length <= 0) {
            alert("Please enter valid values in the field!");
            return;
        }
        setIsLoading(true);
        try {
            const auth = getAuth(app);
            const userCredential = await signInWithEmailAndPassword(auth, enteredID, enteredPassword);
            const user = userCredential.user;
            const adminToken = await user.getIdToken();
            dispatch(authActions.loginAdmin({adminToken: adminToken}));
            setIsLoading(false);
            navigator("/admin/main", {replace: true});
        } catch (error) {
            setIsLoading(false);
            alert(`Error Code: ${error.code}\n${error.message}`);
        }
    }

    return <div className={`${styles.mainDiv} flex-fill`}>
        <form className={`${styles.mainForm}`} onSubmit={submitHandler}>
            <div>
                <label htmlFor="admin_id">Admin Mail:</label>
                <input type="email" name="admin_mail" required placeholder="Admin Mail" value={enteredID}
                       onChange={(value) => setEnteredID(value.target.value)}/>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" required placeholder="Password" value={enteredPassword}
                       onChange={value => setEnteredPassword(value.target.value)}/>
                {isLoading ? <LoadingSpinner/> : <input type="submit" className={`${styles.submitButton}`}/>}
            </div>
        </form>
    </div>
}

export default BeforeLoginAdmin;