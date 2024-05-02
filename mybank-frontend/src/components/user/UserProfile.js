import profileImage from "../../assets/profile_image.jpeg";
import styles from "./UserProfile.module.css";
import SpaceDiv from "../UI/SpaceDiv";
import {useEffect, useState} from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import {useSelector} from "react-redux";
import {backendUrl} from "../../config/constants";

function UserProfile() {
    const userToken = useSelector(state => state.authentication.userToken);

    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const requestOptions = {
            headers: {"Content-Type": "application/json", "userToken": userToken},
        };
        const fetchData = async () => {
            setIsLoading(true);
            const response = await (await fetch(`${backendUrl}/user/profileDetails`, requestOptions)).json();
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setEmail(response.email);
            setPhone(response.phone);
            setIsLoading(false);
        }
        fetchData().then(() => null);
    }, [userToken]);

    const passwordChangeHandler = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Password does not match! Please retry");
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userToken: userToken, oldPassword: oldPassword, newPassword: newPassword}),
        };
        const response = await (await fetch(`${backendUrl}/user/changePassword`, requestOptions)).json();
        alert(`${response.message}`);
        setConfirmPassword("");
        setOldPassword("");
        setNewPassword("");
    }

    const profilePasswordChangeHandler = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Password does not match! Please retry");
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userToken: userToken, oldPassword: oldPassword, newPassword: newPassword}),
        };
        const response = await (await fetch(`${backendUrl}/user/changeProfilePassword`, requestOptions)).json();
        alert(`${response.message}`);
        setConfirmPassword("");
        setOldPassword("");
        setNewPassword("");
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={20}/>
            <LoadingSpinner/>
            <SpaceDiv flexSpace={true}/>
        </>;
    }

    return <>
        <SpaceDiv height={2.5}/>
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img className="mt-5" width="150px" src={profileImage} alt={"profile"}/>
                    </div>
                </div>
                <div className="col-md-9 border-right">
                    <div className="p-3 py-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h1 className={styles.heading}>Profile Dashboard</h1>
                        </div>
                        <div className={`${styles.nameRow} row mt-2`}>
                            <div className="col-md-4" style={{margin: "1rem", textAlign: "center"}}>
                                <span>First Name</span>: {firstName}
                            </div>
                            <div className="col-md-4" style={{margin: "1rem", textAlign: "center"}}>
                                <span>Last Name</span>: {lastName}
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12" style={{margin: "1rem"}}>
                                <span style={{fontWeight: "bold"}}>Mobile Number</span>: {phone}
                            </div>
                            <div className="col-md-12" style={{margin: "1rem"}}>
                                <span style={{fontWeight: "bold"}}>Email</span>: {email}
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-12" style={{margin: "1rem"}}>
                                    <span style={{fontWeight: "bold"}}>Address</span>: Lorem ipsum dolor sit amet,
                                    consectetur adipisicing elit. Ad iure neque soluta velit!
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-12" style={{margin: "1rem"}}>
                                    <span style={{fontWeight: "bold"}}>Postal Code</span>: 201014
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="col-md-12" style={{margin: "1rem"}}>
                                    <span style={{fontWeight: "bold"}}>Member Since</span>: December 1st, 2023
                                </div>
                            </div>
                            <div className={"col-md-12"}>
                                <button className={"btn btn-warning btn-lg"}
                                        style={{marginLeft: "20rem", marginBottom: "1rem"}}
                                        data-bs-toggle="modal"
                                        data-bs-target="#profilePasswordModal">Change Profile Password
                                </button>
                            </div>
                            <div className="col-md-12">
                                <button className={"btn btn-warning btn-lg"} style={{marginLeft: "20rem"}}
                                        data-bs-toggle="modal"
                                        data-bs-target="#passwordModal">Change Login Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                **For modification in other details, contact your nearest branch with relevant documents.
            </div>
        </div>

        <div className={"modal fade"} id={"profilePasswordModal"} tabIndex="-1" aria-labelledby="passwordModalLabel"
             aria-hidden="true">
            <div className={"modal-dialog"}>
                <div className={"modal-content"}>
                    <div className={"modal-header"}>
                        <h1 className={"modal-title fs-5"}>Change Profile Password</h1>
                        <button type={"button"} className={"btn-close"} data-bs-dismiss={"modal"} aria-label={"Close"}/>
                    </div>
                    <div className={"modal-body"}>
                        <form onSubmit={profilePasswordChangeHandler}>
                            <label htmlFor={"oldProfilePassword"} className={"form-label"}>Old Password:</label>
                            <input id={"oldProfilePassword"} type={"password"} placeholder={"Old Password"} required={true}
                                   value={oldPassword} onChange={event => setOldPassword(event.target.value)}
                                   className={"form-control"}/>
                            <label htmlFor={"newProfilePassword"} className={"form-label"}>New Password:</label>
                            <input id={"newProfilePassword"} type={"password"} placeholder={"New Password"} required={true}
                                   value={newPassword} onChange={event => setNewPassword(event.target.value)}
                                   pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                   title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? &)"
                                   className={"form-control"}/>
                            <label htmlFor={"confirmProfilePassword"} className={"form-label"}>Confirm New Password:</label>
                            <input id={"confirmProfilePassword"} type={"password"} placeholder={"Confirm New Password"}
                                   value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}
                                   required={true} className={"form-control"}/>
                            <input type={"submit"} value={"Submit"} className={"btn btn-primary"}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="passwordModal" tabIndex="-1" aria-labelledby="passwordModalLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="passwordModal">Change Password</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={passwordChangeHandler}>
                            <label htmlFor={"oldPassword"} className={"form-label"}>Old Password:</label>
                            <input id={"oldPassword"} type={"password"} placeholder={"Old Password"} required={true}
                                   value={oldPassword} onChange={event => setOldPassword(event.target.value)}
                                   className={"form-control"}/>
                            <label htmlFor={"newPassword"} className={"form-label"}>New Password:</label>
                            <input id={"newPassword"} type={"password"} placeholder={"New Password"} required={true}
                                   value={newPassword} onChange={event => setNewPassword(event.target.value)}
                                   pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                   title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@ $ ! % * ? &)"
                                   className={"form-control"}/>
                            <label htmlFor={"confirmPassword"} className={"form-label"}>Confirm New Password:</label>
                            <input id={"confirmPassword"} type={"password"} placeholder={"Confirm New Password"}
                                   value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}
                                   required={true} className={"form-control"}/>
                            <input type={"submit"} value={"Submit"} className={"btn btn-primary"}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <SpaceDiv flexSpace={true}/>
    </>;
}

export default UserProfile;