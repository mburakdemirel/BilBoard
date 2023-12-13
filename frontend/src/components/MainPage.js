import React, {useEffect, useState} from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import ProductMainPage from "./ProductMainPage";
import EntryMainPage from "./EntryMainPage";
import axios from "axios";
import EntryMainPage2 from "./EntryMainPage2";
import FilterBar from "./FilterBar";
function MainPage(){
    const {pageType} = useParams();


    const favoritesIdList = [];


/*


    useEffect(()=>{
        getProfile();
    },[])*/
    //x


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