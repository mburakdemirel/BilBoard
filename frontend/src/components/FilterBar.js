import React, {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
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
import {Dropdown} from "react-bootstrap";
import {set} from "react-hook-form";

function FilterBar() {
    const navigate = useNavigate();
    let {pageType} = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const searchText = urlParams.get('search');
    const [otherCategory, setOtherCategory] = useState("Others");

    const [type, setType] = useState("");
    const [minValue, setMinValue] = useState();
    const [maxValue, setMaxValue] = useState();

    const categoryMap = {
        clothing_accessories: "Clothing & Accessories",
        toys_games: "Toys & Games",
        sports: "Sports",
        art: "Art",
        other: "Other"
    };


    useEffect(() => {
        AOS.init();
        setType("");
        setMinValue();
        setMaxValue();
    }, [pageType]);


    const applyQuery = () => {
        if(searchText){
            navigate(window.location.pathname + "?search=" + searchText  + "&&min_price=" + minValue + "&&max_price=" + maxValue + "&&product_type=" + type);
        }
        else{
            navigate(window.location.pathname + "?min_price=" + minValue + "&&max_price=" + maxValue + "&&product_type=" + type);
        }

    }

    const buttonClicked = (typeParam) => {
        if(type===typeParam){
            setType("");
            setOtherCategory("Others")
        }
        else{
            setType(typeParam);
            if(typeParam!=="electronics" && typeParam!=="book" && typeParam!=="household"){
                setOtherCategory(categoryMap[typeParam]);
            }
        }
    }

    return (<div data-aos="zoom-out" data-aos-duration="700">
            <section className="d-flex  justify-content-center" style={{ backgroundColor:'', width: '100%' }}>
                <div className="d-xl-flex justify-content-between " style={{ height: '100%', width: '1265px', marginTop: '5px', marginBottom: '5px' }}>
                    <div className="d-flex justify-content-center" style={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>
                        <a className="btn btn-primary fw-semibold" onClick={() => buttonClicked("electronics")} role="button"   style={{ background: type==="electronics" ? '#2d3648':  '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '150px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }}>Electronics</a>
                        <a className="btn btn-primary fw-semibold" onClick={() => buttonClicked("book")} role="button"  style={{ background: type==="book" ? '#2d3648':  '#717D96', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }}>Book</a>
                        <a className="btn btn-primary fw-semibold" onClick={() => buttonClicked("household")} role="button"  style={{ background: type==="household" ? '#2d3648':  '#717D96', width: 'inherit', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '140px', marginRight: '5px', marginLeft: '5px' }}>Household</a>

                        <Dropdown>
                            <Dropdown.Toggle className="d-flex align-items-center" variant="primary" id="dropdown-basic"
                                             style={{background: (type!=="electronics" && type!=="book" && type!=="household" && type!=="") ? '#2d3648' :' #717D96' , borderStyle: 'none'}}>
                                <a style={{ borderStyle: 'none', fontWeight:'bold', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', maxWidth: '160px', width: 'inherit', marginRight: '5px', marginLeft: '5px' }}>{otherCategory}</a>
                            </Dropdown.Toggle>

                            {ReactDOM.createPortal(
                            <Dropdown.Menu>
                                <Dropdown.Item  onClick={() => buttonClicked("clothing_accessories")} >Clothing & Accessories</Dropdown.Item>
                                <Dropdown.Item  onClick={() => buttonClicked("toys_games")} >Toys & Games</Dropdown.Item>
                                <Dropdown.Item  onClick={() => buttonClicked("sports")} >Sports</Dropdown.Item>
                                <Dropdown.Item  onClick={() => buttonClicked("art")} >Art</Dropdown.Item>
                                <Dropdown.Item  onClick={() => buttonClicked("other")} >Other</Dropdown.Item>
                            </Dropdown.Menu>,  document.body
                            )}
                        </Dropdown>

                    </div>
                    <div className="d-flex justify-content-center" style={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>
                        {pageType==="secondhand" && <>
                            <input type="number" style={{ borderRadius: '6px', borderStyle: 'solid', borderColor: '#2d3648', textAlign: 'center', fontFamily: 'Inter, sans-serif', maxWidth: '100px' }} min="0" max={maxValue} placeholder="Min"
                                   value={minValue} onChange={(e)=> setMinValue(e.target.value)}/>
                            <hr style={{ width: '20px', background: '#2d3648', color: '#2d3648', marginRight: '5px', marginLeft: '5px' }} />
                            <input type="number" style={{ borderRadius: '6px', borderStyle: 'solid', borderColor: '#2d3648', textAlign: 'center', maxWidth: '100px' }} min={minValue} placeholder="Max"
                                   value={maxValue} onChange={(e)=> setMaxValue(e.target.value)}/>
                        </>
                        }
                        <a className="btn btn-primary fw-semibold" role="button"  type="submit" style={{ background: '#2d3648', borderStyle: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', textAlign: 'center', marginLeft: '10px', maxWidth: '75px' }}
                            onClick={applyQuery}>Apply</a>
                    </div>
                </div>
            </section>

        </div>


    );

};



export default FilterBar;