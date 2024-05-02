import logo from "../../assets/logo.png";
import styles from "./NavUserBeforeLogin.module.css";

import {Link} from "react-router-dom";

function HeaderUserBeforeLogin() {
    return <>
        <nav style={{backgroundColor: "#003366", color: "white"}} className={"navbar-expand-lg navbar"}>
            <div className={"container-fluid"}>
                <Link to={"/"} className={"navbar-brand"}><img src={logo} alt={"logo"} style={{width: "10rem"}}/></Link>
                <button className={`navbar-toggler btn ${styles.toggleButton}`} type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0 ms-auto me-2 gap-3">
                        <li className="nav-item">
                            <Link to={"/login"}
                                  className={`nav-link text-decoration-none ${styles.navigationLink}`}
                                  aria-current="page">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link text-decoration-none ${styles.navigationLink}`}
                                  to="/registration">Open a New Account</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link text-decoration-none ${styles.navigationLink}`}
                                  to="/">Home</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>;
}

export default HeaderUserBeforeLogin;