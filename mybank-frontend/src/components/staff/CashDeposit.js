import styles from "./CashDeposit.module.css";
import SpaceDiv from "../UI/SpaceDiv";
import image from "../../assets/cash_deposit.jpeg";
import {useState} from "react";
import {useSelector} from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import {backendUrl} from "../../config/constants";

function CashDeposit() {
    const staffId = useSelector(state => state.authentication.staffId);

    const [acNumber, setAcNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [mode, setMode] = useState("Cash");
    const [comment, setComment] = useState("Self Credit");

    const [isLoading, setIsLoading] = useState(false);

    const submitHandler = async event => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: staffId, accountNumber: acNumber, amount: amount}),
        };
        setIsLoading(true);
        const response = await (await fetch(`${backendUrl}/staff/depositMoney`, requestOptions)).json();
        setMode("Cash");
        setComment("Self Credit");
        setAmount("");
        setAcNumber("");
        setIsLoading(false);
        alert(response.message);
    }

    return <div className={styles.container}>
        <SpaceDiv height={5}/>
        <h1 className={styles.heading}>Deposit Funds</h1>
        <SpaceDiv height={1}/>
        <p style={{marginLeft: "3rem"}}>Enter the A/C No. and select an amount to add to their account</p>
        <div className={"row"}>
            <div className={"col-md-5"}>
                <form className={styles.formClass} onSubmit={submitHandler}>
                    <label htmlFor={"accountNumber"} className={"form-label"}>Account Number</label>
                    <input type={"text"} id={"accountNumber"} required={true} className={"form-control"}
                           placeholder={"A/C No."} value={acNumber} pattern="[a-zA-Z0-9]{24}"
                           title="Account number must be 24 characters"
                           onChange={event => setAcNumber(event.target.value)}/>
                    <label htmlFor={"amount"} className={"form-label"}>Amount</label>
                    <input type={"text"} id={"amount"} required={true} className={"form-control"} value={amount}
                           onChange={event => setAmount(event.target.value)} pattern="[0-9]+"
                           title="Invalid Amount" placeholder={"Amount in INR"}/>
                    <label htmlFor={"paymentMethod"} className={"form-label"}>Payment Method</label>
                    <select className={"form-select"} required={true} id={"paymentMethod"} value={mode}
                            onChange={event => setMode(event.target.value)}>
                        <option value={"Cash"}>Cash</option>
                        <option value={"Debit Card"}>Debit Card</option>
                    </select>
                    <br/><br/>
                    <label htmlFor={"comment"} className={"form-label"}>Comment</label>
                    <input type={"text"} id={"comment"} className={"form-control"} required={true} value={comment}
                           onChange={event => setComment(event.target.value)}/>
                    {isLoading ? <LoadingSpinner/> :
                        <input type={"submit"} className={"btn btn-primary btn-lg"} value={"Deposit"}/>}
                </form>
            </div>
            <div className={"col-md-5"}>
                <img src={image} alt={"cash_deposit_image"} className={styles.imageClass}/>
            </div>
        </div>
    </div>;
}

export default CashDeposit;