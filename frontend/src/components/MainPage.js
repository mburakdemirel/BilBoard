import React, {useEffect, useState} from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import ProductMainPage from "./ProductMainPage";
import EntryMainPage from "./EntryMainPage";
import axios from "axios";


function MainPage(){
    const {pageType} = useParams();
    const [favorites, setFavorites] = useState([]);
    const favoritesIdList = [];
    const getFavorites = async () => {
        try{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const {data} = await axios.get('http://127.0.0.1:8000/api/user/my-favorites/') ;
            console.log(data.message);
            setFavorites(data.message);
            data.message.forEach( (product) => favoritesIdList.push(product.id));
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
        getFavorites();
    },[])


    if(pageType==="secondhand" || pageType==="borrow" ||  pageType==="donation" ){
        return (ProductMainPage());
    }
    else if(pageType==="lost&found" || pageType==="complaint"){
        return (EntryMainPage());
    }

}

export default MainPage;