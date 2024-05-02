import SpaceDiv from "../UI/SpaceDiv";
import styles from "./Transfer.module.css";
import {useState} from "react";
import {useSelector} from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import {backendUrl} from "../../config/constants";

function Transfer() {
    const userToken = useSelector(state => state.authentication.userToken);
    const [isLoading, setIsLoading] = useState(false);

    const [amount, setAmount] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [password, setPassword] = useState("");

    const transferHandler = async (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                userToken: userToken,
                accountNumber: accountNumber,
                password: password,
                amount: amount
            }),
        };
        setIsLoading(true);
        const response = await (await fetch(`${backendUrl}/user/transfer`, requestOptions)).json();
        alert(response.message);
        setIsLoading(false);
        setPassword("");
        setAmount("");
        setAccountNumber("");
    }

    return <>
        <SpaceDiv height={6}/>

        <div className={`${styles.container}`}>
            <div className="d-md-flex align-items-center justify-content-around pb-3">
                <div className={`${styles.content} mb-md-0 mb-5`}>
                    <p className={styles.h2}>Easily transfer your money to other bank accounts.</p>
                    <p className={`${styles.fadein} ${styles.line}`}></p>
                    <p className={styles.p2}>No hassle and completely secure online transfer service.</p>
                </div>
                <form className={styles.fadein} onSubmit={transferHandler}>
                    <div className="d-flex flex-column align-items-center">
                        <p className="fs-4 fw-bold m-0 mt-4">How much do you want to transfer?</p> <span
                        className={styles.textMuted}></span>
                        <span className={`${styles.line} my-3`}></span>
                    </div>
                    <div className="row p-0">
                        <div className="col-12 p-0 px-4"><span className={`text-uppercase ${styles.textMuted}`}>amount you want to transfer</span>
                        </div>
                        <div className={`col-12 p-0 px-4 ${styles.formSpacing}`}>
                            <input type="text" name="amount" id="amount" aria-label=""
                                   className="d-flex align-items-center my-2" placeholder="In INR" required
                                   pattern="^\d+(\.\d{1,2})?$"
                                   title="Please enter a valid amount. It should be a positive number with up to two decimal places."
                                   value={amount} onChange={event => setAmount(event.target.value)}/>
                        </div>
                        <div className="col-12 p-0 px-4"><span
                            className={`text-uppercase ${styles.textMuted}`}>Enter to A/C No.</span></div>
                        <div className={`col-12 p-0 px-4 ${styles.formSpacing}`}><input type="text"
                                                                                        name="recipient_acc_no"
                                                                                        id="accountNumber" aria-label=""
                                                                                        className="d-flex align-items-center my-2"
                                                                                        placeholder="A/C No" required
                                                                                        value={accountNumber}
                                                                                        onChange={event => setAccountNumber(event.target.value)}/>
                        </div>
                        <div className="col-12 p-0 px-4"><span
                            className={`text-uppercase ${styles.textMuted}`}>Enter Profile Password</span></div>
                        <div className={`col-12 p-0 px-4 ${styles.formSpacing}`}>
                            <input type="password" name="passwd" id="passwd" aria-label=""
                                   className="d-flex align-items-center my-2" placeholder="Profile Password" required
                                   value={password} onChange={event => setPassword(event.target.value)}/>
                        </div>
                        <div className="col-12 p-0 px-4">
                            {isLoading ? <LoadingSpinner/> :
                                <button className={`btn btn-primary w-100 ${styles.transferButton}`}>Transfer</button>}
                            <div className={`${styles.textMuted} mb-4 mt-3`} style={{fontWeight: "normal"}}>Once you
                                click
                                transfer, money will be
                                deducted from
                                your account.
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <SpaceDiv flexSpace={true}/>
    </>;
}

export default Transfer;