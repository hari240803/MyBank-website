import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "../components/user/HomePage";
import AboutUs from "../components/user/AboutUs";
import ContactUs from "../components/user/ContactUs";
import TermsConditions from "../components/user/TermsConditions";
import AfterLoginUserMain from "../screens/AfterLoginUserMain";
import BeforeLoginUserHome from "../screens/BeforeLoginUserHome";
import AfterLoginAdmin from "../screens/AfterLoginAdmin";
import PageNotFound from "../screens/PageNotFound";
import {useSelector} from "react-redux";
import BeforeLoginAdmin from "../screens/BeforeLoginAdmin";
import LoginPage from "../components/user/LoginPage";
import Dashboard from "../components/user/Dashboard";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import Registration from "../components/user/Registration";
import UserProfile from "../components/user/UserProfile";
import Transfer from "../components/user/Transfer";
import Loan from "../components/user/Loan";
import StaffMain from "../components/staff/StaffMain";
import StaffDashboard from "../components/staff/StaffDashboard";
import ViewTransactions from "../components/admin/ViewTransactions";
import CustomerList from "../components/admin/CustomerList";
import CashDeposit from "../components/staff/CashDeposit";
import AccountOpeningForms from "../components/staff/AccountOpeningForms";
import ViewQueries from "../components/staff/ViewQueries";
import LogList from "../components/admin/LogList";
import ViewLoan from "../components/staff/ViewLoan";
import ActiveLoans from "../components/admin/ActiveLoans";

function Router() {
    const isUserLogin = useSelector(state => state.authentication.isUserLogin);
    const isAdminLogin = useSelector(state => state.authentication.isAdminLogin);

    const homeComponentRender = () => {
        if (isUserLogin) return <Navigate to={"/main"} replace={true}/>;
        if (isAdminLogin) return <Navigate to={"/admin/main"} replace={true}/>;
        return <BeforeLoginUserHome/>;
    }

    return <Routes>
        <Route path={"/"} element={homeComponentRender()}>
            <Route path={"login"} element={<LoginPage/>}/>
            <Route path={"registration"} element={<Registration/>}/>
            <Route path={"home"} element={<HomePage/>}/>
            <Route path={"about-us"} element={<AboutUs/>}/>
            <Route path={"contact"} element={<ContactUs/>}/>
            <Route path={"terms-conditions"} element={<TermsConditions/>}/>
        </Route>
        <Route path={"/main"} element={<AfterLoginUserMain/>}>
            <Route path={"dashboard"} element={<Dashboard/>}/>
            <Route path={"user-profile"} element={<UserProfile/>}/>
            <Route path={"transfer"} element={<Transfer/>}/>
            <Route path={"loan"} element={<Loan/>}/>
            <Route path={"about-us"} element={<AboutUs/>}/>
            <Route path={"contact"} element={<ContactUs/>}/>
            <Route path={"terms-conditions"} element={<TermsConditions/>}/>
        </Route>
        <Route path={"/admin"} element={<BeforeLoginAdmin/>}/>
        <Route path={"/admin/main"} element={<AfterLoginAdmin/>}>
            <Route path={"dashboard"} element={<DashboardAdmin/>}/>
            <Route path={"view_transactions"} element={<ViewTransactions/>}/>
            <Route path={"active_loans"} element={<ActiveLoans/>}/>
            <Route path={"customer_list"} element={<CustomerList/>}/>
            <Route path={"view_log"} element={<LogList/>}/>
        </Route>
        <Route path={"/staff"} element={<StaffMain/>}>
            <Route path={"dashboard"} element={<StaffDashboard/>}/>
            <Route path={"cash-deposit"} element={<CashDeposit/>}/>
            <Route path={"account-opening"} element={<AccountOpeningForms/>}/>
            <Route path={"loan"} element={<ViewLoan/>}/>
            <Route path={"queries"} element={<ViewQueries/>}/>
        </Route>
        <Route path={"*"} element={<PageNotFound/>}/>
    </Routes>;
}

export default Router;