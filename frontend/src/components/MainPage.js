import React, {useEffect, useState} from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import ProductMainPage from "./ProductMainPage";
import EntryMainPage from "./EntryMainPage";
import axios from "axios";
import LostFoundPage from "./LostFoundPage";
import EntryMainPage2 from "./EntryMainPage2";
import FilterBar from "./FilterBar";
function MainPage(){
    const {pageType} = useParams();
    const [myProfile, setMyProfile] = useState(JSON.parse(localStorage.getItem('myProfile')));
    const favoritesProducts= [];
    const favoritesIdList = [];


    const getProfile = async () =>{
        if(!myProfile){
            try{
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');

                const {data} = await axios.get('http://127.0.0.1:8000/api/user/me/') ;
                console.log(data);
                localStorage.setItem('myProfile', JSON.stringify(data));
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

    }


    const getFavorites = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/user/my-favorites/') ;
            console.log("favorites from backend " , data.message);
            data.message.forEach((product) => favoritesIdList.push(product.id));
            localStorage.setItem('favoritesObjects', JSON.stringify(data.message));
            console.log(favoritesIdList);
            localStorage.setItem('favorites', JSON.stringify(favoritesIdList));


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

    useEffect(()=>{
        getProfile();
        getFavorites();
    },[])


    if(pageType==="secondhand" || pageType==="borrow" ||  pageType==="donation" ){
        return (<><FilterBar></FilterBar><ProductMainPage></ProductMainPage></>);
    }
    else if(pageType==="complaint"){
        return (<EntryMainPage></EntryMainPage>);
    }
    else if(pageType==="lost&found"){
        return (<EntryMainPage2></EntryMainPage2>);
    }

}

export default MainPage;