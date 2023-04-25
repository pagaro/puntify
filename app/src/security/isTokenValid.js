import axios from "axios";
import Cookies from "js-cookie";

async function isTokenValid() {
    const token = Cookies.get('access_token')
    if (!token) {
        return false;
    }

    try {
        const response = await axios.get("http://localhost:8000/verify-token",{ withCredentials: true });

        return true;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return false;
        }
        console.error("Error while verifying token:", error);
        return false;
    }
}

export default isTokenValid;
