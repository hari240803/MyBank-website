import logo from "../../assets/logo.png"
import styles from "./HeaderMain.module.css";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../store/authentication-slice";
import {useEffect, useState} from "react";
import {backendUrl} from "../../config/constants";

function HeaderMainUser() {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const token = useSelector(state => state.authentication.userToken);

    const userToken = useSelector(state => state.authentication.userToken);

    const [name, setName] = useState("");

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            headers: {"Content-Type": "application/json", "userToken": userToken},
        };
        const getName = async () => {
            const response = await (await fetch(`${backendUrl}/user/getName`, requestOptions)).json();
            setName(response.name);
        }
        getName().then(() => null);
    }, [userToken])

    const logoutHandler = () => {
        dispatch(authActions.logoutUser());
        const options = {
            method: "GET",
            headers: {"Content-Type": "application/json", "user-token": token},
        };
        fetch(`${backendUrl}/logout`, options).then(() => {
        });
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
                <Link className="navbar-brand" to="/main/dashboard">
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
                                                                     to="/main/user-profile">Welcome {name.toLocaleUpperCase()}!</Link>
                            </div>
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/main/dashboard"><i
                                        className="fa-solid fa-globe"></i> Dashboard</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/main/user-profile"><i
                                        className="fa-regular fa-user"></i> View
                                        Profile</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/main/transfer"><i
                                        className="fa-solid fa-money-bill"></i> Bank Money
                                        Transfers</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/main/loan"><i
                                        className="fa-solid fa-piggy-bank"></i> Loans</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/main/contact"><i
                                        className="fa-solid fa-piggy-bank"></i> Submit a Query</Link>
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

export default HeaderMainUser;