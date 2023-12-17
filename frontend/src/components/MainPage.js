import React, {useEffect, useState} from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import ProductMainPage from "./ProductMainPage";
import ComplaintPage from "./ComplaintPage";
import axios from "axios";
import LostAndFoundPage from "./LostAndFoundPage";
import FilterBar from "./FilterBar";
function MainPage(){
    const {pageType} = useParams();

    if(pageType==="secondhand" || pageType==="borrow" ||  pageType==="donation" ){
        return (<><FilterBar></FilterBar><ProductMainPage></ProductMainPage></>);
    }
    else if(pageType==="complaint"){
        return (<ComplaintPage></ComplaintPage>);
    }
    else if(pageType==="lost&found"){
        return (<LostAndFoundPage></LostAndFoundPage>);
    }

}

export default MainPage;