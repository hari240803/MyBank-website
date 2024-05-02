import SpaceDiv from "../UI/SpaceDiv";
import styles from "./ViewLoan.module.css";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import {backendUrl} from "../../config/constants";

function ViewLoan() {
    const staffId = useSelector(state => state.authentication.staffId);

    const [isLoading, setIsLoading] = useState(false);

    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [loanTypeSelected, setLoanTypeSelected] = useState("");

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const requestOptions = {
                headers: {"Content-Type": "application/json", "id": staffId},
            };
            const response = await (await fetch(`${backendUrl}/staff/viewLoan`, requestOptions)).json();
            setList(response.body);
            setFilteredList(response.body);
        }
        fetchData().then(() => setIsLoading(false))
    }, [staffId]);

    const approveLoan = async id => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: staffId, loanId: id}),
        };
        await fetch(`${backendUrl}/staff/acceptLoan`, requestOptions);
        setList(prevList => prevList.filter(item => item._id !== id));
        setFilteredList(prevList => prevList.filter(item => item._id !== id));
    }

    const rejectLoan = async id => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: staffId, loanId: id}),
        };
        await fetch(`${backendUrl}/staff/rejectLoan`, requestOptions);
        setList(prevList => prevList.filter(item => item._id !== id));
        setFilteredList(prevList => prevList.filter(item => item._id !== id));
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    const filterHandler = type => {
        setLoanTypeSelected(type);
        if (type.length !== 0) {
            setFilteredList(list.filter(item => item.loan_type === type));
        } else {
            setFilteredList(list);
        }
    }

    return <>
        <SpaceDiv height={6}/>
        <h1 className={styles.mainHeading}>View Loan Requests...</h1>
        <select className={`form-select form-select-lg mb-3 ${styles.selectClass}`} required={true}
                onChange={event => filterHandler(event.target.value)}>
            <option selected={true}
                    value={""}>{loanTypeSelected.length !== 0 ? "All Loans" : "--Select Loan Type--"}</option>
            <option value={"Home Loan"}>Home Loan</option>
            <option value={"Personal Loan"}>Personal Loan</option>
            <option value={"Educational Loan"}>Educational Loan</option>
            <option value={"Vehicle Loan"}>Vehicle Loan</option>
            <option value={"Mortgage Loan"}>Mortgage Loan</option>
        </select>
        <div className={styles.loanTable}>
            <table className={`table table-striped table-hover ${styles.tableStyle}`}>
                <thead>
                <tr className={"table-primary"}>
                    <th scope={"col"}>Account Number</th>
                    <th scope={"col"}>Loan Amount</th>
                    <th scope={"col"}>Loan Type</th>
                    <th scope={"col"}>Reason</th>
                    <th>-----</th>
                    <th>-----</th>
                </tr>
                </thead>
                <tbody>
                {filteredList.map((item, index) => (
                    <tr key={index}>
                        <td>{item.acc_no}</td>
                        <td>{item.loan_amount}</td>
                        <td>{item.loan_type}</td>
                        <td>{item.reason}</td>
                        <td>
                            <button className={"btn btn-outline-success"} onClick={() => approveLoan(item._id)}>Approve
                            </button>
                        </td>
                        <td>
                            <button className={"btn btn-danger"} onClick={() => rejectLoan(item._id)}>Reject</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <p style={{marginTop: "5rem", marginLeft: "1.5rem"}}>** Please note that Accept or Reject is final and cannot be
            reverted.</p>
    </>;
}

export default ViewLoan;