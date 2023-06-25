import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IfAuthFalseRedirigir ({userSession}){
    const navigate = useNavigate();

    useEffect(()=>{
        if (window.location.pathname !== "/" && userSession === false) {
            navigate("/");
        }
    }, [window.location.pathname]);

    return (
        <div></div>
    )
}
