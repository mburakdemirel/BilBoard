import React from "react";
import './assets/bootstrap/css/bootstrap.min.css';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import NavigationBarLanding from "./NavigationBarLanding";
import Footer from "./Footer";
import {useState} from "react";
import axios from "axios";



function RegisterPage(){
    // User variables
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Create the POST request
    const urlSearchParams = new URLSearchParams(window.location.search);
    console.log(urlSearchParams.get("token"));
    const token = urlSearchParams.get("token");
    console.log(token);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const passwordData = {
            password: password,
            confirm_password: confirmPassword
        };
        if(password!==confirmPassword){
            setError('Passwords are not same')
        }
        else{
            try{

                const {data} = await axios.post('http://127.0.0.1:8000/api/user/change-password/'+ "?token="+ token, passwordData) ;
                console.log(data);
                window.location.href = "/login";

            } catch (error) {
                setLoading(false);
                if (error.response) {
                    console.log(error.response.data);
                    setError(error.response.data);

                } else if (error.request) {
                    setError('No response received from the server.');
                } else {
                    setError('An error occurred while setting up the request.');
                }

            }
        }


    }


    return(
        <section className="d-flex flex-column justify-content-center align-items-center position-relative py-4 py-xl-5" style={{ background: '#edf0f7', height: '90.5vh', minHeight: '700px'}}>
            <div className="container" data-aos="fade-up" data-aos-duration="600">
                <div className="row d-flex justify-content-center" style={{ height: '485px' }}>
                    <div className="col-md-6 col-xl-4 d-flex justify-content-center align-items-start" style={{ paddingRight: '15px', paddingLeft: '15px', width: '516px', height: '485px' }}>
                        <div className="card mb-5" style={{ border: 'none', borderRadius: '10px', paddingTop: '20px', width: '450px' }}>
                            <h2 style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', marginTop: '5px', textAlign: 'center' }}>Change Password</h2>
                            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                <form className="d-flex flex-column justify-content-center align-items-center" onSubmit={submit}>
                                    <input className="form-control mb-3" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={inputStyles} required />
                                    <input className="form-control mb-3" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" style={inputStyles} required />
                                    <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Change</button>
                                </form>
                                <div>
                                    {error && <div className="alert alert-danger" role="alert" style={{ whiteSpace:"pre-wrap", fontSize:'12px', margin:'0px' , padding:'10px',  textAlign: 'center', fontFamily: 'Inter, sans-serif', marginRight: '5px'}}>
                                        {error}

                                    </div>}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>

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