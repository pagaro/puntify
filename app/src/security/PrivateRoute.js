import {Navigate, Outlet} from "react-router-dom";
import isTokenValid from "./isTokenValid";
import {useEffect, useState} from "react";

function PrivateRoute() {
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkToken() {
            const valid = await isTokenValid();
            setIsValid(valid);
            setLoading(false);
        }
        checkToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isValid) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default PrivateRoute;