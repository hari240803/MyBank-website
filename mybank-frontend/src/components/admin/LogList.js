import SpaceDiv from "../UI/SpaceDiv";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";
import styles from "./LogList.module.css";
import {CSVLink} from "react-csv";

function LogList() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [isLoading, setIsLoading] = useState(false);

    const [accountNumber, setAccountNumber] = useState("");

    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                headers: {"Content-Type": "application/json", "adminToken": adminToken},
            };
            const response = await (await fetch(`${backendUrl}/admin/getLogs`, requestOptions)).json();
            setList(response.body);
            setFilteredList(response.body);
        }
        setIsLoading(true);
        fetchData().then(e => setIsLoading(false));
    }, [adminToken]);

    const csvData = filteredList.map(item => ({
        "Account Number": item.accountNumber,
        "Date (dd/mm/yyyy)": item.date,
        "Time (12-hour)": item.time
    }));

    const submitHandler = event => {
        event.preventDefault();
        setFilteredList(list.filter(item => accountNumber === item.accountNumber));
        setAccountNumber("");
    }

    const resetHandler = () => {
        setFilteredList(list);
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    const reversedList = [...filteredList].reverse();

    return <>
        <SpaceDiv height={7}/>
        <h1 className={styles.mainHeading}>Account Login Records</h1>
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
                    <th scope={"col"}>Date(dd/mm/yyyy)</th>
                    <th scope={"col"}>Time(12-hour)</th>
                </tr>
                </thead>
                <tbody className={"table-group-divider"}>
                {reversedList.map((item, index) => (
                    <tr key={index}>
                        <td>{item.accountNumber}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <SpaceDiv height={5}/>
        <div style={{marginLeft: "auto", marginRight: "auto"}}>
            <CSVLink data={csvData} filename={"login_records.csv"}>
                <span>Export to CSV Format</span>
            </CSVLink>
        </div>
    </>;
}

export default LogList;