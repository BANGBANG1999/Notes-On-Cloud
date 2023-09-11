import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate()
    let location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} style={{color:"white"}} to="/">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>
                        </ul>
                        {!localStorage.getItem("token")?<form className="d-flex" role="search">
                        <Link className="btn btn-secondary mx-2" to="/login" role="button">Log in</Link>
                        <Link className="btn btn-secondary" to="/signup" role="button">Sign up</Link>
                        </form>: < button onClick={handleLogout} className="btn btn-secondary">Log out</button>}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
