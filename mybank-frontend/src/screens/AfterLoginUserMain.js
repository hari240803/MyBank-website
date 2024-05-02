import HeaderMainUser from "../components/HeaderFooter/HeaderMainUser";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import Footer from "../components/HeaderFooter/Footer";
import {useSelector} from "react-redux";

function AfterLoginUserMain() {
    const location = useLocation();
    const pathName = location.pathname;

    const isUserLogin = useSelector(state => state.authentication.isUserLogin);

    if (!isUserLogin) {
        alert("You are not logged in. You will be redirected to home page!");
        return <Navigate to={"/"} replace={true}/>;
    }

    if (pathName === "/main") {
        return <Navigate to={"/main/dashboard"} replace={true}/>
    }

    return <>
        <HeaderMainUser/>
        <Outlet/>
        <Footer/>
    </>;
}

export default AfterLoginUserMain;