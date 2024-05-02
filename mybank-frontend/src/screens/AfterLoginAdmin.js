import HeaderMainAdmin from "../components/HeaderFooter/HeaderMainAdmin";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

function AfterLoginAdmin() {
    const location = useLocation();
    const pathName = location.pathname;

    const isAdminLogin = useSelector(state => state.authentication.isAdminLogin);

    if (!isAdminLogin) {
        alert("You are not logged in. You will be redirected!");
        return <Navigate to={"/admin"} replace={true}/>;
    }

    if (pathName === "/admin/main") {
        return <Navigate to={"/admin/main/dashboard"} replace={true}/>
    }

    return <>
        <HeaderMainAdmin/>;
        <Outlet/>
    </>
}

export default AfterLoginAdmin;