import React, {useContext, useEffect, useState} from 'react';
import Logo from './assets/img/logo_bugbunny-removebg-preview.png'
import Burak from './assets/img/burak.png'
import ContextApi from "../context/ContextApi";
import {useNavigate, useParams} from "react-router-dom";
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';
import PlaceHolder from "./assets/img/WF Image Placeholder.png";
import AOS from "aos";

function FilterBar() {
    const navigate = useNavigate();
    const{productCategory,changeCategory} = useContext(ContextApi);

    const urlParams = new URLSearchParams(window.location.search);
    const [type, setType] = useState("");
    console.log("query string "+urlParams);
    const eren = urlParams.get('eren')
    console.log(eren);

    useEffect(() => {
        AOS.init();
    }, []);


    return (<div data-aos="zoom-out" data-aos-duration="700">
            <section className="d-flex  justify-content-center" style={{ backgroundColor:'', width: '100%' }}>
                <div className="d-xl-flex justify-content-between " style={{ height: '100%', width: '1265px', marginTop: '5px', marginBottom: '5px' }}>
                    <div className="d-flex justify-content-center" style={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>
                        <a className="btn btn-primary fw-semibold" onClick={() => setType()} role="button"   style={{ background:  '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '150px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }}>Electronics</a>
                        <a className="btn btn-primary fw-semibold" role="button"   style={{ background: '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }}>Book</a>
                        <a className="btn btn-primary fw-semibold" role="button"   style={{ background: '#717D96', width: 'inherit', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', marginRight: '5px', marginLeft: '5px' }}>Household</a>
                        <a className="btn btn-primary fw-semibold" role="button"   style={{ background: '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }}>Others</a>
                    </div>
                    <div className="d-flex justify-content-center" style={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>
                        <input type="number" style={{ borderRadius: '6px', borderStyle: 'solid', borderColor: '#2d3648', textAlign: 'center', fontFamily: 'Inter, sans-serif', maxWidth: '100px' }} min="0" placeholder="Min" />
                        <hr style={{ width: '20px', background: '#2d3648', color: '#2d3648', marginRight: '5px', marginLeft: '5px' }} />
                        <input type="number" style={{ borderRadius: '6px', borderStyle: 'solid', borderColor: '#2d3648', textAlign: 'center', maxWidth: '100px' }} min="0" placeholder="Max" />
                        <a className="btn btn-primary fw-semibold" role="button" style={{ background: '#2d3648', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', marginLeft: '10px', maxWidth: '75px' }} href="index.html">Apply</a>
                    </div>
                </div>
            </section>

        </div>


    );

};



export default FilterBar;