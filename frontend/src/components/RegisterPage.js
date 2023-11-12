import React from "react";
import './assets/bootstrap/css/bootstrap.min.css';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import NavigationBarLanding from "./NavigationBarLanding";
import Footer from "./Footer";
import {useState} from "react";
import axios from "axios";



function RegisterPage(){
    // User variables
    // User variables
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const user = {
            email: email,
            name: name,
            surname: surname,
            password: password
        };
        console.log(user);

        if(password!==confirmPassword){
            setError('Passwords are not same')
        }
        else{
            try{
                // Create the POST request
                const {data} = await axios.post('http://127.0.0.1:8000/api/user/register/', user) ;
                console.log(data);
                window.location.href = "/login";

            } catch (error) {
                setLoading(false);

                if (error.response) {
                    console.log(error.response.data);
                    const {email, password} = error.response.data;
                    let errorMessage = '';
                    if (email) errorMessage += email;
                    if (email && password) errorMessage += "\n"; // Only add a newline if both errors exist
                    if (password) errorMessage += password;
                    setError(errorMessage);

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
                            <h2 style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', marginTop: '5px', textAlign: 'center' }}>Sign Up</h2>
                            <div className="card-body d-flex flex-column justify-content-center align-items-center">
                                <form className="d-flex flex-column justify-content-center align-items-center" onSubmit={submit}>
                                    <input className="form-control mb-3" value={name} onChange={e=>setName(e.target.value)} type="text" id="name-2" name="name" placeholder="Name" style={inputStyles} required />
                                    <input className="form-control mb-3" value={surname} onChange={e=>setSurname(e.target.value)} type="text" name="surname" placeholder="Surname" style={inputStyles} required />
                                    <input className="form-control mb-3" value={email} onChange={e=>setEmail(e.target.value)} type="email" id="email-2" name="email" placeholder="Email" style={inputStyles} required />
                                    <input className="form-control mb-3" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={inputStyles} required />
                                    <input className="form-control mb-3" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" style={inputStyles} required />
                                    <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Register</button>
                                    <p style={textStyles}>Already have an account? <a href="/login" style={{ fontFamily: 'Inter, sans-serif', color: 'rgb(0,0,0)', fontWeight: 'bold' }}>Sign In</a></p>
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