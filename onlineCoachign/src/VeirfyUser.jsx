import React from "react";
import { Navigate } from "react-router-dom";
// Only for Teachers
export const VerifyUser = () => {
    const [nav, updateNav] = React.useState(false);
    React.useEffect(() => {
        try {
            let token = JSON.parse(localStorage.getItem("userData")).token;
            if(JSON.parse(localStorage.getItem("userData")).role=="student") {
                // alert("HERE1")
                localStorage.clear();
                updateNav(true);
            }
            let url = `https://homebackend-3y7i.onrender.com/verifyUser?token=${token}`;
            fetch(url)
            .then(res => res.json())
            .then(dat => {
                // alert("HERE1")
                if(!(dat.status==200)) {
                    localStorage.clear();
                    updateNav(true);
                }
            })
        } catch(err) {
            localStorage.clear();
            updateNav(true);
        }
    }, []);
    return (
        <>
            {nav?<Navigate to="/" />:null}
        </>
    );
}