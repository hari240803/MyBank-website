import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";
import styles from "./HeaderMain.module.css";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.png";
import {authActions} from "../../store/authentication-slice";

function HeaderMainStaff() {
    const dispatch = useDispatch();
    const userId = useSelector(state => state.authentication.staffId);

    const navigator = useNavigate();

    const [name, setName] = useState("");

    useEffect(() => {
        const requestOptions = {
            headers: {"Content-Type": "application/json", "id": userId},
        };
        const getName = async () => {
            const response = await (await fetch(`${backendUrl}/staff/getName`, requestOptions)).json();
            setName(response.name);
        }
        getName().then(() => null);
    }, [userId])

    const logoutHandler = () => {
        dispatch(authActions.logoutStaff());
        navigator("/", {replace: true});
    }

    return <>
        <nav className={`navbar fixed-top ${styles.navbarStyle}`}>
            <div className="container-fluid">
                <button className={`navbar-toggler btn btn-outline-light ${styles.toggleButton}`} type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link className="navbar-brand" to="/staff/dashboard">
                    <img src={logo} style={{width: "10rem"}} alt={"logo"}/>
                </Link>
                <span className="me-2">
                    <button className={`btn btn-danger ${styles.logoutButton}`} data-bs-target="#logoutModal"
                            data-bs-toggle="modal">Log Out</button></span>
                <div className={`offcanvas offcanvas-start ${styles.offCanvasStyle}`} tabIndex="-1" id="offcanvasNavbar"
                     aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className={`offcanvas-title`} id="offcanvasNavbarLabel">
                            <div data-bs-dismiss={"offcanvas"}><Link className={styles.offTitle}
                                                                     to="/staff/dashboard">Hello {name.toLocaleUpperCase()}!</Link>
                            </div>
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/staff/dashboard"><i
                                        className="fa-solid fa-globe"></i> Dashboard</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/staff/cash-deposit"><i
                                        className="fa-solid fa-money-bill"></i> Fund Deposit</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/staff/account-opening"><i
                                        className="fa-regular fa-file"></i> Account Opening Forms</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/staff/loan"><i
                                        className="fa-solid fa-piggy-bank"></i> View Pending Loans</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to={"/staff/queries"}><i
                                        className="fa-solid fa-question"></i> Customer Queries
                                    </Link>
                                </div>
                            </li>
                            <hr/>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        <div className="modal fade" id="logoutModal" tabIndex="-1" aria-labelledby="logoutModalLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm Logout?</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to logout?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button className="btn btn-danger" data-bs-target="#logoutModal" data-bs-toggle="modal"
                                style={{color: "white", textDecoration: "none"}} onClick={logoutHandler}>Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default HeaderMainStaff;