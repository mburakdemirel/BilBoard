import React, {useEffect, useState} from 'react';
import Burak from './assets/img/burak.png';
import PlaceHolder from './assets/img/WF Image Placeholder.png'
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import AOS from "aos";



function EntryMainPage(){
    const {pageType,searchText} = useParams();
    const navigate = useNavigate();
    const myProfile = JSON.parse(localStorage.getItem('myProfile'));
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState();
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [upvotes,setUpvotes] = useState([]);
    const [downvotes, setDownvotes] = useState([]);
    const baseurl = 'http://127.0.0.1:8000';

    useEffect(()=>{
        AOS.init();
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

    useEffect(() => {
       console.log("getting vote data");
       axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
       axios.get(`${baseurl}/api/user/list-my-voted-complaints/`)
       .then((response) => {
        console.log("upvotes and downvotes ", response.data);
        if(response.data.upvoted_complaints) {setUpvotes(response.data.upvoted_complaints);}
        if(response.data.downvoted_complaints) {setDownvotes(response.data.downvoted_complaints);}
       })
       .catch((error) => {
        console.log("Error getting complaints: ", error);
       })
    }, [products]);

    const uploadProducts = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            if(pageType){

                if(searchText){

                    try {
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + `?search=${searchText}`)
                        console.log(data.results);
                        console.log(hasMore);
                        const entryData = data.results ? data.results : data;
                        console.log("entry data: ", entryData);
                        if(entryData) {
                            setProducts(prevProducts => [...prevProducts, ...entryData]);
                            setPage(prevPage => prevPage + 1);
                            setHasMore(entryData.length >= 16);
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
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + `?page=${page}`);
                        console.log(data);
                        console.log(data.results);
                        console.log(hasMore);
                        const entryData = data.results ? data.results : data;
                        console.log("entry data: ", entryData);
                        if(entryData) {
                            setProducts(prevProducts => [...prevProducts, ...entryData]);
                            setPage(prevPage => prevPage + 1);
                            setHasMore(entryData.length >= 16);
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
            console.log(error);
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log('No response received from the server.');
            } else {
                console.log('An error occurred while setting up the request.');
            }
        }
    }

    function containsComplaint(upvotedOrDownvoted, id) {
        if(upvotedOrDownvoted === "upvoted") {
            if(upvotes && upvotes.some(complaint => complaint.id === id)) {
                return true;
            }
            return false;
        }
        if(upvotedOrDownvoted === "downvoted") {
            if(downvotes && downvotes.some(complaint => complaint.id === id)) {
                return true;
            }
            return false;
        }
    }

    function handleUpvote(id) {
        console.log("handling upvote");
        axios.post(`${baseurl}/api/complaint/vote-up/`, {complaint_id: id})
        .then((response) => {
            console.log(response);
            setComplaintData(id);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function handleDownvote(id) {
        console.log("handling downvote");
        axios.post(`${baseurl}/api/complaint/vote-down/`, {complaint_id: id})
        .then((response) => {
            console.log(response);
            setComplaintData(id);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function setComplaintData(complaintId) {
        axios.get(`${baseurl}/api/entry/complaint-entry/${complaintId}/`)
        .then((response) => {
            console.log("complaint data: ", response.data);
            for (let i = 0; i < products.length; i++) {
                if(products[i].id === complaintId) {
                    products[i].vote = response.data.vote;
                    sortProducts();
                    break;
                }
            }
        })
        .catch((error) => {
            console.log(error.response);
        })
    }


    function sortProducts() {
        console.log("in sortProducts");
        const sortedProducts = [...products].sort((a,b) => b.vote - a.vote);
        setProducts(sortedProducts);
    }

    const goToProfile =  (id) => {
        if(id==myProfile.id){
            navigate('/profile');
        }
        else{
            navigate('/profile/' + id);
        }
    }

    return (
        <div className="d-flex flex-column">

        <section className="d-flex flex-grow-1 py-5 justify-content-center" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            {loading ? <div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>
                :
            <div className="container d-flex h-100 justify-content-center">
                <div className="row gx-1 gy-3 d-flex h-100" style={{ margin: '0px', width: '90%', marginTop: '-21px' }}>
                    <div className="col" data-aos="fade" data-aos-duration="500" >
                        <div className="d-flex flex-column col-xl-6" style={{ background: 'var(--bs-white)', borderRadius: '10px', height: '100%', width: '100%', padding: '2%' }} data-bs-smooth-scroll="true">
                                <InfiniteScroll
                                    dataLength={products.length}
                                    next={uploadProducts}
                                    hasMore={hasMore} // Replace with a condition based on your data source
                                    loader={<div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>}
                                    endMessage={<p></p>}>

                                    <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                        {Array(products.length).fill().map((_, index) => {
                                            return (
                                                <li key={index} className="list-group-item" style={{ padding: '5px', paddingBottom: '10px', borderStyle: 'none' }} data-aos="fade-left" data-aos-duration="500"  >
                                                    <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0' }}>
                                                        <div className="card-body d-flex flex-row " style={{ borderStyle: 'none', height: '9vw', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                            <div className="d-flex flex-column justify-content-between" style={{ width: '90%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                                <div>
                                                                    <div className="d-flex ">
                                                                        <h1 className="d-flex align-items-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '20px', width: '70%' }}>{products[index].topic}</h1>
                                                                        {products[index].target_mail ?  <button className="btn btn-primary d-flex justify-content-center align-items-center " type="button" style={{ width: '30%', height: '100%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px' }}>
                                                                            <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>{products[index].target_mail}</span>
                                                                        </button> : <></>}
                                                                    </div>
                                                                    <h4 className="d-flex text-truncate text-start" style={{ fontFamily: 'Inter, sans-serif',fontSize: '13px', marginTop: '0px', paddingTop: '5px', whiteSpace: 'normal', height: '68.5938px' }}>{products[index].description}<br /><br /></h4>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column" style={{ width: '6%', height: '90%', minWidth: '26px', margin: '0.7%' }}>
                                                                {/** buraları düzeltmem gerekiyor!!! */}
                                                                <button onClick={() => handleUpvote(products[index].id)} className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={containsComplaint("upvoted", products[index].id) ? clickedState : nonClickedState}>
                                                                    <i className="bi bi-arrow-up" style={{ fontSize: '24px' }}></i>
                                                                </button>
                                                                <h4 className="text-center d-flex justify-content-center align-items-center" style={{  fontSize: '18px', margin: '0px', height: '20%', color: 'white', fontFamily: 'Inter, sans-serif' }}>{products[index].vote}</h4>
                                                                <button onClick={() => handleDownvote(products[index].id)} className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={containsComplaint("downvoted", products[index].id) ? clickedState:nonClickedState}>
                                                                    <i className="bi bi-arrow-down" style={{ fontSize: '24px' }}></i>
                                                                </button>
                                                            </div>
                                                            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '90%', margin: '0.7%', width: '13%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px' }}
                                                                 onClick={(e)=> goToProfile(products[index].user.id)}>
                                                                <img className="rounded-circle" src={products[index].user.profile_photo ? products[index].user.profile_photo : PlaceHolder} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} />
                                                                <h1 className="d-flex justify-content-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', width: '95%' }}>{`${products[index].user.name} ${products[index].user.surname}`}</h1>
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

const clickedState = {
    width: '100%',
    height: '40%',
    background: '#545f75',
    borderRadius: '10px',
    borderStyle: 'none' 
}

const nonClickedState = {
    width: '100%',
    height: '40%',
    background: '#131924',
    borderRadius: '10px',
    borderStyle: 'none'
}

export default EntryMainPage;