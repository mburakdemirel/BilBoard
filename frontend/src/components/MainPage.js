import React, {useEffect, useState} from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import ProductMainPage from "./ProductMainPage";
import LostFoundPage from "./LostFoundPage";
import axios from "axios";
import ComplaintPage from "./ComplaintPage";
import FilterBar from "./FilterBar";
function MainPage(){
    const {pageType} = useParams();

    if(pageType==="secondhand" || pageType==="borrow" ||  pageType==="donation" ){
        return (<><FilterBar></FilterBar><ProductMainPage></ProductMainPage></>);
    }
    else if(pageType==="complaint"){
        return (<LostFoundPage></LostFoundPage>);
    }
    else if(pageType==="lost&found"){
        return (<ComplaintPage></ComplaintPage>);
    }

}

export default MainPage;