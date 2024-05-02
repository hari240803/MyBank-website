import {TailSpin} from "react-loader-spinner";

function LoadingSpinner(props) {
    return <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <TailSpin visible={true} color={"#0096FF"} radius={"1"} ariaLabel={"tail-spin-loading"}/>
    </div>;
}

export default LoadingSpinner;