import pdf from "../../assets/ac-opening-individual.pdf";
import styles from "./Registration.module.css";
import {useState} from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import {backendUrl} from "../../config/constants";

import {getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage"
import app from "../../config/firebase_config";

function Registration() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [trackingId, setTrackingId] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = event => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    const trackIdHandler = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                trackingId: trackingId
            }),
        };
        const response = await (await fetch(`${backendUrl}/user/trackRequest`, requestOptions)).json();
        alert(response.status);
        setTrackingId("");
    }

    const submitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        const storage = getStorage(app);
        const storageRef = ref(storage, `/files/${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                fileUrl: downloadUrl
            }),
        };
        const response = await (await fetch(`${backendUrl}/user/register`, requestOptions)).json();
        if (response === false) {
            alert("Something went wrong!");
            setIsLoading(false);
            return;
        }
        alert(`Request submitted successfully!\nUse ${response} tracking id to track your request.`);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setSelectedFile(null);
        setIsLoading(false);
    }

    return <div className={`flex-fill ${styles.mainDiv}`}>
        <form className={styles.mainForm} onSubmit={submitHandler}>
            <label className={styles.labels} htmlFor={"firstName"}>First Name:</label>
            <input className={styles.inputs} type={"text"} id={"firstName"} required={true} placeholder={"First Name"}
                   pattern="^[A-Za-z]{2,}$" title="Please enter at least 2 alphabetic characters for the first name"
                   value={firstName} onChange={event => setFirstName(event.target.value)}/>
            <label className={styles.labels} htmlFor="lastName">Last Name:</label>
            <input className={styles.inputs} type="text" id="lastName" name="lastName" required value={lastName}
                   pattern="^[A-Za-z]{2,}$" title="Please enter at least 2 alphabetic characters for the last name"
                   onChange={event => setLastName(event.target.value)}
                   placeholder="Last Name"/>
            <label className={styles.labels} htmlFor="eMail">Email:</label>
            <input className={styles.inputs} type="email" id="eMail" name="eMail" required value={email}
                   onChange={event => setEmail(event.target.value)}
                   placeholder="abc123@sample.com"/>
            <label className={styles.labels} htmlFor={"phoneNumber"}>Enter Phone Number:</label>
            <input className={styles.inputs} id={"phoneNumber"} type={"text"} required={true} value={phoneNumber}
                   pattern="\d{10}" title="Please enter 10 digits phone number"
                   onChange={event => setPhoneNumber(event.target.value)}
                   placeholder={"XXXXXXXXXX"}/>
            <label className={styles.labels} htmlFor="file">Upload the Account Opening Form in a PDF File:</label>
            <input className={styles.inputs} type="file" id="file" name="applicationForm" style={{color: "white"}}
                   required
                   onChange={handleFileChange}
                   accept="application/pdf"/>
            {isLoading ? <LoadingSpinner/> : <input className={styles.inputs} type="submit" value="Register"/>}
            <a href={pdf} target={"_blank"} rel="noreferrer">Download Account Opening Form</a>
            <br/><br/>
            <button className={'btn btn-primary'} type={"button"} data-bs-toggle="modal"
                    data-bs-target="#trackModal">Track Request
            </button>
            <div className="modal fade" id="trackModal" tabIndex="-1" aria-labelledby="trackModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <label htmlFor={"trackId"}>Tracking ID:</label>
                            <input id={"trackId"} type={"text"} value={trackingId}
                                   onChange={event => setTrackingId(event.target.value)}/>
                            <button className={"btn btn-primary"} type={"button"} onClick={trackIdHandler}>Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>;
}

export default Registration;