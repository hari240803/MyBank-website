import styles from "./Footer.module.css";
import logo from "../../assets/logo.png";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

function Footer() {
    const isLogin = useSelector(state => state.authentication.isUserLogin);

    return <>
        <footer className={`py-2 px-4 ${styles.footerClass}`}>
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={`col-md-4 d-flex justify-content-center`}
                         style={{textAlign: "center", flexDirection: "column"}}>
                        <h2><img src={logo} alt={"logo"} style={{width: "10rem"}}/></h2>
                    </div>
                    <div className="col-md-4" style={{textAlign: "center"}}>
                        <h3>Links</h3>
                        <hr/>
                        <ul className="list-unstyled d-flex justify-content-around" style={{textAlign: "center"}}>
                            <li className="mx-4"><Link className={styles.footerLinks} to="about-us">About Us</Link>
                            </li>
                            <li className="mx-4"><Link className={styles.footerLinks} to="terms-conditions">Terms &
                                Conditions</Link></li>
                            {!isLogin &&
                                <li className="mx-4"><Link className={styles.footerLinks} to="contact">Contact Us</Link>
                                </li>}
                        </ul>
                    </div>
                    <div className="col-md-4" style={{textAlign: "center"}}>
                        <h3>Follow Us</h3>
                        <hr/>
                        <ul className="list-inline">
                            <li className="list-inline-item"><a className={styles.footerLinks}
                                                                href="https://www.facebook.com" target={"_blank"}
                                                                rel="noreferrer"><i
                                className="fa-brands fa-facebook"></i></a>
                            </li>
                            <li className="list-inline-item"><a className={styles.footerLinks}
                                                                href="https://www.twitter.com" target={"_blank"}
                                                                rel="noreferrer"><i
                                className="fa-brands fa-twitter"></i></a>
                            </li>
                            <li className="list-inline-item"><a className={styles.footerLinks}
                                                                href="https://www.instagram.com" target={"_blank"}
                                                                rel="noreferrer"><i
                                className="fa-brands fa-instagram"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </>
}

export default Footer;