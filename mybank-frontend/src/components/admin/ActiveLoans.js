import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import styles from "./ActiveLoan.module.css";
import {CSVLink} from "react-csv";

function ActiveLoans() {
    const adminToken = useSelector(state => state.authentication.adminToken);

    const [isLoading, setIsLoading] = useState(true);

    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [accountNumber, setAccountNumber] = useState("");

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const requestOptions = {
                headers: {"Content-Type": "application/json", "adminToken": adminToken},
            };
            const response = await (await fetch(`${backendUrl}/admin/viewLoan`, requestOptions)).json();
            setList(response.body);
            setFilteredList(response.body);
        }
        fetchData().then(() => setIsLoading(false))
    }, [adminToken]);

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    const submitHandler = event => {
        event.preventDefault();
        setFilteredList(list.filter(item => accountNumber === item.acc_no));
        setAccountNumber("");
    }

    const resetHandler = () => {
        setFilteredList(list);
    }

    const csvData = filteredList.map(item => ({
        "Account Number": item.acc_no,
        "Loan Amount": item.loan_amount,
        "Loan Type": item.loan_type,
    }));

    return <>
        <SpaceDiv height={6}/>
        <h1 className={styles.mainHeading}>View Active Loan Records...</h1>
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
                    <th scope={"col"}>Loan Amount</th>
                    <th scope={"col"}>Loan Type</th>
                </tr>
                </thead>
                <tbody>
                {filteredList.map((item, index) => (
                    <tr key={index}>
                        <td>{item.acc_no}</td>
                        <td>{item.loan_amount}</td>
                        <td>{item.loan_type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <SpaceDiv height={5}/>
        <div style={{marginLeft: "auto", marginRight: "auto"}}>
            <CSVLink data={csvData} filename={"loan_records.csv"}>
                <span>Export to CSV Format</span>
            </CSVLink>
        </div>
    </>;
}

export default ActiveLoans;