import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import styles from "./CustomerList.module.css";

function CustomerList() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [isLoading, setIsLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState([]);

    const [accountNumber, setAccountNumber] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                headers: {"Content-Type": "application/json", "adminToken": adminToken},
            };
            const response = await (await fetch(`${backendUrl}/admin/getCustomerList`, requestOptions)).json();
            setUsers(response.body);
            setShowUsers(response.body);
        }
        setIsLoading(true);
        fetchData().then(e => setIsLoading(false));
    }, [adminToken]);

    const submitHandler = event => {
        event.preventDefault();
        setShowUsers(users.filter(user => accountNumber === user.accountId));
        setAccountNumber("");
    }

    const resetHandler = () => {
        setShowUsers(users);
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    if (showUsers.length === 0) {
        return <>
            <h1 className={styles.mainHeading}>List of Customers...</h1>
        </>;
    }

    return <>
        <h1 className={styles.mainHeading}>List of Customers...</h1>
        <form style={{marginLeft: "5rem", marginTop: "3rem"}} onSubmit={submitHandler}>
            <input type={"text"} required={true} className={"form-control"} style={{width: "30%", display: "inline"}}
                   placeholder={"Enter Account Number"} value={accountNumber}
                   onChange={event => setAccountNumber(event.target.value)}/>
            <button type={"submit"} className={`btn btn-outline-success ${styles.searchButton}`}>Search</button>
            <button className={`btn btn-warning ${styles.searchButton}`} type={"button"} onClick={resetHandler}>Reset
            </button>
        </form>
        <div className={styles.mainTable}>
            <table className={`table table-striped table-hover ${styles.tableStyle}`}>
                <thead>
                <tr className={"table-primary"}>
                    <th scope={"col"}>Account Number</th>
                    <th scope={"col"}>Name</th>
                    <th scope={"col"}>Email</th>
                    <th scope={"col"}>Phone</th>
                    <th scope={"col"}>User Application Form</th>
                </tr>
                </thead>
                <tbody>
                {showUsers.map((item, index) => (
                    <tr key={index}>
                        <td>{`${item.accountId}`}</td>
                        <td>{`${item.first_name} ${item.last_name}`}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td><a target={"_blank"} href={item.formPath} rel="noreferrer">Link</a></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </>;
}

export default CustomerList;