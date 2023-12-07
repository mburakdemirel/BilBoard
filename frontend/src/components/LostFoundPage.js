import React, {useEffect, useState} from 'react';
import Burak from './assets/img/burak.png';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';



function LostFoundPage(){
    const navigate = useNavigate();
    const {pageType,searchText} = useParams();

    const [loading, setLoading] = useState(true);
    const [productCategory, setProductCategory] = useState();
    const [page, setPage] = useState();
    const [products, setProducts] = useState([]);
    const [losts, setLosts] = useState([]);
    const [founds, setFounds] = useState([]);

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
                const {data} = await axios.get('http://127.0.0.1:8000/api/entry/' + 'laf-entry/' + `?page=${page}`);
                console.log(data.results);
                console.log(hasMore);
                setProducts(prevProducts => [...prevProducts, ...data.results]);
                setPage(prevPage => prevPage + 1);
                setHasMore(data.results.length >= 16);
                setLoading(false);
                setFounds(data.results.filter((product) => product.category === "found"));
                setLosts(data.results.filter((product) => product.category === "lost"));
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
        <section className="d-flex flex-grow-1 justify-content-center align-items-start  py-4 py-x-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container d-flex justify-content-center align-items-center h-100">
                <div className="row gx-1 gy-3 h-100" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>

                    <div className="col" style={{ width: '45%', margin: '1%' }}>
                        <div className="d-flex flex-column" style={{ background: 'var(--bs-white)', fontSize: '12px', borderRadius: '10px', height: '100%', width: '100%', padding: '2%' }} data-bs-smooth-scroll="true">
                            <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                {products.map((item) => (
                                    <li className="list-group-item" key={item.id} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none', margin: '1%' }}>
                                        <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0' }}>
                                            <div className="card-body d-flex align-items-center" style={{ borderStyle: 'none', height: '11vw', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                <div className="d-flex flex-column justify-content-between" style={{ width: '90%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                    <div>
                                                        <div className="d-flex">
                                                            <h1 className="d-flex text-start" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '16px', width: '80%' }}>{item.topic}</h1>
                                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '28px', width: '20%', background: '#717D96', borderRadius: '10px' }}>
                                                                <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', color: 'rgb(255,255,255)' }}>Found</span>
                                                            </div>
                                                        </div>
                                                        <h4 className="d-flex text-truncate text-start " style={{ fontSize: '13px', marginTop: '0px', paddingTop: '5px', whiteSpace: 'normal', height: '68.5938px' }}>
                                                            {item.description}
                                                        </h4>
                                                    </div>
                                                    <div className="d-flex  justify-content-end align-items-center ">
                                                        <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '36%', height: '100%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '1%', minWidth: '120px' }}>
                                                            {/* SVG icons can be used here */}
                                                            <span className="d-flex" style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }}>Send Message</span>
                                                        </button>
                                                        {/* ...other buttons... */}
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column justify-content-start align-items-center " style={{ height: '90%', margin: '0.7%', width: '30%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px' }}>
                                                    <img className="rounded-circle" src={Burak} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} alt="User" />
                                                    <h1 className="text-center d-flex justify-content-center align-items-center " style={{height:'25%', fontFamily: 'Inter, sans-serif', fontSize: '13px', width: '95%' }}>{" fedafd "}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col" style={{ width: '45%', margin: '1%' }}>
                        <div className="d-flex flex-column" style={{ background: 'var(--bs-white)', fontSize: '12px', borderRadius: '10px', height: '100%', width: '100%', padding: '2%' }} data-bs-smooth-scroll="true">
                            <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                {products.map((item) => (
                                    <li className="list-group-item" key={item.id} style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none', margin: '1%' }}>
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
                                                        <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '36%', height: '100%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '1%', minWidth: '120px' }}>
                                                            {/* SVG icons can be used here */}
                                                            <span className="d-flex" style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center' }}>Send Message</span>
                                                        </button>
                                                        {/* ...other buttons... */}
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column justify-content-start align-items-center " style={{ height: '90%', margin: '0.7%', width: '30%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px' }}>
                                                    <img className="rounded-circle" src={Burak} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} alt="User" />
                                                    <h1 className="text-center d-flex justify-content-center align-items-center " style={{height:'25%', fontFamily: 'Inter, sans-serif', fontSize: '13px', width: '95%' }}>{" fedafd "}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Duplicate for the second column if necessary */}
                </div>
            </div>
        </section>
    );

};





export default LostFoundPage;