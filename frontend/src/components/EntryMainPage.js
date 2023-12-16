import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceHolder from './assets/img/WF Image Placeholder.png'
import { useParams} from "react-router-dom";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import AOS from "aos";
import {Collapse, Button} from 'react-bootstrap';



function EntryMainPage(){
    const urlParams = new URLSearchParams(window.location.search);
    const {pageType} = useParams();
    const searchText = urlParams.get('search');
    console.log(searchText);
    const specific = urlParams.get('specific');

    const navigate = useNavigate();
    const myProfile = JSON.parse(localStorage.getItem('myProfile'));
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState();
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [upvotes,setUpvotes] = useState([]);
    const [downvotes, setDownvotes] = useState([]);
    const [isChanged, setIsChanged] = useState(true);

    const maxComplaintLength = 330;
    const [expand, setExpand] = useState([]);
    const baseurl = 'http://127.0.0.1:8000';

    useEffect(()=>{

        AOS.init();

        setProducts([]);
        setPage(1);
        // Messages in the selected index will be opened on the right side
    },[pageType,searchText,specific])

    useEffect(() => {

        if (page === 1) {
            setLoading(true);
            uploadProducts();
        }

    }, [page]);

    useEffect(() => {

       axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
       axios.get(`${baseurl}/api/user/list-my-voted-complaints/`)
       .then((response) => {

        if(response.data.upvoted_complaints) {setUpvotes(response.data.upvoted_complaints);}
        if(response.data.downvoted_complaints) {setDownvotes(response.data.downvoted_complaints);}
       })
       .catch((error) => {

       })
    }, [isChanged]);

    const uploadProducts = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            if(pageType){

                if(searchText){

                    try {
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + `?search=${searchText}`)
                        setPage(prevPage => prevPage + 1);

                        const entryData = data.results ? data.results : data;

                        if(entryData) {
                            const newEntries = [...products, ...entryData];
                            newEntries.sort((a, b) => parseInt(b.vote, 10) - parseInt(a.vote,10));

                            setProducts(entryData);
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
                else if(specific){
                    try {
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + specific)


                        const entryData = data.results ? data.results : data;

                        if(entryData) {
                            setProducts([entryData]);
                            setExpand([false]);
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
                        const {data} = await axios.get('http://127.0.0.1:8000/api/entry/complaint-entry/' + `?page=${page}`);

                        const entryData = data.results ? data.results : data;

                        if(entryData) {
                            const newEntries = [...products, ...entryData];
                            newEntries.sort((a, b) => parseInt(b.vote, 10) - parseInt(a.vote,10));
                            if(newEntries.length > expand.length) {
                                setExpand(prev => [...prev, ...Array(entryData.length).fill(false)]);
                            }

                            setProducts(newEntries);
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

    function containsComplaint(id) {
        if(upvotes && upvotes.some(complaint => complaint.id === id)) {
            return "upvotes";
        }
        else if(downvotes && downvotes.some(complaint => complaint.id === id)) {
            return "downvotes";
        }
        return "none";
    }

    function handleUpvote(id, index) {

        axios.post(`${baseurl}/api/complaint/vote-up/`, {complaint_id: id})
        .then((response) => {

            setIsChanged(!isChanged);

            if(containsComplaint(id)==="upvotes"){
                products[index].vote= (parseInt(products[index].vote, 10) - 1).toString();
            }
            else if(containsComplaint(id)==="downvotes"){
                products[index].vote= (parseInt(products[index].vote, 10) + 2).toString();
            }
            else{
                products[index].vote= (parseInt(products[index].vote, 10) + 1).toString();
            }
            setExpand(Array(expand.length).fill(false));
            products.sort((a, b) => parseInt(b.vote, 10) - parseInt(a.vote, 10));
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function handleDownvote(id, index) {

        axios.post(`${baseurl}/api/complaint/vote-down/`, {complaint_id: id})
        .then((response) => {

            setIsChanged(!isChanged);
            if(containsComplaint(id)==="upvotes"){
                products[index].vote= (parseInt(products[index].vote, 10) - 2).toString();
            }
            else if(containsComplaint(id)==="downvotes"){
                products[index].vote= (parseInt(products[index].vote, 10) + 1).toString();
            }
            else{
                products[index].vote= (parseInt(products[index].vote, 10) - 1).toString();
            }
            setExpand(Array(expand.length).fill(false));
            products.sort((a, b) => parseInt(b.vote, 10) - parseInt(a.vote, 10));
            // squeeze all expanded complaints while sorting.
            
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    function toggleExpand(e,index) {

        let vals = [...expand];
        for (let i = 0; i < vals.length; i++) {
            const element = vals[i];
            if(i === index) {

                vals[i] = !element;

                break;
            }
        }

        setExpand(vals);
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
            <div className="container d-flex h-100 justify-content-center ">
                <div className="row gx-1 gy-3 d-flex h-100" style={{ margin: '0px', width: '75%', marginTop: '-21px' }}>

                        { products.length ==0 ?
                            <span style={{ fontSize: '18px',fontWeight:'bold' ,fontFamily: 'Inter, sans-serif' }}>Entry(s) not found</span>
                            :
                            <div className="col shadow-sm p-0 rounded" data-aos="fade" data-aos-duration="500" >
                                <div className="d-flex flex-column col-xl-6" style={{ background: 'var(--bs-white)', borderRadius: '10px', height: '100%', width: '100%', padding: '2%', display:'block', margin:'auto' }} data-bs-smooth-scroll="true">
                                    <InfiniteScroll
                                        dataLength={products.length}
                                        next={uploadProducts}
                                        hasMore={hasMore}
                                        loader={<div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div>}
                                    >

                                        <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                            {Array(products.length).fill().map((_, index) => {
                                                return (
                                                    <li key={index} className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }} data-aos="fade-left" data-aos-duration="500"  >
                                                        <div className="card" style={{ borderStyle: 'none', background: '#d9e9fa' }}>
                                                            <div className="card-body d-flex flex-row " style={{ borderStyle: 'none', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                                <div className="d-flex flex-column justify-content-between" style={{ width: '80%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                                    <div>
                                                                        <div className="d-flex justify-content-between">
                                                                            <h1 className="d-flex align-items-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '20px', width: '70%' }}>{products[index].topic}</h1>
                                                                            <a  title="Send an email to Yusuf Toraman" href={`mailto:${products[index].target_mail}?subject=BilBoard: ${products[index].topic}`} style={{textDecoration:'none'}}>
                                                                                {products[index].target_mail ?  <button className="btn btn-primary d-flex justify-content-center align-items-center " type="button" style={{ width: 'fit-content', height: '100%', fontWeight: 'bold', background: '#6cb1f5', borderStyle: 'none', marginRight: '0px', minWidth: '120px' }}>
                                                                                    <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', color:'white' }}>{products[index].target_mail}</span>
                                                                                </button> : <></>}
                                                                            </a>


                                                                        </div>
                                                                        {products[index].description.length > maxComplaintLength ?
                                                                            <div style={{height: 'fit-content', marginTop:"0.5%"}}>
                                                                                <h6 style={{ fontFamily: 'Inter, sans-serif',fontSize: '14px', marginTop: '0px', marginBlockStart: '8px', paddingTop: '5px', whiteSpace: 'normal', textAlign:'left' }} className="d-flex text-truncate text-start">{products[index].description.substring(0,maxComplaintLength)}{expand[index] ? products[index].description.substring(maxComplaintLength,products[index].description.length):"..."}</h6>
                                                                                <button style={{ width: 'fit-content', height: '30px', background: '#0558b0', borderRadius: '10px', borderStyle: 'none', fontSize:'11px', fontFamily:'Inter, sans-serif'}} className="btn btn-primary d-flex justify-content-center align-items-center" type="button"  onClick={(e) => toggleExpand(e,index)}>{(!expand[index]) ? "Read more" : "Show less"}</button>
                                                                            </div>:
                                                                            <div>
                                                                                <h6 style={{ fontFamily: 'Inter, sans-serif',fontSize: '14px', marginTop: '0px', marginBlockStart: '8px', paddingTop: '5px', whiteSpace: 'normal', textAlign:'left' }} className="d-flex text-truncate text-start">{products[index].description}</h6>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex flex-row justify-content-between align-items-center" style={{width:'20%',margin:'2px'}}>
                                                                    <div className="d-flex flex-column" style={{ width: '25%', minWidth: '26px', margin: '0.7%' }}>
                                                                        <button onClick={() => handleUpvote(products[index].id,index)} className="btn btn-primary d-flex justify-content-center align-items-center" type="button"
                                                                                style={{ width: '100%', height: '100%', background: '#0558b0', borderRadius: '10px', borderStyle: 'none', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px',  borderTopLeftRadius: '10px',  borderTopRightRadius: '10px'}}>
                                                                            {containsComplaint(products[index].id)==="upvotes" ?
                                                                                <i className="bi bi-caret-up-fill" style={{ fontSize: '24px' }}></i>
                                                                                :
                                                                                <i className="bi bi-caret-up" style={{ fontSize: '24px' }}></i>
                                                                            }
                                                                        </button>
                                                                        <div className=" d-flex justify-content-center align-items-center " style={{width: '100%', height: '33%', background: '#0558b0', borderStyle: 'none', borderRadius:'0px'}}>
                                                                            <h4 className="text-center d-flex justify-content-center align-items-center" style={{  fontSize: '18px', margin: '0px', height: '20%', color: 'white', fontFamily: 'Inter, sans-serif' }}>{products[index].vote}</h4>
                                                                        </div>
                                                                        <button onClick={() => handleDownvote(products[index].id,index)} className="btn btn-primary d-flex justify-content-center align-items-center" type="button"
                                                                                style={{ width: '100%', height: '33%', background: '#0558b0', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px',  borderTopLeftRadius: '0px',  borderTopRightRadius: '0px',  borderStyle: 'none' }}>
                                                                            {containsComplaint(products[index].id)==="downvotes" ?
                                                                                <i className="bi bi-caret-down-fill" style={{ fontSize: '24px' }}></i>
                                                                                :
                                                                                <i className="bi bi-caret-down" style={{ fontSize: '24px' }}></i>
                                                                            }
                                                                        </button>
                                                                    </div>
                                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{  margin: '0.7%', width: '65%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px'}}
                                                                         onClick={(e)=> goToProfile(products[index].user.id)}>
                                                                        <img className="rounded-circle" src={products[index].user.profile_photo ? products[index].user.profile_photo : PlaceHolder} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} />
                                                                        <h1 className="d-flex justify-content-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', width: '95%' }}>{`${products[index].user.name} ${products[index].user.surname}`}</h1>
                                                                    </div>
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

                        }





                </div>

            </div>
            }
        </section>

        </div>
    );

};

export default EntryMainPage;