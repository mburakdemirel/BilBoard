import React, {useContext, useEffect, useState} from 'react';
import Burak from './assets/img/burak.png';
import {useNavigate, useParams} from "react-router-dom";
import './assets/bootstrap/css/bootstrap.min.css'; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import ProfilePlaceholder from "./assets/img/default_profile.webp";
import AOS from "aos";
import ContextApi from "../context/ContextApi";



function ComplaintPage(){
    const{sendNewMessage} = useContext(ContextApi);
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const {pageType} = useParams();
    const searchText = urlParams.get('search');
    const specific = urlParams.get('specific');
    const myProfile = JSON.parse(localStorage.getItem('myProfile'));
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMesagesLoading] = useState(false);
    const [page, setPage] = useState();
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(()=>{
        AOS.init();

        setProducts([]);
        setPage(1);
        // Messages in the selected index will be opened on the right side
    },[searchText,specific])

    useEffect(() => {

        if (page === 1) {
            setLoading(true);
            uploadProducts();
        }

    }, [page]);


    const uploadProducts = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            if(pageType){

                if(searchText){

                    try {
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/laf-entry/' + `?search=${searchText}`)

                        const lafEntries = data.results ? data.results : data;
                        if(lafEntries) {
                            setProducts(prevProducts => [...prevProducts, ...lafEntries]);

                            setPage(prevPage => prevPage + 1);
                            setHasMore(lafEntries.length >= 16);
                        }
                        else{
                            setHasMore(false);
                        }
                    }
                    catch (e){
                        setHasMore(false);
                    }

                }
                else if(specific){
                    try {
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/laf-entry/' + specific)
                        const lafEntries = data;

                        if(lafEntries) {
                            setProducts([lafEntries]);
                            setPage(prevPage => prevPage + 1);
                            setHasMore(false);

                        }
                        else{
                            setHasMore(false);
                        }

                    }
                    catch (e){
                        setHasMore(false);
                    }
                }

                else{
                    try {
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/laf-entry/' + `?page=${page}`);
                        const lafEntries = data.results ? data.results : data;
                        if(lafEntries) {
                            setProducts(prevProducts => [...prevProducts, ...lafEntries]);
                            setPage(prevPage => prevPage + 1);
                            setHasMore(lafEntries.length >= 16);
                        }
                        else{
                            setHasMore(false);
                        }
                    }
                    catch (e){
                        setHasMore(false);
                    }

                }
                setLoading(false);

            }

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



    const goToProfile =  (id) => {
        if(id==myProfile.id){
            navigate('/profile');
        }
        else{
            navigate('/profile/' + id);
        }
    }


    const sendMessage = async (e,item) => {
        e.preventDefault();
        setMesagesLoading(true);
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
        await axios.post("http://127.0.0.1:8000/chat/create/",
            {participiants: [item.user.id], category: item.category, product_id: item.id}).then(response => {
            const newMessage = {chat_id:response.data.id, contact_name:item.user.name, contact_surname:item.user.surname, contact_id:item.user.id};
            sendNewMessage(newMessage);
            setMesagesLoading(false);
            navigate("/messages/" + response.data.id);
        });

    }


    const deleteProduct = async (e,product) => {
        e.preventDefault();
        let confirmed;
        if (window.confirm("Do you confirm deleting the product?")) {
            confirmed = true;
        } else {
            confirmed = false;
        }

        if(confirmed){
            setLoading(true);
            try{
                await axios.delete('http://127.0.0.1:8000/api/user/laf-entry/' +  product.id + '/');
                setProducts([]);
                setPage(1);
            }
            catch (error){

            }
        }

    };

    return (
        <div  className="d-flex flex-column">

            <section className="d-flex flex-grow-1 justify-content-center align-items-start  py-5 py-x-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
                {loading ? <div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                    :
                <div className="container d-flex justify-content-center align-items-center h-100">
                    <div className="row gx-1 gy-3 h-100" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                        {products.length==0  ?
                            <span style={{ fontSize: '18px',fontWeight:'bold' ,fontFamily: 'Inter, sans-serif' }}>Entry(s) not found</span>
                            :

                            <>
                                <div className="col shadow-sm p-0 " style={{ width: '45%', margin: '1%', height:'inherit' }}  data-aos="fade-right" data-aos-duration="600">
                                    <div className="d-flex flex-column" style={{ background: 'var(--bs-white)', fontSize: '12px', borderRadius: '10px', height: '100%', width: '100%',  padding: products.filter(item =>item.category==="lost").length!== 0 ? '2%' : '0%'}} data-bs-smooth-scroll="true">
                                        <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                            {products.filter(item =>item.category==="lost").map((item,index) => (
                                                <li className="list-group-item" key={item.id} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none', margin: '1%' }} data-aos="fade-right" data-aos-duration="700">
                                                    <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0' }}>
                                                        <div className="card-body d-flex align-items-center" style={{ borderStyle: 'none', height: '11vw', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                            <div className="d-flex flex-column justify-content-between" style={{ width: '90%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                                <div>
                                                                    <div className="d-flex">
                                                                        <h1 className="d-flex text-start" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '16px', width: '80%' }}>{item.topic}</h1>
                                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '28px', width: '20%', background: '#717D96', borderRadius: '10px' }}>
                                                                            <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', color: 'rgb(255,255,255)' }}>Lost</span>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="d-flex text-truncate text-start " style={{ fontSize: '13px', marginTop: '0px', paddingTop: '5px', whiteSpace: 'normal', height: '68.5938px' }}>
                                                                        {item.description}
                                                                    </h4>
                                                                </div>
                                                                <div className="d-flex  justify-content-end align-items-center ">
                                                                    {item.user.id==myProfile.id ?
                                                                        <button disabled={loading} className="btn btn-primary align-items-center" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '100%' }}
                                                                                onClick={(e)=>deleteProduct(e,item)}>
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                        :
                                                                        <button disabled={messagesLoading} className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '36%', height: '100%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', marginRight: '1%', minWidth: '120px' }}
                                                                                onClick={(e)=>sendMessage(e,item)}>
                                                                            <i className="bi bi-send-fill" style={{ fontSize: '12px', color:'white', marginRight:'5px' }}  ></i>
                                                                            <span className="d-flex" style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }}>Send Message</span>
                                                                        </button>
                                                                    }

                                                                    {/* ...other buttons... */}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column justify-content-start align-items-center " style={{ height: '90%', margin: '1.5%', width: '30%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px' }}
                                                                 onClick={(e)=> goToProfile(item.user.id)}>
                                                                <img className="rounded-circle" src={item.user.profile_photo ? item.user.profile_photo : ProfilePlaceholder} style={{height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} alt="User" />
                                                                <h1 className="text-center d-flex justify-content-center align-items-center " style={{height:'25%', fontFamily: 'Inter, sans-serif', fontSize: '13px', width: '95%' }}>{item.user.name + " " + item.user.surname}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>


                                <div className="col shadow-sm p-0 "  style={{ width: '45%', margin: '1%' ,height:'inherit' }} data-aos="fade-left" data-aos-duration="600">
                                    <div className="d-flex flex-column" style={{ background: 'var(--bs-white)', fontSize: '12px', borderRadius: '10px', height: '100%', width: '100%',  padding: products.filter(item =>item.category==="found").length!== 0 ? '2%' : '0%' }} data-bs-smooth-scroll="true">
                                        <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                            {products.filter(item =>item.category==="found").map((item,index) => (
                                                <li className="list-group-item" key={item.id} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none', margin: '1%' }} data-aos="fade-left" data-aos-duration="700" >
                                                    <div className="card" style={{ borderStyle: 'none', background: '#d9e9fa' }}>
                                                        <div className="card-body d-flex align-items-center" style={{ borderStyle: 'none', height: '11vw', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                            <div className="d-flex flex-column justify-content-between" style={{ width: '90%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                                <div>
                                                                    <div className="d-flex">
                                                                        <h1 className="d-flex text-start" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '16px', width: '80%' }}>{item.topic}</h1>
                                                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '28px', width: '20%', background: '#0558b0', borderRadius: '10px' }}>
                                                                            <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', color: 'rgb(255,255,255)' }}>Found</span>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="d-flex text-truncate text-start " style={{ fontSize: '13px', marginTop: '0px', paddingTop: '5px', whiteSpace: 'normal', height: '68.5938px'}}>
                                                                        {item.description}
                                                                    </h4>
                                                                </div>
                                                                <div className="d-flex  justify-content-end align-items-center ">
                                                                    {item.user.id==myProfile.id ?
                                                                        <button disabled={loading} className="btn btn-primary align-items-center" type="button" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '100%' }}
                                                                                onClick={(e)=>deleteProduct(e,item)}>
                                                                            <i className="bi bi-trash"></i>
                                                                        </button>
                                                                        :
                                                                        <button disabled={messagesLoading} className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '36%', height: '100%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', marginRight: '1%', minWidth: '120px' }}
                                                                                onClick={(e)=>sendMessage(e,item)}>
                                                                            <i className="bi bi-send-fill" style={{ fontSize: '12px', color:'white', marginRight:'5px' }}  ></i>
                                                                            <span className="d-flex" style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }}>Send Message</span>
                                                                        </button>
                                                                    }

                                                                    {/* ...other buttons... */}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column justify-content-start align-items-center " style={{ height: '90%', margin: '1.5%', width: '30%', minWidth: '60px', background: '#9ebcdb', borderRadius: '10px' }}
                                                                 onClick={(e)=> goToProfile(item.user.id)}>
                                                                <img className="rounded-circle" src={item.user.profile_photo ? item.user.profile_photo : ProfilePlaceholder} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} alt="User" />
                                                                <h1 className="text-center d-flex justify-content-center align-items-center " style={{height:'25%', fontFamily: 'Inter, sans-serif', fontSize: '13px', width: '95%' }}>{item.user.name + " " + item.user.surname}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        }



                        {/* Duplicate for the second column if necessary */}
                    </div>
                </div>
                }
            </section>

        </div>
    );

};

export default ComplaintPage;