import axios from 'axios';

const userLoginStatus = async () =>{
    let isLoggedIng = false;
    let errormsg = null;

    const token = localStorage.getItem('token');

    if (token) {
        await axios.get('http://localhost:8000/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
                if (response.status === 200) {
                    isLoggedIng = true;
                }
            }
        ).catch(error => {
            errormsg = error.message;
            isLoggedIng = false;
        });
    }
    return {isLoggedIng, errormsg};
}

export default userLoginStatus;