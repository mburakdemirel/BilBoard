import React from 'react';
import Logo from './assets/img/burak.png'
import Footer from "./Footer";
import NavigationBarLanding from "./NavigationBarLanding";
import './assets/bootstrap/css/bootstrap.min.css'; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import Burak2 from './assets/img/burak2.jpeg';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import {isDisabled} from "@testing-library/user-event/dist/utils";
import {useContext} from "react";
import ContextApi from "../context/ContextApi";
import Carousel from 'react-bootstrap/Carousel';
import Product from './assets/img/IMG_2252.png';
import Product2 from './assets/img/products/3.jpg';

function ProductDetailPage() {
    const navigate = useNavigate();
    const {pageType, sendNewMessage} = useContext(ContextApi);


    const {id} = useParams();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState('');
    const imageUrl = "http://127.0.0.1:8000/media/pphotos/102050644.png.webp";




    useEffect(()=>{
        console.log("Page Type in detail page" + pageType);
        if(pageType){
            uploadSelectedProduct(pageType);
        }

        // Messages in the selected index will be opened on the right side
    },[])

    const uploadSelectedProduct = async (pageType) => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/product/' + pageType + '/'+ id);
            console.log(data);
            setProduct(data);
            setLoading(false);

        }
        catch (error){
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log('No response received from the server.');
            } else {
                console.log('An error occurred while setting up the request.');
            }
        }
    }

    const sendMessage = () => {
        const newMessage = { product_name: product.title, product_price: product.price};
        sendNewMessage(newMessage);
        navigate("/messages");
    }

    return (
        <section className=" d-flex justify-content-center align-items-center py-4"  style={{background: '#edf0f7',minHeight: '91vh'}}>
            <div className="container">
                <div className="row gx-1 gy-3"  style={{ width: '100%', marginTop: '-21px'}}>


                    <div className=" d-flex flex-grow-1 justify-content-center align-items-center" data-aos="fade-right" data-aos-duration="600"  style={imageContainerStyle}>
                        <div className="d-flex justify-content-center align-items-center " style={sliderContainerStyle}>
                                    <Carousel style={{height:'40wv', width: '94%', borderRadius:'10px', backgroundColor:'#2B2B2B'}}>
                                        <Carousel.Item >
                                            <div className="d-flex justify-content-center " style={{height:'40vw'}}>
                                                <img className="d-block h-100 "  src={Product} alt="First slide"/>
                                            </div>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <div className="d-flex justify-content-center " style={{height:'40vw'}}>
                                                <img className="d-block h-100 "  src={Product2} alt="First slide"/>
                                            </div>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <div className="d-flex justify-content-center " style={{height:'40vw'}}>
                                                <img className="d-block h-100 "  src={Burak2} alt="First slide"/>
                                            </div>
                                        </Carousel.Item>


                                    </Carousel>

                            </div>

                    </div>

                    <div className="d-flex flex-grow-1 justify-content-center align-items-center" data-aos="fade-left" data-aos-duration="600" style={containerStyle}>
                        <div className="d-flex flex-column " style={cardStyle}>
                            <h1 className="placeholder-glow" style={headingStyle}>{product.title}
                                {loading && <span className="placeholder col-7"></span>}
                            </h1>
                            <hr style={hrStyle} />
                            <h1 className="placeholder-glow" style={{ ...headingStyle, fontSize: '2.4em', fontWeight: 'bold' }}>{product.price}
                                {loading && <span className="placeholder col-3"></span>}
                            </h1>
                            <hr style={hrStyle} />
                            <div className="d-flex justify-content-between align-items-center placeholder-glow" style={{ height: '10%', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                <div className="d-flex flex-column justify-content-evenly" style={{ height: '100%', width: '100%'}}>
                                    {loading ? <span className="placeholder col-5 h-50"></span> : <h1 style={sellerNameStyle}>{product.user.name + " " + product.user.surname}</h1>}
                                    {loading ? <span className="placeholder col-5 h-25"></span> : <h1 style={sellerPhoneStyle}>123123213</h1>}
                                </div>




                                <img className="rounded-circle mb-3 fit-cover" data-bss-hover-animate="pulse" src={loading? Burak2 :imageUrl} style={imageStyle} />
                            </div>
                            <hr style={hrStyle} />
                            <div className="d-flex flex-row justify-content-between align-items-center" style={{ height: '10%', width: '100%', minHeight: '40px', maxHeight: '50px' }}>
                                <button onClick={sendMessage} disabled={loading} className="btn btn-primary d-flex justify-content-center align-items-center" role="button" style={{ width: '30%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '150px' }} href="messages.html">
                                    {!loading && <><span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Send Message</span>
                                    <i className="bi bi-send-fill" style={{ fontSize: '16px', color:'white' }}  ></i></>}
                                </button>
                                <div className="d-flex flex-row justify-content-around align-items-center" style={{ height: '100%', minWidth: '140px' }}>
                                    <button disabled={loading} className="btn btn-primary" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%', minWidth: '40px' }}>
                                        {!loading && <i className="bi bi-bell-fill"></i>}
                                    </button>
                                    <button disabled={loading} className="btn btn-primary" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}>
                                        {!loading && <i className="bi bi-heart-fill"></i>}
                                    </button>
                                    <button disabled={loading} className="btn btn-primary" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}>
                                        {!loading && <i className="bi bi-share-fill" ></i>}
                                    </button>
                                </div>
                            </div>
                            <hr style={hrStyle} />
                            <div className="d-flex flex-column" style={{ height: '55%', width: '100%', minHeight: '120px', background: '#edf0f7', borderRadius: '10px', paddingRight: '10px', paddingLeft: '10px', paddingTop: '3px' }}>
                                <div className="d-flex flex-row align-items-center " style={{ height: '20%', width: '100%', minHeight: '40px' }}>
                                    <h1 style={{ ...headingStyle, fontSize: '1.6em' }}>Description</h1>
                                    <button className="btn btn-primary disabled d-flex justify-content-center align-items-center" type="button" style={{ width: '30%', height: '70%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px' }} disabled>
                                        <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>{product.category}</span>
                                    </button>
                                </div>
                                {loading &&<div className="d-flex flex-column placeholder-glow" style={{width:'100%'}}>
                                    <span className="placeholder col-9"  style={{height:'17px', marginTop:'10px', marginBottom:'10px'}}></span>
                                    <span className="placeholder col-7"  style={{height:'17px', marginBottom:'10px'}}></span>
                                    <span className="placeholder col-5"  style={{height:'17px', marginBottom:'10px'}}></span>

                                </div>
                                    }
                                <p style={{height: '100%', width: '100%', fontSize: '14px', textAlign: 'left'}}>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );


};
const imageContainerStyle = {
    width: '600px',
    height: '40vw',
    borderRadius: '10px'
};

const containerStyle = {
    width: '600px',
    height: '40vw',
    minHeight: '400px',
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
const sellerPhoneStyle = {
    width: '60%',
    fontSize: '1.5em',
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