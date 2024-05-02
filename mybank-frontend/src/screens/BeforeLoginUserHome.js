import HeaderUserBeforeLogin from "../components/HeaderFooter/HeaderUserBeforeLogin";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import Footer from "../components/HeaderFooter/Footer";

function BeforeLoginUserHome() {
    const location = useLocation();
    const pathName = location.pathname;

    if (pathName === "/") {
        return <Navigate to={"/home"} replace={true}/>
    }

    return <>
        <HeaderUserBeforeLogin/>
        <Outlet/>
        <Footer/>
    </>;
}

export default BeforeLoginUserHome;