import {Link} from "react-router-dom";

import styles from "./PageNotFound.module.css";

function PageNotFound() {
    return <div className={styles.mainContent}>
        <h1 className={styles.headingOne}>ERROR 404</h1>
        <h3 className={styles.headingThree}>Page Not Found....</h3>
        <h4>Looks like you are lost.</h4>
        <Link to={"/"} className={styles.linkStyle} replace={true}>Click here to return to home page</Link>
    </div>;
}

export default PageNotFound;