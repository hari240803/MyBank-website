import {useSelector} from "react-redux";
import SpaceDiv from "../UI/SpaceDiv";
import styles from "./ContactUs.module.css";
import {useState} from "react";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";

function ContactUs() {
    const isLogin = useSelector(state => state.authentication.isUserLogin);
    const userToken = useSelector(state => state.authentication.userToken);

    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [queryId, setQueryId] = useState("");

    const searchQueryHandler = async (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userToken: userToken, queryId: queryId}),
        };
        const response = await (await fetch(`${backendUrl}/user/getQueryStatus`, requestOptions)).json();
        alert(response.body);
        setQueryId("");
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({userToken: userToken, title: title, message: message}),
        };
        const response = await (await fetch(`${backendUrl}/user/submitQuery`, requestOptions)).json();
        if (response) {
            alert(`Query Submitted. Your query ID is: ${response}`);
        } else {
            alert("Some Error Occurred!");
        }
        setTitle("");
        setMessage("");
        setIsLoading(false);
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={23}/>
            <LoadingSpinner/>
            <SpaceDiv flexSpace={true}/>
        </>;
    }

    return <>

        {!isLogin && <div className={styles.container}>
            <h1 style={{marginTop: "5rem"}}>Customer Care Services</h1>
            <p>Dear Customer, a very warm welcome to our Banking website, you can contact us through our customer care
                services.<br/>
                You can either contact us using our phone number or Email ID.<br/>
                To contact us directly (raise a direct query), login to your account. Your queries will be answered
                within 48 hours.</p>
            <h2>
                <div className={styles.emailLogo}>
                    <box-icon name='envelope' id="email_logo"></box-icon>
                </div>
                <div className={styles.emailId}>Email ID</div>
            </h2>
            <p id="email_id">banking!123@gmail.com</p>
            <h3>
                <div className={styles.phoneLogo}>
                    <box-icon name='phone' id="phone_logo"></box-icon>
                </div>
                <div className={styles.phoneNum}>Phone Number</div>
            </h3>
            <p id="phone_num">+91 - 7654334567</p>
        </div>}

        {isLogin && <div className={styles.contactForm}>
            <SpaceDiv height={3}/>
            <h2 style={{textAlign: "center", color: "#6c2424"}}>CONTACT US</h2>
            <form onSubmit={submitHandler}>
                <label className={styles.labelBox}>Query Title</label>
                <input type="text" name="title" placeholder="Enter your title here" id="title" required={true}
                       className={styles.inputBox} value={title} onChange={event => setTitle(event.target.value)}/>
                <label id="queries_label" className={styles.labelBox}>Query Message</label>
                <textarea id="box_text" rows="1" name="message" placeholder="YOUR MESSAGE"
                          className={styles.boxText} required={true} value={message}
                          onChange={event => setMessage(event.target.value)}></textarea>
                <button type="submit" className={styles.sendButton}>Send</button>
            </form>
            <form onSubmit={searchQueryHandler}>
                <label className={"form-label"} style={{marginTop: "2rem"}}>Track your Query</label><br/>
                <input type={"text"} required={true} placeholder={"Enter your query ID"} className={"form-control"}
                       style={{width: "20%", marginBottom: "1rem", display: "inline"}} value={queryId}
                       onChange={event => setQueryId(event.target.value)}/>
                <button type={"submit"} className={`btn btn-info ${styles.searchButton}`}>Search</button>
            </form>
        </div>}

        <SpaceDiv flexSpace={true}/>
    </>;
}

export default ContactUs;