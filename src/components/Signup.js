import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";



function Signup(props) {
  const {showAlert} = props 
  const [credentials, setcredentials] = useState({name: "", username: "", password: "", cpassword: ""});
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: credentials.name, username : credentials.username, password: credentials.password }),
          });
          const json = await response.json();
          console.log(json)
          
          if(json.success){
            //save auth token and redirect
            localStorage.setItem("token", json.authToken)
            navigate("/")
            showAlert("Account Created Successfully", "success")
          }
          else{
            if(json.error === "Username already exists."){
              showAlert("Username already exists", "danger")
            }
            else{

              showAlert("Invalid Credentials", "danger")
            }
          }
    }

    const onChange = (e) => {
        setcredentials({...credentials, [e.target.name] : e.target.value})
    }
  return (
    <>
    <h2 style={{marginBottom: "3rem", marginTop: "2rem"}}>Signup to use iNotebook</h2>
      <div>
            <div className="mb-3 row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} value={credentials.name}/>
                </div>
            </div>
            <div className="mb-3 row">
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
            <div className="mb-3 row">
                <label htmlFor="password" className="col-sm-2 col-form-label">Confirm password</label>
                <div className="col-sm-10">
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} value={credentials.cpassword}/>
                </div> 
            </div>           
        </div>
        <div>
            <input className="btn btn-primary my-2" type="submit" value="Submit" onClick={handleSubmit}/>
        </div>
    </>
  )
}

export default Signup
