import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import SpaceDiv from "../UI/SpaceDiv";
import LoadingSpinner from "../UI/LoadingSpinner";
import styles from "./AccountOpening.module.css";

function AccountOpeningForms() {
    const staffId = useSelector(state => state.authentication.staffId);

    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                headers: {"Content-Type": "application/json", "id": staffId},
            };
            const response = await (await fetch(`${backendUrl}/staff/getForms`, requestOptions)).json();
            setList(response.body);
        }
        setIsLoading(true);
        fetchData().then(e => setIsLoading(false));
    }, [staffId]);

    const acceptHandler = async id => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: staffId, formId: id}),
        };
        await (await fetch(`${backendUrl}/staff/formAccept`, requestOptions)).json();
        setList(prevList => prevList.filter(item => item._id !== id));
    }

    const rejectHandler = async id => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: staffId, formId: id}),
        };
        await (await fetch(`${backendUrl}/staff/formReject`, requestOptions)).json();
        setList(prevList => prevList.filter(item => item._id !== id));
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={25}/>
            <LoadingSpinner/>
        </>;
    }

    if (list.length === 0) {
        return <>
            <h1 className={styles.mainHeading}>Pending Account Opening Forms...</h1>
            <h4 className={styles.mainHeading}>No form to show...</h4>
        </>;
    }

    return <>
        <h1 className={styles.mainHeading}>Pending Account Opening Forms...</h1>
        <div className={styles.mainTable}>
            <table className={`table table-striped table-hover ${styles.tableStyle}`}>
                <thead>
                <tr className={"table-primary"}>
                    <th scope={"col"}>Name</th>
                    <th scope={"col"}>Email</th>
                    <th scope={"col"}>Phone</th>
                    <th scope={"col"}>Account Opening Form</th>
                    <th scope={"col"}>-------</th>
                    <th scope={"col"}>-------</th>
                </tr>
                </thead>
                <tbody>
                {list.map((item, index) => (
                    <tr key={item._id}>
                        <td><h6>{`${item.first_name} ${item.last_name}`}</h6></td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td><a target={"_blank"} href={item.formPath} rel="noreferrer">Link</a></td>
                        <td>
                            <button className={"btn btn-lg btn-success"} onClick={() => acceptHandler(item._id)}>Accept
                            </button>
                        </td>
                        <td>
                            <button className={"btn btn-lg btn-warning"} onClick={() => rejectHandler(item._id)}>Reject
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <p style={{marginTop: "8rem"}}>**Note that Accept and Reject is final once it is submitted.</p>
    </>;
}

export default AccountOpeningForms;