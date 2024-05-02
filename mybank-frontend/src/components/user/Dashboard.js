import SpaceDiv from "../UI/SpaceDiv";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import profileImage from "../../assets/profile_image.jpeg";
import styles from "./Dashboard.module.css";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";

function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const userToken = useSelector(state => state.authentication.userToken);

    const [transactionLoading, setTransactionLoading] = useState(false);

    const [animateInfo, setAnimateInfo] = useState(false);
    const [animateBalance, setAnimateBalance] = useState(false);
    const [animateTransaction, setAnimateTransaction] = useState(false);

    const [name, setName] = useState("");
    const [balance, setBalance] = useState(0);
    const [accountNumber, setAccountNumber] = useState("");

    const [amount, setAmount] = useState([]);
    const [toFrom, setToFrom] = useState([]);
    const [date, setDate] = useState([]);
    const [time, setTime] = useState([]);

    useEffect(() => {
        const requestOptions = {
            headers: {"Content-Type": "application/json", "userToken": userToken},
        };
        const fetchData = async () => {
            setIsLoading(true);
            const response = await (await fetch(`${backendUrl}/user/accountInfo`, requestOptions)).json();
            setName(`${response.firstName} ${response.lastName}`);
            setBalance(response.balance);
            setAccountNumber(response.accountNumber);
            setAmount(response.amount);
            setToFrom(response.toFrom);
            setDate(response.date);
            setTime(response.time);
            setIsLoading(false);
        }
        fetchData().then(() => {
            setAnimateInfo(true);
            setTimeout(() => setAnimateBalance(true), 500); // Adjust the delay as needed
            setTimeout(() => setAnimateTransaction(true), 1000); // Adjust the delay as needed
        });
    }, [userToken])

    const refreshTransactionHandler = async () => {
        setTransactionLoading(true);
        const requestOptions = {
            headers: {"Content-Type": "application/json", "userToken": userToken},
        };
        const fetchData = async () => {
            const response = await (await fetch(`${backendUrl}/user/accountInfo`, requestOptions)).json();
            setAmount(response.amount);
            setToFrom(response.toFrom);
            setDate(response.date);
            setTime(response.time);
            setBalance(response.balance);
        }
        fetchData().then(() => setTransactionLoading(false));
    }

    const getDate = () => {
        let today = new Date();
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        };
        return today.toLocaleString("en-US", options);
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={15}/>
            <LoadingSpinner/>
            <SpaceDiv flexSpace={true}></SpaceDiv>
        </>;
    }

    return <>
        <SpaceDiv height={5}/>

        <div id="info-container" className={animateInfo ? styles.slideIn : ""}
             style={{opacity: animateInfo ? "1" : "0"}}>
            <img src={profileImage} width="160" height="200" alt={"profile"} className={styles.infoImage}/>
            <div className={styles.infoText}>
                <pre>Account Holder Name : {name}</pre>
                <pre>Account Number     : {accountNumber}</pre>
                <br/><br/>
                <pre>Today's Date       : {getDate()}</pre>
            </div>
        </div>

        <div className={styles.separator}/>

        <h4 className={styles.headingStyle}>BALANCE</h4>
        <div className={`${styles.balanceTable} ${animateBalance && styles.slideIn}`}
             style={{opacity: animateBalance ? "1" : "0"}}>
            <table className="table table-striped">
                <thead>
                <tr className="table-primary">
                    <th scope="col">Account Holder</th>
                    <th scope="col">Account Number</th>
                    <th scope="col">Balance Amount (INR)</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{name}</td>
                    <td>{accountNumber}</td>
                    <td>{balance}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div className={styles.separator}/>

        <h4 className={styles.headingStyle}>RECENT TRANSACTIONS</h4>
        <div className={`${styles.transactionTable} ${animateTransaction && styles.slideIn}`}
             style={{opacity: animateTransaction ? "1" : "0"}}>
            {transactionLoading ? <div style={{marginTop: "1.5rem"}}><LoadingSpinner/></div> :
                <table className="table table-striped">
                    <thead>
                    <tr className="table-primary">
                        <th scope="col">#</th>
                        <th scope="col">Amount (INR)</th>
                        <th scope="col">Amount Received To/From</th>
                        <th scope="col">Date (dd/mm/yyyy)</th>
                        <th scope="col">Time (12-hour)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {amount.map((amt, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td style={{color: amount[amount.length - index - 1].includes("-") ? "red" : "green"}}>{amount[amount.length - index - 1]}</td>
                            <td style={{color: amount[amount.length - index - 1].includes("-") ? "red" : "green"}}>{toFrom[amount.length - index - 1]}</td>
                            <td style={{color: amount[amount.length - index - 1].includes("-") ? "red" : "green"}}>{date[amount.length - index - 1]}</td>
                            <td style={{color: amount[amount.length - index - 1].includes("-") ? "red" : "green"}}>{time[amount.length - index - 1]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>}
        </div>
        <button className={`btn btn-primary ${styles.refreshButton} ${animateTransaction && styles.slideIn}`}
                style={{opacity: animateTransaction ? "1" : "0"}} onClick={refreshTransactionHandler}
                type={"button"}>Refresh
            Transaction List
        </button>

        <SpaceDiv flexSpace={true}></SpaceDiv>
    </>;
}

export default Dashboard;