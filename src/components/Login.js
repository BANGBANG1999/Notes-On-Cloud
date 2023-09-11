import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

function Login(props) {
    const {showAlert} = props 
    const [credentials, setcredentials] = useState({username: "", password: ""});
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username : credentials.username, password: credentials.password }),
          });
          const json = await response.json();
          console.log(json)
          if(json.success){
            //save auth token and redirect
            localStorage.setItem("token", json.authToken)
            navigate("/")
            showAlert("Logged In Successfully", "success")
          }
          else{
            showAlert("Invalid Credentials", "danger")
          }
    }

    const onChange = (e) => {
        setcredentials({...credentials, [e.target.name] : e.target.value})
    }
    return (
        <>
        <h2 style={{marginBottom: "3rem", marginTop: "2rem"}}>Login to use iNotebook</h2>
        <div>
            <div className="my-3 row">
                <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="username" name="username" onChange={onChange} value={credentials.username}/>
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password}/>
                </div> 
            </div>           
        </div>
        <div>
            <input className="btn btn-primary my-2" type="submit" value="Submit" onClick={handleSubmit}/>
        </div>
        </>
    )
}

export default Login
