import React from 'react';
import './assets/bootstrap/css/bootstrap.min.css';
import {useParams} from "react-router-dom";
import ProductMainPage from "./ProductMainPage";
import EntryMainPage from "./EntryMainPage";


function MainPage(){
    const {pageType} = useParams();

    if(pageType==="secondhand" || pageType==="borrow" ||  pageType==="donation" ){
        return (ProductMainPage());
    }
    else if(pageType==="lost&found" || pageType==="complaint"){
        return (EntryMainPage());
    }

}

export default MainPage;