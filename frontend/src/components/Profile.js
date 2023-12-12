import 'bootstrap/dist/css/bootstrap.css';
import PlaceHolder from './assets/img/WF Image Placeholder.png';
import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import * as bootstrap from 'bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button';
import alert from "bootstrap/js/src/alert";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import Placeholder from "./assets/img/WF Image Placeholder2.png"
import {set} from "react-hook-form";
import {json} from "react-router";
import ContextApi from "../context/ContextApi";

//There are two kinds of profiles and they are rendered according to the value of myProfile boolean.
//Probably myProfile will take its value from a context. Or we might directly pass is as props.
//TODO: put all style attributes in a css file



function Profile() {
    const location = useLocation();
    const navigate = useNavigate();

    const {id} = useParams();
    console.log(id);
    const [error, setError] = useState(null);
    const [myProfile, setMyProfile] = useState();
    const [editMode, setEditMode] = useState(false);

     const pull_data = (data) => {
        console.log("edit mode " + data); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
         setEditMode(data);
    }

    const onLoad = async () => {
        setMyProfile(JSON.parse(localStorage.getItem('myProfile')));
            if(!myProfile){
                try{
                    // Create the GET request
                    axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
                    const {data} = await axios.get('http://127.0.0.1:8000/api/user/me/') ;
                    //console.log(data);
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
        }





    useEffect(()=>{
        onLoad();

    },[])

    return (
        <section  className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start  py-4 py-x-5" style={{ background: '#edf0f7', minHeight: '91vh'}}>
            {myProfile ?
                <div className="container d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex">
                <div className="row gx-1 gy-3 justify-content-center" ></div>
                <Products  myProfile={myProfile} func={pull_data} editMode={editMode}></Products>
                <ProfileArea myProfile={myProfile} func={pull_data}></ProfileArea>
                </div>
                :
                <div className="spinner-border m-10" style={{color: '#2d3648'}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            }
        </section>
    );

}


function Products({myProfile, func, editMode}) {
    const [uploadedOrFavorites, setUploadedOrFavorites] = useState('uploaded');
    const [filteredProductsType, setFilteredProductsType] = useState('secondhand');
    const [products, setProducts] = useState([]);
    const [favorites,setFavorites] = useState(JSON.parse(localStorage.getItem('favoritesObjects')));
    const [showedProducts, setShowedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        uploadMyProducts();
    },[])

    useEffect(() => {
        console.log(uploadedOrFavorites)
        if(uploadedOrFavorites==="uploaded"){
            setShowedProducts(products);
        }
        else{
            setShowedProducts(favorites);
        }
    }, [uploadedOrFavorites,loading,favorites]);

    const uploadMyProducts = async () => {

        try{
            setLoading(true);
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/user/product/');
            console.log("my products ",data);
            console.log("favorites", JSON.parse(localStorage.getItem('favoritesObjects')));
            setProducts(data.results);
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

    const sendProductDetailPage = (index,pageType) => {
        navigate('/product_detail/' + pageType + '/' + index);
    }

    const deleteProduct = async (product) => {
        setLoading(true);
        let confirmed;
        if (window.confirm("Do you confirm deleting the product?")) {
            confirmed = true;
        } else {
            confirmed = false;
        }

        if(confirmed){
            try{
                // do update operations
                await axios.delete('http://127.0.0.1:8000/api/product/' +  product.category + '/' + product.id);
                uploadMyProducts();
            }
            catch (error){
            }
        }

    };

    const deleteFav = async (product) => {
        console.log("removed");
        const {data} = await axios.post('http://127.0.0.1:8000/api/product/remove-favorites/', {product_id: product.id}) ;
        console.log(data)
        setFavorites((current) =>
            current.filter((favorite) => favorite.id !== product.id)
        );
        localStorage.setItem('favoritesObjects', JSON.stringify(favorites));
    };


    return (
        <div className="col-xxl-6 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center justify-content-sm-center align-items-sm-center align-items-md-center align-items-lg-center"
            data-aos="fade-right" data-aos-duration="600" style={{height: '40vw', width: '600px', minHeight: '380px', maxWidth:'93vw', paddingTop:'10px'}}>
            <div className="d-flex d-xxl-flex flex-column align-items-center  " style={{background: '#ffffff', fontSize: '12px', borderRadius: '10px', width: '95%', minWidth:'90%', padding: '5%', height: '100%',}} data-bs-smooth-scroll="true">


                <div className="input-group text-center d-flex d-xl-flex flex-row justify-content-lg-center justify-content-xl-center "
                     style={{width: '100%', borderStyle: 'none', borderBottomStyle: 'none', height: '40px', marginBottom: '0px',}}>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        onClick={(event) => setFilteredProductsType("secondhand")}
                        id="secondhand" style={{background: filteredProductsType==="secondhand"? '#2d3648' : '#717d96' , color: '#ffffff', width: '20%', fontFamily: 'Inter, sans-serif', fontSize: 'inherit', fontWeight: filteredProductsType==="secondhand"? 'bold':''}}>Second Hand
                    </button>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text" id="borrow"
                        onClick={(event) => setFilteredProductsType("borrow")}
                        style={{background: filteredProductsType==="borrow"? '#2d3648' : '#717d96' , color: '#ffffff', fontSize: 'inherit', fontFamily: 'Inter, sans-serif', fontWeight: filteredProductsType==="borrow"? 'bold':''}}>Borrow
                    </button>
                    <button className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                            onClick={(event) => setFilteredProductsType("donation")}
                            id="donation" style={{background: filteredProductsType==="donation"? '#2d3648' : '#717d96' , width: '20%', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 'inherit',fontWeight: filteredProductsType==="donation"? 'bold':''}}>Donation
                    </button>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        onClick={(event) => setFilteredProductsType("lostandfound")}
                        id="l&f" style={{background: filteredProductsType==="lostandfound"? '#2d3648' : '#717d96' , width: '20%', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 'inherit',fontWeight: filteredProductsType==="lostandfound"? 'bold':''}}>Lost & Found
                    </button>
                    <button className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                            onClick={(event) => setFilteredProductsType("complaints")}
                            id="complaint" style={{background: filteredProductsType==="complaints"? '#2d3648' : '#717d96' , width: '20%', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 'inherit',fontWeight: filteredProductsType==="complaints"? 'bold':''}}>Complaints
                    </button>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '90%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />

                    <div className="input-group text-center d-flex flex-row "  style={{width: '91%', borderStyle: 'none', borderBottomStyle: 'none', height: '40px', marginBottom: '10px',}}>
                        <ul className="nav nav-pills d-flex justify-content-between w-100">
                            <li className="nav-item" style={{width: '48%'}}>
                                <a className="nav-link active" aria-current="page"
                                   onClick={(event) => setUploadedOrFavorites("uploaded")}
                                   style={{background: uploadedOrFavorites==="uploaded"? '#2d3648' : '#717d96' , color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 'inherit',fontWeight: uploadedOrFavorites==="uploaded"? 'bold':''}}>Uploaded</a>

                            </li>
                            {filteredProductsType!=="lostandfound" &&
                                <li className="nav-item " style={{width: '48%'}}>
                                    <a className="nav-link " tabIndex="-1" aria-disabled="true"
                                       onClick={(event) => setUploadedOrFavorites("favorites")}
                                       style={{background: uploadedOrFavorites==="favorites"? '#2d3648' : '#717d96', color: '#ffffff', fontFamily: 'Inter, sans-serif', fontSize: 'inherit',fontWeight: uploadedOrFavorites==="favorites"? 'bold':''}}>{filteredProductsType==="complaints"?"Voted" : "Favourites"}</a>

                                </li>
                            }
                        </ul>
                    </div>

                <div
                    className="card-group d-flex flex-row justify-content-start "
                    style={{ maxHeight: '80%', overflow: 'auto', width:'93%'}}>
                    {loading ? <div style={{width:'100%'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                    :
                        <>

                            {showedProducts && Array(showedProducts.length).fill().map((_, index) => {
                                if (showedProducts[index] && showedProducts[index].category === filteredProductsType) {
                                    return(
                                        <div className="card d-flex align-items-end" key={index} id="product" style={{width: '170px', height: '170px', borderRadius: '10px', borderStyle: 'none', borderBottomStyle: 'none', padding: '5px',maxHeight:'170px',minHeight:'170px' ,minWidth: '170px', maxWidth: '170px',}}>
                                            {editMode &&
                                                <button
                                                    className="btn btn-primary position-relative d-flex align-items-center justify-content-center rounded-circle"
                                                    type="button"
                                                    onClick={()=>{{uploadedOrFavorites==="uploaded" ? deleteProduct(showedProducts[index]) : deleteFav(showedProducts[index])}    }}
                                                    style={{height: '30px', width: '30px', marginBottom: '-30px', marginLeft:'5%', position: 'relative', background: '#2d3648', borderStyle: 'none',}}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            }
                                            <div className="card-body" style={{ width: '100%', height: '100%', padding: '3px' }}
                                                 onClick={()=>sendProductDetailPage(showedProducts[index].id,showedProducts[index].category)}>
                                                <img style={{ width: '100%', height: '100%', borderRadius:'10px' }} src={showedProducts[index].images && showedProducts[index].images.length > 0 ? showedProducts[index].images[0].image : Placeholder} alt={`Product ${index}`}/>
                                                <div style={{height: '40px', width: '100%', marginTop: '-40px', background: '#21252955', position: 'relative', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px', paddingTop: '3px', paddingBottom: '3px', paddingRight: '5px', paddingLeft: '5px'}}>
                                                    <h1 className="text-center d-flex justify-content-start align-items-start text-truncate"
                                                        style={{width: '100%', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '0px',color:'white'}}>{showedProducts[index].title}</h1>
                                                    <h1 className="text-center d-flex d-xxl-flex justify-content-start justify-content-xxl-start text-truncate"
                                                        style={{width: '100%', fontSize: '10px', fontFamily: 'Inter, sans-serif', marginBottom: '0px',color:'white'}}>{showedProducts[index].price + "₺"}</h1>
                                                </div>

                                            </div>
                                        </div>)
                                }
                            })}
                        </>

                    }
                    {/** this is for testing purposes normally we should use result.map(product => (<div> ...) where result is the result of the http
                 * request and we should use product's data in ... part
                */}

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
    console.log(myProfile);
    const {isProfileChanged, changeProfile} = useContext(ContextApi);

    const [loading, setLoading] = useState(false);
    const [nameSurname, setNameSurname] = useState(myProfile.name + " " + myProfile.surname);
    const [email, setEmail] = useState(myProfile.email);
    const [phone, setPhone] = useState(myProfile.phone_number);
    const [description, setDescription] = useState(myProfile.description);
    const [newName, setNewName] = useState(myProfile.name);
    const [newSurname, setNewSurname] = useState(myProfile.surname);
    const [newPhone, setNewPhone] = useState(myProfile.phone_number);
    const [newDescription, setNewDescription] = useState(myProfile.description);
    const [newPassword, setNewPassword] = useState();
    const [newPasswordConfirm, setNewPasswordConfirm] = useState();
    const [oldPassword, setOldPassword] = useState();
    const [chosenImg, setChosenImg] = useState();
    const [profileImg, setProfileImg] = useState(myProfile.profile_photo);



    const [editMode, setEditMode] = useState(false);
    const updateUser = async (user) => {
        setLoading(true);
        try{
            // do update operations
            const {data} = await axios.patch('http://127.0.0.1:8000/api/user/me/', user, { headers: { 'Content-Type': 'multipart/form-data' } });
            localStorage.setItem('myProfile', JSON.stringify(data));
            console.log(data);
            myProfile = data;
            setNameSurname(data.name + " " + data.surname)
            setEmail(data.email);
            setPhone(data.phone_number);
            setDescription(data.description);
            setEditMode(false);
            func(false);
            setLoading(false);
            setProfileImg(data.profile_photo);
            changeProfile(true);
        }
        catch (error){
            console.log(error);
            console.log(error.response.data.error);
            window.alert(error.response.data.error)
            setLoading(false);
        }
    }


    const handleClick = () => {
        setNewPasswordConfirm("");
        setNewPassword("");
        setOldPassword("");
        let user = new FormData();

        if(editMode){
            if(oldPassword) {
                if(newPassword && newPasswordConfirm){
                    if (newPassword === newPasswordConfirm) {
                        
                        if(profileImg) {
                            user = {...user, profile_photo: profileImg};
                            console.log(user);
                        }
                        user.append('name', newName);
                        user.append('surname', newSurname);
                        user.append("old_password", oldPassword);
                        user.append("new_password", newPassword);
                        if(chosenImg) {
                            user.append("profile_photo", chosenImg, chosenImg.name);
                        }
                        console.log("in change password");
                        console.log(user);
                        updateUser(user);
                    } else {
                        window.alert("Passwords are not same!")
                    }
                }
                else{
                    window.alert("You need to enter new passwords!")
                }

            }
            else if(newPassword || newPasswordConfirm ){
                window.alert("You need to enter old password")
            }
            else if(chosenImg) {
                    user.append("profile_photo", chosenImg, chosenImg.name);
                    user.append("name", newName);
                    user.append("surname", newSurname);
                    console.log("changing the profile photo");
                    console.log(...user);
                    updateUser(user);  
            }
            else{
                user.append("name", newName);
                user.append("surname", newSurname);
                user.append("phone_number", newPhone);
                user.append("description", newDescription);
                updateUser(user);

            }
        }
        else{
            setEditMode(true);
            func(true);
        }
    };

    const cancelUpdate =  () => {
        if(editMode){
            setEditMode(false);
            func(false);
            setChosenImg(null);
        }

    };

    const deleteUser = async () => {
        let confirmed;
        if (window.confirm("Do you confirm deleting the user?")) {
            confirmed = true;
        } else {
            confirmed = false;
        }

        if(confirmed){
            try{
                // do update operations
                await axios.delete('http://127.0.0.1:8000/api/user/me/');
                logOut();

            }
            catch (error){
                setLoading(false);
            }
        }
    };



    const logOut = () => {
        localStorage.clear();
        navigate("/login");

    };

    return (
        <div
            className=" d-flex  flex-grow-1 justify-content-center align-items-center order-last"  data-aos="fade-left" data-aos-duration="600" style={{width: '600px', height: '40vw', minHeight: '554px', maxWidth:'93vw', paddingTop:'10px',}}>
            <div
                className="d-flex d-xxl-flex flex-column justify-content-xxl-center align-items-xxl-center"
                style={{background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%', padding: '5%', paddingTop: '2%',}}>
                <div className="d-flex justify-content-end" style={{height: '45px', width: '100%', marginRight:'-35px'}}>
                    <button
                        className="btn btn-primary  d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center"
                        type="button"
                        onClick={logOut}
                        style={{
                            width: '40px',
                            background: '#2d3648',
                            borderStyle: 'none',
                            height: '90%',
                            minWidth: '40px',
                            padding: '0px'
                        }}>

                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>

                <div className="d-flex d-xxl-flex flex-column justify-content-center align-items-center align-items-xxl-center" style={{ height: 'initial', width: '100%' }}>
                    <img className="rounded-circle" src={editMode && chosenImg ? URL.createObjectURL(chosenImg):profileImg} style={{ height: '150px', width: '150px', marginBottom: '15px' }} alt="User Profile" />
                    {editMode ? <input type='file' style={{paddingBottom: "3px", marginLeft:"30%"}} accept='image/*' onChange={(e) => {setChosenImg(e.target.files[0]);console.log(e.target.files);}}></input> :<></>}
                    {editMode
                        ?
                        <div className="d-flex flex-row justify-content-center" style={{width:'100%', padding:'0px', height:'37px'}}>
                            <input className="form-control mb-3" value={newName} onChange={e=>setNewName(e.target.value)} type="text" name="name" placeholder="Name" style={inputStyles} required />
                            <input className="form-control mb-3" value={newSurname} onChange={e=>setNewSurname(e.target.value)} type="text" name="surname" placeholder="Surname" style={inputStyles} required />
                        </div>
                        :
                        <h1 className="text-center" style={{ width: '100%',  fontSize: '258%', fontFamily: 'Inter, sans-serif', marginBottom: '5px', fontWeight: 'bold' }}>
                            {nameSurname}
                        </h1>
                    }

                    {editMode &&
                        <div className="d-flex flex-row justify-content-center" style={{width:'100%', paddingTop:'5px', height:'37px'}}>
                            <input className="form-control mb-3" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} type="password" name="old_password" placeholder="Old Password" style={inputStyles} required />
                            <input className="form-control mb-3" value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="password" name="new_password" placeholder="New Password" style={inputStyles} required />
                            <input className="form-control mb-3" value={newPasswordConfirm} onChange={e=>setNewPasswordConfirm(e.target.value)} type="password" name="new_password" placeholder="Confirm New Password" style={inputStyles} required />
                        </div>

                    }
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex flex-row justify-content-between  " style={{ height: 'initial', width: '100%', padding: '2%' }}>
                    {editMode
                        ?
                        <div className="d-flex flex-row " style={{width:'50%', padding:'0px', height:'37px'}}>
                            <input className="form-control mb-3" value={newPhone} onChange={e=>setNewPhone(e.target.value)} type="text" name="surname" placeholder="Phone" style={inputStyles} required />
                        </div>
                        :
                        <p style={{ marginBottom: '0px', fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>{phone}</p>
                    }
                    <p style={{ marginBottom: '0px', fontFamily: 'Inter, sans-serif', fontSize: '17px' }}>{email}</p>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex flex-column justify-content-between align-items-center align-content-around align-items-xxl-start" style={{ height: '30%', width: '100%', minHeight: '100px', background: '#edf0f7', borderRadius: '10px', maxHeight: '200px' }}>
                    <div className="d-flex flex-column justify-content-between align-items-start align-content-around" style={{ height: '30%', width: '100%', minHeight: '40px', margin:'0px' }}>
                        <h1 style={{fontSize: '1.6em', fontFamily: 'Inter, sans-serif', marginTop: '10px', marginLeft:'10px', justifyContent:'start' }}>About</h1>

                        {editMode
                            ?
                            <div className="d-flex flex-row w-100 " style={{width:'100%'}}>
                                <textarea className="form-control" value={newDescription} onChange={e=>setNewDescription(e.target.value)} type="text" name="surname" placeholder="Description" required
                                    style={{margin:'0px', width:'100%', resize:'none', fontSize: '13px', background: '#edf0f7'}}
                                />
                            </div>

                            :
                            <p style={{  marginLeft:'10px', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>{description}</p>
                        }

                    </div>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex justify-content-between align-items-center align-content-around flex-nowrap" style={{ height: '10%', width: '100%', minHeight: '40px', maxHeight: '50px' }}>
                    <div className="d-flex flex-row justify-content-between align-items-center" style={{ height: '100%', width: '290px', minWidth: '100px' }}>
                        {myProfile ?
                            (<>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Messages</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chat-square-fill" style={{ fontSize: '16px' }}>
                                        <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                                    </svg>
                                </button>

                            </>) :
                            (<>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Send Message</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chat-square-fill" style={{ fontSize: '16px' }}>
                                        <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                                    </svg>
                                </button>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Rate</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-hand-thumbs-up-fill" style={{ fontSize: '16px' }}>
                                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"></path>

                                    </svg>
                                </button>
                            </>)
                        }
                    </div>
                    {myProfile ? (<div className="d-flex flex-row justify-content-around align-items-center" style={{ height: '100%', minWidth: '135px' }}>
                        <button
                            className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center"
                            type="button"
                            style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}
                            onClick={deleteUser}
                        >

                            <i className="bi bi-trash"></i>
                        </button>
                        <button
                            className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center"
                            type="button"
                            style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}
                            onClick={cancelUpdate}
                        >
                            {editMode ?  loading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : <i className="bi bi-x-lg"></i>: <i className="bi bi-gear"></i>}

                        </button>

                        <button
                            className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center"
                            type="button"
                            style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}
                            onClick={handleClick}
                        >
                            {editMode ? loading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : < i className = "bi bi-check-lg" > </i> : <i className="bi bi-pencil-square"></i> }
                        </button>

                        {/*<OverlayTrigger
                            placement="bottom"
                            trigger="click"
                            overlay={(
                                <Popover id="popover-positioned-top" title="Popover top">
                                    <strong>Holy guacamole!</strong> Check this info.
                                </Popover>
                            )}>
                            <Button variant="success">
                                Open Popover
                            </Button>
                        </OverlayTrigger>*/}


                    </div>) : (<></>)}
                </div>
            </div>
        </div>
    );


}

const inputStyles = {
    background: '#a0abc0',
    height: '100%',
    border: 'none',
    width:'150px',
    marginRight: '10px',
    marginLeft: '10px',
    paddingBottom: '5px',
    fontFamily: 'Inter, sans-serif'
};


export default Profile;