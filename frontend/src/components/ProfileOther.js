import 'bootstrap/dist/css/bootstrap.css';
import PlaceHolder from './assets/img/WF Image Placeholder.png';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import * as bootstrap from 'bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button';
import alert from "bootstrap/js/src/alert";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import Placeholder from "./assets/img/WF Image Placeholder2.png"
import {set} from "react-hook-form";
import AOS from "aos";

function ProfileOther() {
    const location = useLocation();
    const navigate = useNavigate();

    const {id} = useParams();

    const [error, setError] = useState(null);
    const [myProfile, setMyProfile] = useState();


    useEffect(()=>{
        AOS.init();
        onLoad();
    },[])

    const onLoad = async () => {

        try{
            // Create the GET request
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.post('http://127.0.0.1:8000/api/user/get-user-by-id/', {user_id:id}) ;
            console.log(data);

            setMyProfile(data);
        }
        catch (error){
            if (error.response) {
                if(error.response.status===401){
                    setError(`Your email or password is wrong`);
                }
                else{
                    setError(`Server responded with status code ${error.response.status}`);
                }

            } else if (error.request) {
                setError('No response received from the server.');
            } else {
                setError('An error occurred while setting up the request.');
            }
        }

    }




    return (

        <section  className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start  py-4 py-x-5" style={{ background: '#edf0f7', minHeight: '91vh'}}>
            {myProfile &&
            <div className="container d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex">
                <div className="row gx-1 gy-3 justify-content-center" ></div>
                <Products  myProfile={myProfile} ></Products>
                <ProfileArea myProfile={myProfile} ></ProfileArea>
            </div>
            }
        </section>


    );

}


