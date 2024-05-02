import logo from "../../assets/logo.png"
import styles from "./HeaderMain.module.css";
import {Link, useNavigate} from "react-router-dom";
import {authActions} from "../../store/authentication-slice";
import {useDispatch, useSelector} from "react-redux";
import {backendUrl} from "../../config/constants";

function HeaderMainAdmin() {
    const dispatch = useDispatch();
    const token = useSelector(state => state.authentication.userToken);
    const navigator = useNavigate();

    const logoutHandler = () => {
        dispatch(authActions.logoutAdmin());
        const options = {
            method: "GET",
            headers: {"Content-Type": "application/json", "user-token": token},
        };
        fetch(`${backendUrl}/logout`, options).then(() => {
        });
        navigator("/admin", {replace: true});
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
                <Link className="navbar-brand" to="/admin/main/dashboard"><img src={logo} style={{width: "10rem"}}
                                                                               alt={"logo"}/></Link>
                <span className="me-2"><button className={`btn btn-danger ${styles.logoutButton}`}
                                               data-bs-target="#logoutModal"
                                               data-bs-toggle="modal">Log Out</button></span>
                <div className={`offcanvas offcanvas-start ${styles.offCanvasStyle}`} tabIndex="-1" id="offcanvasNavbar"
                     aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className={`offcanvas-title`} id="offcanvasNavbarLabel"><Link className={styles.offTitle}
                                                                                          to="/admin/main/dashboard">ADMIN
                            PORTAL</Link></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`}
                                          to="/admin/main/dashboard"><i
                                        className="fa-solid fa-globe"></i> Dashboard</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/admin/main/view_transactions"><i
                                        className="fa-solid fa-money-bill"></i> Transactions</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/admin/main/active_loans"><i
                                        className="fa-solid fa-money-bill"></i> Active Loans</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/admin/main/view_log"><i
                                        className="fa-solid fa-user"></i> Log of Users</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-link">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to={"/admin/main/customer_list"}><i
                                        className="fa-solid fa-align-center"></i> Customer Lists
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

export default HeaderMainAdmin;