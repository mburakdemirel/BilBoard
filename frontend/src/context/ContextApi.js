import React from "react";


const context = React.createContext({pageType:null, changePageType:(pageType)=>{}});

export default context;