function Products({myProfile, func}) {
    const navigate = useNavigate();
    const [filteredProductsType, setFilteredProductsType] = useState('secondhand');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState();
    const uploadProducts = async () => {
        try{
            setLoading(true);
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
                const {data} = await axios.post('http://127.0.0.1:8000/api/products/by-id/', {user_id: myProfile.id});
            console.log(products);
            setProducts(data);


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
        setLoading(false);
    }


    useEffect(()=>{
        uploadProducts();
    },[])

    const sendProductDetailPage = (index,pageType) => {
        navigate('/product_detail/' + pageType + '/' + index);
    }


    return (
        <div className="col-xxl-6 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center justify-content-sm-center align-items-sm-center align-items-md-center align-items-lg-center"
            data-aos="fade-right" data-aos-duration="600" style={{height: '40vw', width: '600px', minHeight: '380px', maxWidth:'93vw', paddingTop:'10px'}}>
            <div className="d-flex d-xxl-flex flex-column align-items-center  " style={{background: '#ffffff', fontSize: '12px', borderRadius: '10px', width: '95%', minWidth:'90%', padding: '5%', height: '100%',}} data-bs-smooth-scroll="true">


                <div className="input-group text-center d-flex d-xl-flex flex-row justify-content-lg-center justify-content-xl-center "
                     style={{width: '100%', borderStyle: 'none', borderBottomStyle: 'none', height: '40px', marginBottom: '0px',}}
                     data-aos="fade-right" data-aos-duration="600" >
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        onClick={(event) => setFilteredProductsType("secondhand")}
                        id="secondhand" style={{background: filteredProductsType==="secondhand"? '#2d3648' : '#717d96' , color: '#ffffff', width: '30%', fontFamily: 'Inter, sans-serif', fontSize: 'inherit', fontWeight: filteredProductsType==="secondhand"? 'bold':''}}>Second Hand
                    </button>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text" id="borrow"
                        onClick={(event) => setFilteredProductsType("borrow")}
                        style={{background: filteredProductsType==="borrow"? '#2d3648' : '#717d96' , color: '#ffffff', fontSize: 'inherit', width: '30%', fontFamily: 'Inter, sans-serif', fontWeight: filteredProductsType==="borrow"? 'bold':''}}>Borrow
                    </button>
                    <button className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                            onClick={(event) => setFilteredProductsType("donation")}
                            id="donation" style={{background: filteredProductsType==="donation"? '#2d3648' : '#717d96' , width: '30%', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 'inherit',fontWeight: filteredProductsType==="donation"? 'bold':''}}>Donation
                    </button>

                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '90%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />


                <div
                    className="card-group d-flex d-xxl-flex flex-row justify-content-start flex-sm-nowrap flex-md-nowrap flex-lg-nowrap flex-xl-nowrap align-items-xxl-start flex-xxl-wrap"
                    style={{ maxHeight: '89%', overflow: 'auto', width:'93%' }}>
                    {loading ? <div style={{width:'100%'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                        :
                        <>
                            {Array(products.length).fill().map((_, index) => {
                                if (products[index] && products[index].category === filteredProductsType) {
                                    return(<div className="card" key={index} id="product" style={{width: '168px', height: '168px', borderRadius: '10px', borderStyle: 'none', borderBottomStyle: 'none', padding: '5px',maxHeight:'168px',minHeight:'168px' ,minWidth: '168px', maxWidth: '168px',}}
                                                data-aos="zoom-in" data-aos-duration="600">
                                        <div className="card-body" style={{ width: '100%', height: '100%', padding: '0' }}
                                             onClick={()=>sendProductDetailPage(products[index].id,products[index].category)}>
                                            <img style={{ width: '100%', height: '100%' }} src={products[index].images && products[index].images.length > 0 ? products[index].images[0].image : Placeholder} alt={`Product ${index}`}/>
                                            <div style={{height: '40px', width: '100%', marginTop: '-40px', background: '#21252955', position: 'relative', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px', paddingTop: '3px', paddingBottom: '3px', paddingRight: '5px', paddingLeft: '5px'}}>
                                                <h1 className="text-center text-truncate d-flex d-xxl-flex justify-content-start align-items-start justify-content-xxl-start"
                                                    style={{width: '100%', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '0px',color:'white'}}>{products[index].title}</h1>
                                                <h1 className="text-center text-truncate d-flex d-xxl-flex justify-content-start justify-content-xxl-start"
                                                    style={{width: '100%', fontSize: '10px', fontFamily: 'Inter, sans-serif', marginBottom: '0px', color:'white'}}>{products[index].price && products[index].price + "₺"}</h1>
                                            </div>

                                        </div>
                                    </div>)
                                }
                            })}
                        </>

                    }

                </div>
            </div>
        </div>
    );
}

function ProfileArea({myProfile,func} ) {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    const navigate = useNavigate();
    const location = useLocation();



    const [loading, setLoading] = useState(false);
    const [nameSurname, setNameSurname] = useState(myProfile.name + " " + myProfile.surname);
    const [email, setEmail] = useState(myProfile.email);

    const [editMode, setEditMode] = useState(false);



    return (
        <div className="d-flex flex-grow-1 justify-content-center align-items-center order-last"  data-aos="fade-left" data-aos-duration="600" style={{width: '600px', height: '40vw', minHeight: '554px', maxWidth:'93vw', paddingTop:'10px',}}>
            <div className="d-flex d-xxl-flex flex-column justify-content-center align-items-stretch"
                style={{background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%', padding: '5%', paddingTop: '2%',}}>

                <div className="d-flex d-xxl-flex flex-column justify-content-center align-items-center align-items-xxl-center" style={{ height: 'initial', width: '100%' }}>
                    <img className="rounded-circle" src={myProfile.profile_photo ? myProfile.profile_photo : Placeholder} style={{ height: '150px', width: '150px', marginBottom: '30px' }} alt="User Profile" />
                    <h1 className="text-center" style={{ width: '100%',  fontSize: '258%', fontFamily: 'Inter, sans-serif', marginBottom: '20px', fontWeight: 'bold' }}>
                        {nameSurname}</h1>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: 'initial', width: '100%', padding: '2%' }}>
                    <p style={{ marginBottom: '0px', fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>+90 546 877 39 27</p>
                    <p style={{ marginBottom: '0px', fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>{email}</p>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex flex-column justify-content-between align-items-center align-content-around align-items-xxl-start" style={{ height: '40%', width: '100%', minHeight: '100px', background: '#edf0f7', borderRadius: '10px', paddingRight: '5px', paddingLeft: '10px', paddingTop: '3px', maxHeight: '200px' }}>
                    <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: '30%', width: '100%', minHeight: '40px' }}>
                        <h1 style={{fontSize: '1.6em', fontFamily: 'Inter, sans-serif', marginLeft: '0px', justifyContent:'start' }}>About</h1>
                    </div>
                </div>

            </div>
        </div>
    );


}

const inputStyles = {
    background: '#a0abc0',
    height: '100%',
    border: 'none',
    width: '150px',
    marginRight: '10px',
    marginLeft: '10px',
    paddingBottom: '5px',
    fontFamily: 'Inter, sans-serif'
};


export default ProfileOther;