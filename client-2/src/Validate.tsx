import React from "react";
import { Navigate } from "react-router-dom";

export default function Validate() {
    const [nav, updateNav] = React.useState(false);
    React.useEffect(() => {
        try {
          const params = new URLSearchParams(window.location.search);
          console.log("hey")
        //   console.log();
        //   console.log(params.get('bId'));
        //   console.log(params.get('id'));
          let url = `https://homebackend-3y7i.onrender.com/loadTeacherBData?session=${params.get('session')}&bId=${params.get('bId')}&id=${params.get('id')}`;
          fetch(url)
          .then(res => res.json())
          .then(dat => {
            console.log(dat.data);
            if(dat.status==200) {
              localStorage.setItem("userData", JSON.stringify(dat.data[0]));
              localStorage.setItem("batchId", `${params.get('bId')}`)
              localStorage.setItem("sId", `${params.get('id')}`)
              updateNav(true);
            }
          });
        } catch(err) {
    
        }
      }, []);
      return(<>{nav?<Navigate to="/" />:null}</>);
}