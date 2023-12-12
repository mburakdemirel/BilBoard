import React from "react";


const context = React.createContext({isImageViewerOpen:null, changeIsImageViewerOpen:(isImageViewerOpen)=>{}, newMessage:null, sendNewMessage:(Message)=>{},
                                                                productCategory:null, changeCategory:(category)=>{},isProfileChanged:false, changeProfile:(isChanged)=>{} });

export default context;