import React from "react";
import './assets/bootstrap/css/bootstrap.min.css';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import NavigationBarLanding from "./NavigationBarLanding";
import Footer from "./Footer"; // Import Bootstrap CSS

function LoginPage(){
    return(

            <section className="d-flex flex-column justify-content-center align-items-center py-4 py-xl-5 position-relative" style={{ background: '#edf0f7', height: '90.5vh' }}>

                <div className="container" data-aos="fade-up" data-aos-duration="600">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 col-xl-4 d-flex justify-content-center align-items-center" style={{width: '500px'}}>
                            <div className="card mb-5" style={{ borderStyle: 'none', borderRadius: '10px', paddingTop: '20px', width: '450px' }}>
                                <div className="d-flex flex-column align-items-center">
                                    <h2 style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', marginTop: '5px' }}>Login</h2>
                                </div>
                                <div className="card-body d-flex flex-column align-items-center">
                                    <form className="text-center" method="post" style={{ width: '300px' }}>
                                        <div className="mb-3">
                                            <input className="form-control" type="email" name="email" placeholder="Email" style={inputStyle} required />
                                        </div>
                                        <div className="mb-3">
                                            <input className="form-control" type="password" name="password" placeholder="Password" style={inputStyle} required />
                                        </div>
                                        <div className="d-flex flex-row justify-content-center align-items-center mb-3">
                                            <input type="checkbox" style={{ width: '18px', height: '18px', borderStyle: 'solid', borderColor: 'rgb(0,0,0)' }} />
                                            <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', margin: '0px', color: 'rgb(0,0,0)', paddingLeft: '10px' }}>Remember me</h2>
                                        </div>
                                        <div className="mb-3">
                                            <button className="btn btn-primary d-block w-100" type="submit" style={{ background: '#2d3648', borderStyle: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Login</button>
                                        </div>
                                        <p className="text-muted" style={{ marginTop: '-7px', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}>Forgot your password?</p>
                                    </form>
                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '300px' }}>
                                        <a style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', marginRight: '5px' }}>Don't have an account yet?</a>
                                        <a href="register.html" style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', fontWeight: 'bold' }}>Register</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    );

};


const inputStyle = {
    background: '#a0abc0',
    fontFamily: 'Inter, sans-serif',
    height: '45px',
    borderStyle: 'none'
};

export default LoginPage;