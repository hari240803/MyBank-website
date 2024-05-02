import SpaceDiv from "../UI/SpaceDiv";
import {useSelector} from "react-redux";

import styles from "./AboutUs.module.css";

import bankImage from "../../assets/bank_image.jpg";
import {useNavigate} from "react-router-dom";

function AboutUs() {
    const isLogin = useSelector(state => state.authentication.isUserLogin);
    const navigator = useNavigate();

    return <>
        <div className={styles.mainContainer}>
            <div className={styles.contentSection}>
                <div className={styles.title} style={{marginTop: isLogin ? "6rem" : "2rem"}}>
                    About Us
                </div>
                <div className={styles.content}>
                    <h3>{!isLogin ? "Login to avail our Internet Banking Facilities" : "Avail Our Internet Banking Facilities Now"}</h3>
                    <p>
                        Welcome to our bank, where we are committed to providing exceptional financial services to
                        individuals, businesses, and communities. Our bank is built on a
                        foundation of trust and reliability and with a team of professionals.
                    </p>
                    <p>
                        At our bank, we understand that every customer has unique financial needs and goals. That's why
                        we
                        offer a comprehensive range of banking products and services designed to meet the diverse needs
                        of
                        our customers. We have everything you need to manage your finances with ease and confidence.
                    </p>
                    <p>
                        Our mission is to be the leading provider of financial services, delivering the
                        highest level of customer service and satisfaction. We are committed to building long-term
                        relationships with our customers based on trust, respect, and integrity. We look forward to
                        serving
                        you and helping you achieve your financial dreams.
                    </p>
                    <br/>
                </div>
            </div>
            <div className={styles.imageSection}>
                <img src={bankImage} alt={"bank"}/>
            </div>
            {!isLogin && <button className={`btn btn-outline-primary btn-lg ${styles.signUpButton}`}
                                 onClick={() => navigator("/registration", {replace: true})}>Sign Up Now!</button>}
        </div>
        <SpaceDiv flexSpace={true}/>
    </>;
}

export default AboutUs;