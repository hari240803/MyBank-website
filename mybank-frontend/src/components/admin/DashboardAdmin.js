import SpaceDiv from "../UI/SpaceDiv";
import styles from "./DashboardAdmin.module.css";

function DashboardAdmin() {

    function getDateTime() {
        let today = new Date();
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        };
        return today.toLocaleString("en-US", options);
    }

    return <>
        <SpaceDiv height={2}/>
        <div className={styles.section}>
            <h4>Miscellaneous</h4>
            <p style={{fontWeight: "bold"}}>Current Date: {getDateTime()}</p>
            <p style={{fontWeight: "bold", color: "green"}}>Current Stock Price: $44.20 per share</p>
        </div>
        <div className={styles.section}>
            <h4>Bank Financial Performances:</h4>
            <p>Assets: $500 billion</p>
            <p>Liabilities: $400 billion</p>
            <p>Revenue: $50 billion</p>
            <p>Profits: $10 billion</p>
        </div>
        <div className={styles.section}>
            <h4>Risk Management Information:</h4>
            <p style={{color: "#1E90FF", fontWeight: "bold"}}>Loan Portfolios: $10 billion</p>
            <p style={{color: "#DC143C", fontWeight: "bold"}}>Credit Risk: 5%</p>
            <p style={{color: "#DC143C", fontWeight: "bold"}}>Market Risk: 2.5%</p>
        </div>
    </>;
}

export default DashboardAdmin;