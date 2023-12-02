import React from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import PlaceHolder from './assets/img/WF Image Placeholder.png';
import {useEffect, useState} from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import "./assets/css/hideScrollBar.css"
import axios from "axios";
import {useContext} from "react";
import ContextApi from "../context/ContextApi";
import {useNavigate, useParams} from "react-router-dom";
import productDetailPage from "./ProductDetailPage";
import Placeholder from "./assets/img/WF Image Placeholder2.png"
function ProductMainPage() {
    const navigate = useNavigate();

    const {pageType,searchText} = useParams();
    console.log("pageType in mainpage" + pageType);
    const [loading, setLoading] = useState(true);
    const [productCategory, setProductCategory] = useState();
    const [page, setPage] = useState();
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);


    useEffect(()=>{
        console.log("In use effect" + searchText);
        setProducts([]);
        setPage(1)
        // Messages in the selected index will be opened on the right side
    },[pageType,searchText])

    useEffect(() => {
        console.log("page use effect" + page);
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

                    const {data} = await axios.get('http://127.0.0.1:8000/api/product/' + pageType + `?search=${searchText}`);
                    console.log(data.results);
                    console.log(hasMore);
                    setProducts(prevProducts => [...prevProducts, ...data.results]);
                    setPage(prevPage => prevPage + 1);
                    setHasMore(data.results.length >= 16);
                }
                else{

                    const {data} = await axios.get('http://127.0.0.1:8000/api/product/' + pageType + `?page=${page}`);
                    console.log(data.results);
                    console.log(hasMore);
                    setProducts(prevProducts => [...prevProducts, ...data.results]);
                    setPage(prevPage => prevPage + 1);
                    setHasMore(data.results.length >= 16);


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


    const sendProductDetailPage = (index) => {
        navigate('/product_detail/' + pageType + '/' + index);
    }
    const changeProductType = (category) => {
       setProductCategory(category);
    }

    return (
        <div st className="d-flex flex-column">
            <section className="d-flex  justify-content-center" style={{ backgroundColor:'', width: '100%' }}>
                <div className="d-xl-flex justify-content-between " style={{ height: '100%', width: '1265px', marginTop: '5px', marginBottom: '5px' }}>
                    <div className="d-flex justify-content-center" style={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>
                        <a className="btn btn-primary fw-semibold" role="button" style={{ background:  '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '150px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }} href="index.html">Electronics</a>
                        <a className="btn btn-primary fw-semibold" role="button" style={{ background: '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }} href="index.html">Book</a>
                        <a className="btn btn-primary fw-semibold" role="button" style={{ background: '#717D96', width: 'inherit', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', marginRight: '5px', marginLeft: '5px' }} href="index.html">Household</a>
                        <a className="btn btn-primary fw-semibold" role="button" style={{ background: '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }} href="index.html">Others</a>
                    </div>
                    <div className="d-flex justify-content-center" style={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>
                        <input type="number" style={{ borderRadius: '6px', borderStyle: 'solid', borderColor: '#2d3648', textAlign: 'center', fontFamily: 'Inter, sans-serif', maxWidth: '100px' }} min="0" placeholder="Min" />
                        <hr style={{ width: '20px', background: '#2d3648', color: '#2d3648', marginRight: '5px', marginLeft: '5px' }} />
                        <input type="number" style={{ borderRadius: '6px', borderStyle: 'solid', borderColor: '#2d3648', textAlign: 'center', maxWidth: '100px' }} placeholder="Max" />
                        <a className="btn btn-primary fw-semibold" role="button" style={{ background: '#2d3648', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', marginLeft: '10px', maxWidth: '75px' }} href="index.html">Apply</a>
                    </div>
                </div>
            </section>



                <section className="d-flex py-4 align-items-start justify-content-center" style={{ background: '#edf0f7', minHeight: '91vh' }}>

                    {loading ? <div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                        :
                        <InfiniteScroll style={{minHeight:'300px'}}
                            dataLength={products.length}
                            next={uploadProducts}
                            hasMore={hasMore} // Replace with a condition based on your data source
                            loader={<div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>}
                            endMessage={<p></p>}
                        >

                            <div className="container" style={{minWidth:'100vw',  paddingRight: '1%', paddingLeft: '1%' }}>
                                <div className="row d-flex justify-content-center" style={{ minHeight:'100%',  marginRight: '5%', marginLeft: '5%' }}>
                                    {Array(products.length).fill().map((_, index) => {
                                        if (true) {
                                            return(<div className="col-md-3" style={{ minWidth:'150px', maxWidth: '18vw', padding: '1%' }}
                                                        onClick={()=>sendProductDetailPage(products[index].id)}>
                                                    <div className="card" style={{ maxHeight:'35vw', height:'230px', borderRadius: '10px', borderStyle: 'none', padding: '5px', background: 'transparent', margin: '2%' }}>
                                                        <div className="card-body" style={{ width: '100%', height: '100%', padding: '0px' }}>
                                                            <img style={{ width: '100%', height: '100%', borderRadius:'10px'}} src={products[index].product_photos && products[index].product_photos.length > 0 ? products[index].product_photos[0].product_photos : Placeholder} width="247" height="247" />
                                                            <div className="div-special" style={{ height: '45px', width: '100%', marginTop: '-45px', background: '#21252955', position: 'relative', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px', paddingTop: '3px', paddingBottom: '3px', paddingRight: '5px', paddingLeft: '5px' }}>
                                                                <h1 className="text-center d-flex d-xxl-flex justify-content-start align-items-start justify-content-xxl-start"
                                                                    style={{ width: '100%', fontSize: '16px', fontFamily: 'Inter, sans-serif', marginBottom: '0px', color:'#EDF0F7' }}>{products[index].title}</h1>
                                                                <h1 className="text-center d-flex d-xxl-flex justify-content-start align-items-start justify-content-xxl-start"
                                                                    style={{ width: '100%', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '0px', color: '#EDF0F7' }}>{products[index].price}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    })}

                                </div>
                            </div>

                        </InfiniteScroll>
                    }


                </section>





        </div>
    );
};

export default ProductMainPage;
