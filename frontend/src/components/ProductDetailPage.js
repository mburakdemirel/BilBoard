import React from 'react';
import Logo from './assets/img/burak.png'
import Footer from "./Footer";
import NavigationBarLanding from "./NavigationBarLanding";
import './assets/bootstrap/css/bootstrap.min.css'; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";

function ProductDetailPage() {

    let product  = {
        heading: "Deneme",
        price: 12,
        sellerName: 'Eren',
        description: 'Bu bir test ürünüdür',

    }


    return (
        <section
            className=" d-flex justify-content-center align-items-center py-4 py-xl-5"  style={{background: '#edf0f7',minHeight: '91vh'}}>
            <div className="container">
                <div className="row gx-1 gy-3"  style={{margin: '0px', width: '100%', marginTop: '-21px'}}>
                    <div className=" d-flex flex-grow-1" data-aos="fade-right" data-aos-duration="600"  style={containerStyle}>
                        <div className="d-flex justify-content-center align-items-center " style={sliderContainerStyle}>
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

                    <div className="d-flex flex-grow-1 justify-content-center align-items-center" data-aos="fade-left" data-aos-duration="600" style={containerStyle}>
                        <div className="d-flex flex-column " style={cardStyle}>
                            <h1 style={headingStyle}>{product.heading}</h1>
                            <hr style={hrStyle} />
                            <h1 style={{ ...headingStyle, fontSize: '2.4em', fontWeight: 'bold' }}>{product.price + "₺"}</h1>
                            <hr style={hrStyle} />
                            <div className="d-flex justify-content-between align-items-center" style={{ height: '10%', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                <h1 style={sellerNameStyle}>{product.sellerName}</h1>
                                <img className="rounded-circle mb-3 fit-cover" data-bss-hover-animate="pulse" src={Logo} style={imageStyle} />
                            </div>
                            <hr style={hrStyle} />
                            <div className="d-flex flex-row justify-content-between align-items-center" style={{ height: '10%', width: '100%', minHeight: '40px', maxHeight: '50px' }}>
                                <a className="btn btn-primary d-flex justify-content-center align-items-center  " role="button" style={{ width: '30%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '150px' }} href="messages.html">
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Send Message</span>
                                    <i className="bi bi-send-fill" style={{ fontSize: '16px', color:'white' }}  ></i>
                                </a>
                                <div className="d-flex flex-row justify-content-around align-items-center" style={{ height: '100%', minWidth: '140px' }}>
                                    <button className="btn btn-primary" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%', minWidth: '40px' }}>
                                        <i className="bi bi-bell-fill"></i>
                                    </button>
                                    <button className="btn btn-primary" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}>
                                        <i className="bi bi-heart-fill"></i>
                                    </button>
                                    <button className="btn btn-primary" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}>
                                        <i className="bi bi-share-fill" ></i>
                                    </button>
                                </div>
                            </div>
                            <hr style={hrStyle} />
                            <div className="d-flex flex-column" style={{ height: '55%', width: '100%', minHeight: '120px', background: '#edf0f7', borderRadius: '10px', paddingRight: '10px', paddingLeft: '10px', paddingTop: '3px' }}>
                                <div className="d-flex flex-row align-items-center " style={{ height: '20%', width: '100%', minHeight: '40px' }}>
                                    <h1 style={{ ...headingStyle, fontSize: '1.6em' }}>Description</h1>
                                    <button className="btn btn-primary disabled d-flex justify-content-center align-items-center" type="button" style={{ width: '30%', height: '70%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px' }} disabled>
                                        <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>Second-Hand</span>
                                    </button>
                                </div>
                                <p style={{height: '100%', width: '100%', fontSize: '14px', textAlign: 'left'}}>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );


};

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
    height: '60px',
    margin: '0px',
    marginTop: '17px',
    width: '60px',
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


export default ProductDetailPage;