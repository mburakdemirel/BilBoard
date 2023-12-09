import React, {useEffect, useState} from 'react';
import Burak from './assets/img/burak.png';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';



function EntryMainPage(){
    const navigate = useNavigate();
    const imageUrl = "http://127.0.0.1:8000/media/pphotos/Activity_Diagram1.jpg";
    const {pageType,searchText} = useParams();

    const [loading, setLoading] = useState(true);
    const [productCategory, setProductCategory] = useState();
    const [page, setPage] = useState();
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(()=>{
        console.log("pageType in entry page " + pageType);

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
                    const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + `?search=${searchText}`)
                    console.log(data.results);
                    console.log(hasMore);
                    setProducts(prevProducts => [...prevProducts, ...data.results]);
                    setPage(prevPage => prevPage + 1);
                    setHasMore(data.results.length >= 16);
                }
                else{
                    const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + `?page=${page}`);
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



    return (
        <div className="d-flex flex-column">

        <section className="d-flex flex-grow-1 py-4 justify-content-center" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            {loading ? <div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                :
            <div className="container d-flex h-100">
                <div className="row gx-1 gy-3 d-flex h-100" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                    <div className="col">
                        <div className="d-flex flex-column" style={{ background: 'var(--bs-white)', borderRadius: '10px', height: '100%', width: '100%', padding: '2%' }} data-bs-smooth-scroll="true">
                                <InfiniteScroll
                                    dataLength={products.length}
                                    next={uploadProducts}
                                    hasMore={hasMore} // Replace with a condition based on your data source
                                    loader={<div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>}
                                    endMessage={<p></p>}>

                                    <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                        {Array(products.length).fill().map((_, index) => {
                                            return (
                                                <li key={index} className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                                    <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0' }}>
                                                        <div className="card-body d-flex flex-row " style={{ borderStyle: 'none', height: '11vw', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                            <div className="d-flex flex-column justify-content-between" style={{ width: '90%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                                <div>
                                                                    <div className="d-flex r">
                                                                        <h1 className="d-flex align-items-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '20px', width: '70%' }}>{products[index].topic}</h1>
                                                                        <button className="btn btn-primary d-flex justify-content-center align-items-center " type="button" style={{ width: '30%', height: '100%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px' }}>
                                                                            <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>hayrettin.arim@ug.bilkent.edu.tr</span>
                                                                        </button>
                                                                    </div>
                                                                    <h4 className="d-flex text-truncate text-start" style={{ fontFamily: 'Inter, sans-serif',fontSize: '13px', marginTop: '0px', paddingTop: '5px', whiteSpace: 'normal', height: '68.5938px' }}>{products[index].description}<br /><br /></h4>
                                                                </div>
                                                                <div className="d-flex justify-content-end ">
                                                                    <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '12%', height: '90%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '1%', minWidth: '120px' }}>
                                                                        <i className="bi bi-chat-square-text-fill" style={{ marginRight: '5px' }}></i>
                                                                        <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>249</span>
                                                                    </button>
                                                                    <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '12%', height: '90%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px', padding: '0px' }}>
                                                                        <i className="bi bi-share-fill" style={{ marginRight: '5px' }}></i>
                                                                        <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>Share</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column" style={{ width: '6%', height: '90%', minWidth: '26px', margin: '0.7%' }}>
                                                                <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '100%', height: '40%', background: '#2D3648', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px', borderStyle: 'none' }}>
                                                                    <i className="bi bi-arrow-up" style={{ fontSize: '24px' }}></i>
                                                                </button>
                                                                <h4 className="text-center d-flex justify-content-center align-items-center" style={{  fontSize: '18px', margin: '0px', height: '20%', background: '#2D3648', color: 'white', fontFamily: 'Inter, sans-serif' }}>160</h4>
                                                                <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '100%', height: '40%', background: '#2D3648', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderStyle: 'none' }}>
                                                                    <i className="bi bi-arrow-down" style={{ fontSize: '24px' }}></i>
                                                                </button>
                                                            </div>
                                                            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '90%', margin: '0.7%', width: '13%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px' }}>
                                                                <img className="rounded-circle" src={Burak} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} />
                                                                <h1 className="d-flex justify-content-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', width: '95%' }}>Burak Demirel</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>

                                            )
                                        })}


                                        </ul>
                                </InfiniteScroll>

                        </div>

                    </div>
                </div>

            </div>
            }
        </section>

        </div>
    );

};

export default EntryMainPage;