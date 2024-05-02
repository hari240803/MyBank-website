import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import HeaderMainStaff from "../HeaderFooter/HeaderMainStaff";

function StaffMain() {
    const location = useLocation();
    const pathName = location.pathname;

    const isStaffLogin = useSelector(state => state.authentication.isStaffLogin);

    if (!isStaffLogin) {
        alert("You are not logged in. You will be redirected to home page!");
        return <Navigate to={"/"} replace={true}/>;
    }

    if (pathName === "/staff") {
        return <Navigate to={"/staff/dashboard"} replace={true}/>
    }

    return <>
        <HeaderMainStaff/>
        <Outlet/>
    </>;
}

export default StaffMain;