import React from 'react';
import './assets/bootstrap/css/bootstrap.min.css'; // Import Bootstrap CSS
import Sıla from './assets/img/sıla.png'
import Dilara from './assets/img/dilara.png'
import Yusuf from './assets/img/yusuf.png'
import Burak from './assets/img/burak.png'
import Eren from './assets/img/eren.png'

//import './assets/css/aos.min.css'
//import './assets/css/animate.min.css'

import NavigationBarLanding from "./NavigationBarLanding";
import Footer from "./Footer";

const WelcomeSection = () => (
    <section className="py-4 py-xl-5" style={{ background: '#edf0f7', height: '40vh' }}>
        <div className="container h-100">
            <div className="row h-100">
                <div className="col-md-10 col-xl-8 text-center d-flex align-items-center mx-auto">
                    <div>
                        <h2 className="text-uppercase fw-semibold mb-3" style={{ fontFamily: 'Inter' }}>
                            <strong>WELCOME TO BILBOARD</strong>
                        </h2>
                        <p className="mb-4" style={{ fontFamily: 'Inter' }}>
                            A place where Bilkent students can buy or sell secondhand goods, borrow or donate stuff,
                            post about the lost items they found, and write their complaints.
                        </p>
                        <a className="btn btn-primary fs-6 fw-semibold me-2 py-2 px-4" role="button" style={{ background: '#2d3648', borderWidth: '2px', borderColor: '#2d3648' }} href="product_page.html">Login</a>
                        <a className="btn btn-outline-primary fs-6 fw-semibold py-2 px-4" role="button" style={{ borderWidth: '2px', borderColor: '#2d3648', color: '#2d3648', background: '#ffffff' }} href="product_add_2.html">Register</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ServicesSection = () => (
    <section className="d-flex flex-column justify-content-center align-items-center" style={{ padding: '45px 0 40px', background: '#2d3648' }}>
        <div className="row mb-5" style={{ width: '100%' }}>
            <div className="col-md-8 col-xl-6 text-center mx-auto">
                <h2 style={{ color: '#eef0f7' }}>About our services</h2>
                <p className="w-lg-50" style={{ color: '#eef0f7' }}>BilBoard is a web application created only for Bilkent students.</p>
            </div>
        </div>
        <div className="row gy-4 row-cols-2 row-cols-md-4 d-flex justify-content-center" style={{ padding: '0', width: '100%' }}>
            {/* You can create another component for the individual card or simply map through a data array if they have similar structure */}
            {/*{[...Array(4)].map((_, index) => (
                <div className="col" style={{ maxWidth: '200px' }} key={index}>
                    <div className="card border-0 shadow-none">
                        <div className="card-body text-center d-flex flex-column align-items-center p-0" style={{ background: '#A0ABC0' }}>
                            index
                        </div>
                    </div>
                </div>
            ))}*/}

            <div
                className="col d-sm-flex justify-content-center align-items-center justify-content-sm-end justify-content-md-center
                        justify-content-lg-center justify-content-xl-center justify-content-xxl-center"
                        style={{padding: '0px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '200px',}}>
                <div className="card" style={{borderRadius: '10px', background: '#A0ABC0', maxWidth: '200px', height: '168px', minHeight: '100px',}}>
                    <div className="card-body flex-grow-0 flex-shrink-1 flex-fill justify-content-xl-center align-items-xl-center"
                        style={{fontSize: '10px', transform: 'rotate(0deg)', padding: '0px', width: '148px', paddingTop: '25px', paddingBottom: '0px',}}>
                    </div>
                </div>
            </div>

            <div
                className="col d-sm-flex justify-content-center align-items-center justify-content-sm-end justify-content-md-center
                        justify-content-lg-center justify-content-xl-center justify-content-xxl-center"
                style={{padding: '0px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '200px',}}>
                <div className="card" style={{borderRadius: '10px', background: '#A0ABC0', maxWidth: '200px', height: '168px', minHeight: '100px',}}>
                    <div className="card-body flex-grow-0 flex-shrink-1 flex-fill justify-content-xl-center align-items-xl-center"
                         style={{fontSize: '10px', transform: 'rotate(0deg)', padding: '0px', width: '148px', paddingTop: '25px', paddingBottom: '0px',}}>
                    </div>
                </div>
            </div>

            <div
                className="col d-sm-flex justify-content-center align-items-center justify-content-sm-end justify-content-md-center
                        justify-content-lg-center justify-content-xl-center justify-content-xxl-center"
                style={{padding: '0px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '200px',}}>
                <div className="card" style={{borderRadius: '10px', background: '#A0ABC0', maxWidth: '200px', height: '168px', minHeight: '100px',}}>
                    <div className="card-body flex-grow-0 flex-shrink-1 flex-fill justify-content-xl-center align-items-xl-center"
                         style={{fontSize: '10px', transform: 'rotate(0deg)', padding: '0px', width: '148px', paddingTop: '25px', paddingBottom: '0px',}}>
                    </div>
                </div>
            </div>

            <div
                className="col d-sm-flex justify-content-center align-items-center justify-content-sm-end justify-content-md-center
                        justify-content-lg-center justify-content-xl-center justify-content-xxl-center"
                style={{padding: '0px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '200px',}}>
                <div className="card" style={{borderRadius: '10px', background: '#A0ABC0', maxWidth: '200px', height: '168px', minHeight: '100px',}}>
                    <div className="card-body flex-grow-0 flex-shrink-1 flex-fill justify-content-xl-center align-items-xl-center"
                         style={{fontSize: '10px', transform: 'rotate(0deg)', padding: '0px', width: '148px', paddingTop: '25px', paddingBottom: '0px',}}>
                    </div>
                </div>
            </div>


        </div>
    </section>
);

const WhyUseSection = () => (
    <section className="py-4 py-xl-5" style={{ background: '#717D96' }}>
        <div className="container h-100">
            <div className="row h-100" style={{ padding: '25px 0' }}>
                <div className="col-md-10 col-xl-8 text-center d-flex justify-content-center align-items-center mx-auto" data-aos="zoom-in-up" data-aos-duration="700">
                    <div style={{ borderColor: '#eef0f7' }}>
                        <h2 className="text-uppercase fw-bold mb-3" style={{ fontFamily: 'Inter', color: '#eef0f7' }}>WHY SHOULD YOU USE BILBOARD?</h2>
                        <p className="mb-4" style={{ fontFamily: 'Inter', color: '#eef0f7' }}>
                            This application was made especially for solving a couple of similar problems. As you might have noticed,
                            there is no official media for Bilkent students to exchange stuff or write their complaints. Students use
                            other social media platforms for these purposes. With BilBoard, we created a secure place for those exchanges
                            and added a complaint system so the students' complaints could be heard. We believe BilBoard will benefit most
                            of the Bilkent students.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TeamSection = () => {
    const teamMembers = [
        {
            name: "Sıla",
            image: Sıla,
            linkedin: "https://www.linkedin.com/in/s%C4%B1la-%C3%B6zel-0b9625242/"
        },
        {
            name: "Dilara",
            image: Dilara,
            linkedin: "https://www.linkedin.com/in/dilara-mand%C4%B1rac%C4%B1-1bb8b8207/"
        },
        {
            name: "Yusuf",
            image: Yusuf,
            linkedin: "https://www.linkedin.com/in/yusuf-toraman-582216252/"
        },
        {
            name: "Burak",
            image: Burak,
            linkedin: "https://www.linkedin.com/in/mburakdemirel/"
        },
        {
            name: "Eren",
            image: Eren,
            linkedin: "https://www.linkedin.com/in/erenarim/"
        }
    ];

    return (
        <section style={{ background: '#2d3648', paddingBottom: '30px' }}>
            <div className="container py-4 py-xl-5">
                <div className="row mb-4 mb-lg-5">
                    <div className="col-md-8 col-xl-6 text-center mx-auto">
                        <h2 data-aos="zoom-in-up" style={{ color: '#ffffff', fontFamily: 'Inter' }}>Team</h2>
                    </div>
                </div>
                <div className="row gy-4 row-cols-2 row-cols-md-4 justify-content-center" data-aos="zoom-in-up" data-aos-duration="700">
                    {teamMembers.map(member => (
                        <div key={member.name} className="col" style={{ maxWidth: '200px' }}>
                            <div className="card border-0 shadow-none">
                                <div className="card-body text-center d-flex flex-column align-items-center p-0" style={{ background: '#2d3648' }}>
                                    <a href={member.linkedin}>
                                        <img className="rounded-circle mb-3 fit-cover" data-bss-hover-animate="pulse" width="130" height="130" src={member.image} alt={`Team Member ${member.name}`} style={{ width: '160px', height: '160px' }} />
                                    </a>
                                    <h5 className="fs-5 fw-light text-white card-title mb-0" style={{ fontFamily: 'Inter' }}>{member.name}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};




function LandingPage() {
    return (
        <html data-bs-theme="light" lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
            <title>BugBunny Ins (Backup 1695941318144)</title>
            <script src="assets/js/aos.min.js"></script>
            <script src="assets/js/bs-init.js"></script>

        </head>

        <body>

        <NavigationBarLanding/>

        <WelcomeSection/>
        <ServicesSection/>
        <WhyUseSection/>
        <TeamSection/>

        <Footer/>

        </body>
        </html>
    );
};

export default LandingPage;
