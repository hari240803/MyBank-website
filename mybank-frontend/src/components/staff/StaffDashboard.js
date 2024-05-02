import React, {useEffect, useState} from "react";
import SpaceDiv from "../UI/SpaceDiv";
import styles from "./StaffDashboard.module.css";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {backendUrl} from "../../config/constants";
import LoadingSpinner from "../UI/LoadingSpinner";
import {Chart} from "chart.js/auto";

function StaffDashboard() {
    const [bankHolidays, setBankHolidays] = useState([]);
    const [pendingQueries, setPendingQueries] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const staffId = useSelector(state => state.authentication.staffId);

    useEffect(() => {
        const holidaysData = [
            {id: 1, date: "8th March", name: "Maha Shivaratri"},
            {id: 2, date: "25th March", name: "Holi"},
            {id: 3, date: "29th March", name: "Good Friday"},
            {id: 4, date: "5th April", name: "Babu Jagjivan Ram Jayanti"},
            {id: 5, date: "9th April", name: "Ugadi"},
        ];
        setBankHolidays(holidaysData);
    }, []);

    useEffect(() => {
        const requestOptions = {
            headers: {"Content-Type": "application/json", "id": staffId},
        };
        setIsLoading(true);
        const fetchQueries = async () => {
            const response = await (await fetch(`${backendUrl}/staff/getNumberQueries`, requestOptions)).json();
            setPendingQueries(response.count);
        }
        fetchQueries().then(() => null);
        setIsLoading(false);
    }, [staffId]);

    useEffect(() => {
        const transactionsData = {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Transactions',
                data: [1223567, 1345281, 1100840, 1412890, 1556872],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const ctx = document.getElementById('transactionsChart');
        const transactionsChart = new Chart(ctx, {
            type: 'line',
            data: transactionsData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        return () => {
            transactionsChart.destroy();
        };
    }, []);

    const getDate = () => {
        let today = new Date();
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
        };
        return today.toLocaleString("en-US", options);
    };

    function LastLogin() {
        const currentDate = new Date();
        const oneHourPrior = new Date(currentDate.getTime() - (3600000));
        const formattedDate = oneHourPrior.toLocaleDateString('en-US');
        const formattedTime = oneHourPrior.toLocaleTimeString('en-US');

        return (
            <p style={{marginTop: "5rem", marginLeft: "auto", marginRight: "auto"}}>Your Last
                Login: {formattedDate} {formattedTime}</p>
        );
    }

    if (isLoading) {
        return <>
            <SpaceDiv height={23}/>
            <LoadingSpinner/>
        </>;
    }

    return (
        <>
            <SpaceDiv height={5}/>
            <div className={`container-fluid ${styles.staffDashboard}`}>
                <div className="row">
                    <div className={"col-md-1"}></div>
                    <div className={`col-md-6 ${styles.serverStatus}`}>
                        <h2>Server Status: <span style={{color: "green"}}>Online!</span></h2>
                        <h5>Today's Date: {getDate()}</h5><br/>
                    </div>
                    <div className={"col-md-1"}></div>
                    <div className={`col-md-3 ${styles.bankHolidays}`}>
                        <h2>Upcoming Bank Holidays</h2>
                        <ul className={styles.holidayList}>
                            {bankHolidays.map((holiday) => (
                                <li key={holiday.id} style={{}}>
                                    {holiday.date} - <span style={{fontWeight: "bold"}}>{holiday.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-md-6"}>
                    <div className={`card ${styles.featureCards}`}>
                        <div className={`card-header ${styles.featureCardHeader}`}><h4>CASH DEPOSIT</h4></div>
                        <div className={`card-body ${styles.featureCardBody}`}>
                            <p className={"card-text"}>The cash deposit feature enables staff to accept and record cash
                                deposits
                                from customers, facilitating seamless account management and enhancing banking
                                convenience.</p>
                            <Link to={"/staff/cash-deposit"} className={"btn btn-success"}>Take Me There!</Link>
                        </div>
                    </div>
                    <div className={`card ${styles.featureCards}`}>
                        <div className={`card-header ${styles.featureCardHeader}`}><h4>RESOLVE QUERIES</h4></div>
                        <div className={`card-body ${styles.featureCardBody}`}>
                            <p className={"card-text"}>There are <span
                                style={{fontWeight: "bold"}}>{pendingQueries}</span> pending customer queries. Resolve
                                them.
                            </p>
                            <Link to={"/staff/queries"} className={"btn btn-success"}>Take Me There!</Link>
                        </div>
                    </div>
                </div>
                <div className={"col-md-6"}>
                    <div className={`card ${styles.featureCards}`} style={{width: "70%"}}>
                        <div className={`card-header ${styles.featureCardHeader}`}><h4>TRANSACTIONS (Last 5 days)</h4>
                        </div>
                        <div className={`card-body ${styles.featureCardBody}`}>
                            <canvas id="transactionsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            {LastLogin()}
        </>
    );
}

export default StaffDashboard;