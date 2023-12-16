import React from 'react'
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
import {set} from "react-hook-form";
import AOS from "aos";
function ProductMainPage() {
    const navigate = useNavigate();

    let {pageType} = useParams();

    console.log("pageType in mainpage" + pageType);
    const [loading, setLoading] = useState(true);
    const [productCategory, setProductCategory] = useState();
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const urlParams = new URLSearchParams(window.location.search);
    console.log("query string "+urlParams);

    const searchText = urlParams.get('search');
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    const productType = urlParams.get('product_type');
    console.log(searchText, " ", minPrice, " ", maxPrice," ", productType);



    useEffect(()=>{
        AOS.init();
        console.log("In use effect" + searchText);
        setProducts([]);
        setPage(1);
        setHasMore(true);
        // Messages in the selected index will be opened on the right side
    },[pageType,searchText,minPrice,maxPrice,productType])

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
                if(searchText || minPrice!=null || maxPrice!=null || productType!=null){
                    let url = 'http://127.0.0.1:8000/api/product/' + pageType;
                    debugger;
                    if (searchText !== null && searchText !== "undefined") {
                        url += `?search=${searchText}`;
                    }

                    if (minPrice !== null && minPrice !== "undefined") {
                        url += url.includes('?') ? `&min_price=${minPrice}` : `?min_price=${minPrice}`;
                    }

                    if (maxPrice !== null && maxPrice !== "undefined") {
                        url += url.includes('?') ? `&max_price=${maxPrice}` : `?max_price=${maxPrice}`;
                    }

                    if (productType !== null && productType !== "undefined") {
                        url += url.includes('?') ? `&product_type=${productType}` : `?product_type=${productType}`;
                    }
                        try {
                            const {data} = await axios.get(url);
                            const productData = data.results ? data.results : data;
                            if(productData) {
                                setProducts(prevProducts => [...prevProducts, ...productData]);
                                setPage(prevPage => prevPage + 1);
                                setHasMore(productData.length >= 16);
                            }
                            else {
                                setHasMore(false);
                            }
                        }
                        catch (e){
                            setHasMore(false);
                        }

                }
                else{

                   try {
                       const {data} = await axios.get('http://127.0.0.1:8000/api/product/' + pageType + `?page=${page}`);
                       console.log(data);
                       const productData = data.results ? data.results : data;
                       if(productData) {
                           setProducts(prevProducts => [...prevProducts, ...productData]);
                           setPage(prevPage => prevPage + 1);
                           setHasMore(productData.length >= 16);
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
                console.log(error);
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
        <div className="d-flex flex-column">




                <section className="d-flex py-4 align-items-start justify-content-center" style={{background: '#edf0f7', minHeight: '91vh'}}  >

                    {loading ? <div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                        :
                        <InfiniteScroll style={{minHeight:'300px'}}
                            dataLength={products.length}
                            next={uploadProducts}
                            hasMore={hasMore}
                            loader={<div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>}
                            endMessage={<p></p>}
                        >

                            <div  className="container" style={{minWidth:'100vw',  paddingRight: '1%', paddingLeft: '1%' }} >
                                <div className="row d-flex justify-content-center" style={{ minHeight:'100%',  marginRight: '5%', marginLeft: '5%' }}>
                                    {Array(products.length).fill().map((_, index) => {
                                        if (true) {
                                            return(<div key={index} className="col-md-3 " style={{ minWidth:'150px', maxWidth: '18vw', padding: '1%' }}
                                                        onClick={()=>sendProductDetailPage(products[index].id)}  data-aos="zoom-in" data-aos-duration="600" >
                                                    <div  className="card shadow-sm p-0" style={{maxHeight:'35vw', height:'230px', borderRadius: '10px', borderStyle: 'none', padding: '5px', background: 'transparent', margin: '2%' }} >
                                                        <div className="card-body " style={{ borderRadius: '10px', width: '100%', height: '100%', padding: '0px' }}>
                                                            <img style={{ width: '100%', height: '100%', borderRadius:'10px'}} src={products[index].images && products[index].images.length > 0 ? products[index].images[0].image : Placeholder} width="247" height="247" />
                                                            <div className="div-special" style={{ height: '45px', width: '100%', marginTop: '-45px', background: '#21252955', position: 'relative', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px', paddingTop: '3px', paddingBottom: '3px', paddingRight: '5px', paddingLeft: '5px' }}>
                                                                <h1 className="text-center text-truncate d-flex d-xxl-flex justify-content-start align-items-start justify-content-xxl-start"
                                                                    style={{ width: '100%', fontSize: '16px', fontFamily: 'Inter, sans-serif', marginBottom: '0px', color:'#EDF0F7' }}>{products[index].title}</h1>
                                                                <h1 className="text-center text-truncate d-flex d-xxl-flex justify-content-start align-items-start justify-content-xxl-start"
                                                                    style={{ width: '100%', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginBottom: '0px', color: '#EDF0F7' }}>

                                                                    {products[index].price && products[index].price + "₺"} {products[index].return_date && products[index].return_date}</h1>
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
