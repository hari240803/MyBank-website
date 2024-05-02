import SpaceDiv from "../UI/SpaceDiv";
import styles from "./Loan.module.css";
import loan1 from "../../assets/loan_1.png";
import loan2 from "../../assets/loan_2.png";
import loan3 from "../../assets/loan_2.png";
import {useState} from "react";
import {useSelector} from "react-redux";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";

function Loan() {
    const userToken = useSelector(state => state.authentication.userToken);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoanStatus, setIsLoanStatus] = useState(false);

    const [fetchLoanTypes, setFetchLoanTypes] = useState([]);
    const [fetchAmount, setFetchAmount] = useState([]);
    const [fetchLoanStatus, setFetchLoanStatus] = useState([]);

    const [amount, setAmount] = useState("");
    const [loanType, setLoanType] = useState("");
    const [reason, setReason] = useState("");

    const loanSubmitHandler = async (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userToken: userToken,
                loanAmount: amount,
                loanType: loanType,
                reason: reason
            }),
        };
        const response = await (await fetch(`${backendUrl}/user/applyLoan`, requestOptions)).json();
        alert(response.message);
        setAmount("");
        setReason("");
        setLoanType("");
        setIsLoanStatus(false);
    }

    const fetchLoans = async () => {
        const requestOptions = {
            headers: {"Content-Type": "application/json", "userToken": userToken},
        };
        setIsLoading(true);
        const response = await (await fetch(`${backendUrl}/user/getLoanDetails`, requestOptions)).json();
        setFetchLoanTypes(response.loanType);
        setFetchAmount(response.amount);
        setFetchLoanStatus(response.loanStatus);
        setIsLoading(false);
        setIsLoanStatus(true);
    }

    return <>
        <SpaceDiv height={6}/>

        <div className={`container ${styles.topContainer}`}>
            <div>
                <img src={loan1} className={styles.topImage} style={{width: "50rem"}} alt={"loan1"}/>
            </div>
            <div>
                <p>
                    We may not always have the money we require to do certain things or to buy certain things. In such
                    situations, individuals and businesses or institutions go for the option of borrowing money from
                    lenders.
                    Our Bank provides many types of secured loans and unsecured loans.
                </p>
                <br/>
                <div className={styles.navigationLinks}>
                    <h5>Check our SECURED LOAN SCHEMES here</h5>
                    <h2><a href="#one">SECURED LOANS</a></h2><br/>
                    <h5>Check our UNSECURED LOAN SCHEMES here</h5>
                    <h2><a href="#two">UNSECURED LOANS</a></h2>
                </div>
                {isLoading ? <LoadingSpinner/> :
                    <button className="btn btn-primary btn-lg" style={{marginTop: "5%"}} onClick={fetchLoans}>Check Loan Status</button>}
            </div>
        </div>

        {isLoanStatus && <div className={`container ${styles.containerTable}`}>
            <h4>Applied Loans:</h4>
            <table className="table">
                <thead>
                <tr className="table-primary">
                    <th scope="col">#</th>
                    <th scope="col">Loan Type</th>
                    <th scope="col">Loan Amount</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                {fetchAmount.map((amt, index) => (
                   <tr key={index}>
                       <th scope={"row"}>{index + 1}</th>
                       <td>{fetchLoanTypes[index]}</td>
                       <td>{amt}</td>
                       <td>{fetchLoanStatus[index]}</td>
                   </tr>
                ))}
                </tbody>
            </table>
        </div>}

        <div className={`container ${styles.containerMiddle}`} id="one">
            <div>
                <img src={loan2} width="45%" alt={"loan2"} style={{borderRadius: "5%"}}/>
            </div>
            <div>
                <h1>SECURED LOANS</h1>
                <h5>We provide the following schemes</h5>
                <h3><i>Mortgage Loan, Home loan, Vehicle Loan</i></h3>
                <p>
                    Our Bank gives Secured Loans only if the customer has collaterals for the loan. We need a thorough
                    overview
                    of details of the assets that customer wants to put as collateral. After checking the collateral
                    assets we
                    will grant the best loan plans ever. The minimum interest rates and our terms and policies are very
                    customer
                    friendly.
                </p>
            </div>
        </div>

        <div className={`container ${styles.containerTable}`}>
            <h4>Secured loan interest rate:</h4>
            <table className="table">
                <thead>
                <tr className="table-primary">
                    <th scope="col">#</th>
                    <th scope="col">interest Rate</th>
                    <th scope="col">Limit in Rupees</th>
                    <th scope="col">Limit In Rupees</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Home Loan</td>
                    <td>8.5% p.a.</td>
                    <td>Upto 75 lakhs</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Vehicle Loan</td>
                    <td>8.65% to 9.45% p.a.</td>
                    <td>Upto 25 lakhs</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Mortgage Loan</td>
                    <td>8.75% p.a.</td>
                    <td>Upto 15 lakhs</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div className={`container ${styles.containerEnd}`} id="two">
            <div id>
                <img src={loan3} width="50%" alt={"loan3"} style={{borderRadius: "5%"}}/>
            </div>
            <div>
                <h1>UNSECURED LOANS</h1>
                <h5>We provide the following schemes</h5>
                <h3><i>Personal Loan, Educational Loan, Business/Credit Card Loan</i></h3>
                <p>
                    Our Bank gives Unsecured Loans based on the creditworthiness of the customer. We do not require any
                    collaterals for the loan amount. Based on the credit scores and Credit worth of the Customer best
                    loan plans
                    will be suggested. The minimum interest rates and our terms and policies are very customer friendly.
                </p>
            </div>
        </div>

        <div className={`container ${styles.containerTable}`}>
            <h4>Unsecured loan interest rate:</h4>
            <table className="table">
                <thead>
                <tr className="table-primary">
                    <th scope="col">#</th>
                    <th scope="col">interest Rate</th>
                    <th scope="col">Limit in Rupees</th>
                    <th scope="col">Limit In Rupees</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Personal Loan</td>
                    <td>10.5% - 21.00% p.a.</td>
                    <td>Upto 15 lakhs</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Education Loan</td>
                    <td>11.5% p.a.</td>
                    <td>Upto 7.5 lakhs</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Business/Credit Card Loan</td>
                    <td>40.8% p.a.</td>
                    <td>Flexible</td>
                </tr>
                </tbody>
            </table>
            <div className={styles.applyNow}>
                <button className="btn btn-primary btn-lg" data-bs-target="#apply_loan" data-bs-toggle="modal">
                    Apply Now for Loan!
                </button>
            </div>
        </div>

        <div className="modal fade" id="apply_loan" tabIndex="-1" aria-labelledby="applyLoanModal"
             aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{backgroundColor: "#89CFF0", fontWeight: "bold"}}>
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="apply_loan_modal">Apply For Loan</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={loanSubmitHandler}>
                            <label htmlFor={"amount"} className={"form-label"}>Amount:</label>
                            <input id={"amount"} className={"form-control"} type={"text"} required={true} value={amount}
                                   onChange={event => setAmount(event.target.value)}
                                   pattern="^\d+(\.\d{1,2})?$"
                                   title="Please enter a valid amount. It should be a positive number with up to two decimal places."
                                   placeholder={"Amount"}/>
                            <label htmlFor={"radio"}>Loan Type:</label>
                            <label className={"form-label"}>
                                <select required name="loan_type" style={{marginLeft: "2rem", padding: "0.5rem"}}
                                        onChange={event => setLoanType(event.target.value)}>
                                    <option id="loantype"/>
                                    <option value="Home Loan">Home Loan</option>
                                    <option value="Personal Loan">Personal Loan</option>
                                    <option value="Education Loan">Education Loan</option>
                                    <option value="Vehicle Loan">Vehicle Loan</option>
                                    <option value="Mortgage Loan">Mortgage Loan</option>
                                </select>
                            </label>
                            <br/><br/>
                            <label htmlFor={"reason"} className={"form-label"}>Reason for Loan:</label>
                            <input type={"text"} id={'reason'} required className={"form-control"} value={reason}
                                   onChange={event => setReason(event.target.value)}
                                   placeholder={"Reason"}/>
                            <input type={"submit"} className={"btn btn-primary"}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <SpaceDiv flexSpace={true}/>
    </>;

}

export default Loan;