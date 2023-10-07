import React from "react";
import './assets/bootstrap/css/bootstrap.min.css';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import NavigationBarLanding from "./NavigationBarLanding";
import Footer from "./Footer"; // Import Bootstrap CSS

function RegisterPage(){
    return(
        <html data-bs-theme="light" lang="en">
        <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
            <title>BugBunny Ins (Backup 1695941318144)</title>
        </head>

        <body>

        <NavigationBarLanding/>

        <section className="d-flex flex-column justify-content-start align-items-center position-relative py-4 py-xl-5" style={{ background: '#edf0f7', height: '90.5vh', minHeight: '700px'}}>
            <img data-aos="fade-down" data-aos-duration="600" src={Logo} alt="Logo" style={{ marginBottom: '25px', width: '100px', marginTop: '-30px' }} />
            <div className="container" data-aos="fade-up" data-aos-duration="600">
                <div className="row d-flex justify-content-center" style={{ height: '485px' }}>
                    <div className="col-md-6 col-xl-4 d-flex justify-content-center align-items-start" style={{ paddingRight: '15px', paddingLeft: '15px', width: '516px', height: '485px' }}>
                        <div className="card mb-5" style={{ border: 'none', borderRadius: '10px', paddingTop: '20px', width: '450px' }}>
                            <h2 style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', marginTop: '5px', textAlign: 'center' }}>Sign Up</h2>
                            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                <form className="d-flex flex-column justify-content-center align-items-center" method="post">
                                    <input className="form-control mb-3" type="text" id="name-2" name="name" placeholder="Name" style={{ background: '#a0abc0', height: '45px', width: '300px', fontFamily: 'Inter, sans-serif', border: 'none' }} />
                                    <input className="form-control mb-3" type="text" name="suname" placeholder="Surname" style={inputStyles} />
                                    <input className="form-control mb-3" type="email" id="email-2" name="email" placeholder="Email" style={inputStyles} />
                                    <input className="form-control mb-3" type="password" placeholder="Password" style={inputStyles} />
                                    <input className="form-control mb-3" type="password" placeholder="Confirm Password" style={inputStyles} />
                                    <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Register</button>
                                    <p style={textStyles}>Already have an account? <a href="login_2.html" style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', fontWeight: 'bold' }}>Sign In</a></p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer/>

        </body>
        </html>
    );
};

const inputStyles = {
    background: '#a0abc0',
    height: '45px',
    border: 'none',
    width: '300px',
    fontFamily: 'Inter, sans-serif'
};

const textStyles = {
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif'
};

export default RegisterPage;