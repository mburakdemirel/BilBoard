import React from 'react';
import Logo from './assets/img/burak.png'
import Footer from "./Footer";
import NavigationBarLanding from "./NavigationBarLanding";
import './assets/bootstrap/css/bootstrap.min.css'; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";

const containerStyle = {
    width: '600px',
    height: '40vw',
    minHeight: '380px',
    borderRadius: '10px'
};

const cardStyle = {
    background: 'var(--bs-white)',
    fontSize: '12px',
    borderRadius: '10px',
    height: '100%',
    width: '95%',
    padding: '7%',
};

const headingStyle = {
    width: '100%',
    fontSize: '2em',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '0px',
    textAlign: 'left'
};

const hrStyle = {
    width: '100%',
    margin: '0px',
    marginTop: '8px',
    marginBottom: '8px',
};

const sellerNameStyle = {
    width: '60%',
    fontSize: '2em',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '0px',
    textAlign: 'left'
};

const imageStyle = {
    height: '180%',
    margin: '0px',
    marginTop: '17px',
    width: '20%',
    minWidth: '100px',
};

const sliderContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '10px'
};

const sliderStyle = {
    borderRadius: '10px',
    width: '94%',
    height: '100%',
};

const slideStyle = {
    background: 'url("https://cdn.bootstrapstudio.io/placeholders/1400x800.png") center center / cover no-repeat',
    height: '100%',
};



function ProductDetailPage() {
    return (
        <html data-bs-theme="light" lang="en">

        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"/>
            <title>BugBunny Ins (Backup 1695941318144)</title>
        </head>
        <body>
        <NavigationBarLanding/>

        <section
            className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5"
            style={{background: '#edf0f7',minHeight: '91vh'}}>
            <div
                className="container d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex justify-content-center align-items-center justify-content-sm-center
                align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center
                align-items-xl-center justify-content-xxl-center align-items-xxl-center h-100">
                <div
                    className="row gx-1 gy-3 d-xxl-flex justify-content-sm-center justify-content-md-center justify-content-lg-center align-items-xl-center h-100"
                    style={{margin: '0px', width: '100%', marginTop: '-21px'}}>

                    <div
                        className="col-xxl-6 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center justify-content-sm-center align-items-sm-center align-items-md-center align-items-lg-center"
                        data-aos="fade-right"
                        data-aos-duration="600"
                        style={containerStyle}
                    >
                        <div className="d-flex d-md-flex d-lg-flex d-xxl-flex justify-content-center align-items-center justify-content-md-center align-items-md-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-center" style={sliderContainerStyle}>
                            <div className="simple-slider" style={sliderStyle}>
                                <div className="swiper-container" style={{ borderRadius: '10px', height: '100%' }}>
                                    <div className="swiper-wrapper" style={{ height: '100%' }}>
                                        <div className="swiper-slide" style={slideStyle}></div>
                                    </div>
                                    <div className="swiper-pagination"></div>
                                    <div className="swiper-button-prev" style={{ color: '#2D3648' }}></div>
                                    <div className="swiper-button-next" style={{ color: '#2D3648' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div
                        className="col-xl-6 col-xxl-5 offset-xxl-0 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center order-last justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-center"
                        data-aos="fade-left"
                        data-aos-duration="600"
                        style={containerStyle}>
                        <div className="d-flex d-xxl-flex flex-column justify-content-evenly align-items-xxl-center" style={cardStyle}>
                            <h1 style={headingStyle}>Heading</h1>
                            <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={hrStyle} />
                            <h1 style={{ ...headingStyle, fontSize: '2.4em', fontWeight: 'bold' }}>Price</h1>
                            <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={hrStyle} />
                            <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: '10%', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                <h1 style={sellerNameStyle}>Seller Name</h1>
                                <img className="rounded-circle mb-3 fit-cover" data-bss-hover-animate="pulse" width="48" height="48" src={Logo} style={imageStyle} />
                            </div>
                            <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={hrStyle} />
                            <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: '10%', width: '100%', minHeight: '40px', maxHeight: '50px' }}>
                                <a className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" role="button" style={{ width: '30%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '150px' }} href="messages.html">
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Send Message</span>
                                    <i className="bi bi-send-fill" style={{ fontSize: '16px', color:'white' }}  ></i>
                                </a>
                                <div className="d-flex flex-row justify-content-around align-items-center" style={{ height: '100%', minWidth: '140px' }}>
                                    <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%', minWidth: '40px' }}>
                                        <i className="bi bi-bell-fill"></i>
                                    </button>
                                    <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}>
                                        <i className="bi bi-heart-fill"></i>
                                    </button>
                                    <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}>
                                        <i className="bi bi-share-fill" ></i>
                                    </button>
                                </div>
                            </div>
                            <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={hrStyle} />
                            <div className="d-flex flex-column justify-content-between align-items-center align-content-around align-items-xxl-start" style={{ height: '30%', width: '100%', minHeight: '130px', background: '#edf0f7', borderRadius: '10px', paddingRight: '10px', paddingLeft: '10px', paddingTop: '3px' }}>
                                <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: '30%', width: '100%', minHeight: '40px' }}>
                                    <h1 style={{ ...headingStyle, fontSize: '1.6em' }}>Description</h1>
                                    <button className="btn btn-primary disabled d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" type="button" style={{ width: '30%', height: '70%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px' }} disabled>
                                        <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>Second-Hand</span>
                                    </button>
                                </div>
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

export default ProductDetailPage;