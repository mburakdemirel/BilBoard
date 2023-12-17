import { Form, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../ChooseFileInput.css"
import AOS from "aos";

const text_field_background = "#d9e9fa";

export function ProductAddForm({changeMode}) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState();
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("donation");
    const [photo, setPhoto] = useState([]);
    const [returnDate, setReturnDate] = useState();
    const [errMsg, setErrMsg] = useState("");
    const [count, setCount] = useState(0);
    const {id} = useParams();
    const [type, setType] = useState("book");
    const [prodImg, setProdImg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [discardedImgs, setDiscardedImgs] = useState([]);
    const [loadingMsg, setLoadingMsg] = useState("");
    const baseurl = 'http://127.0.0.1:8000';

    useEffect(() => {
        AOS.init();
        //setPrice(0);
    }, [category]);

    useEffect(() => {
        if(changeMode) {
            setLoading(true);
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            axios.get(`${baseurl}/api/user/product/${id}/`)
            .then((response) => {
                setTitle(response.data.title);
                setCategory(response.data.category);
                setDescription(response.data.description);
                setProdImg(response.data.images);
                setCount(response.data.images.length);
                setType(response.data.product_type);
                setErrMsg("");
                if(response.data.return_date) {
                    setReturnDate(response.data.return_date);
                }
                if(response.data.price) {
                    setPrice(response.data.price);
                }
                setPhoto([]);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            })
        }
        else {
            setTitle("");
            setCategory("donation");
            setDescription("");
            setPhoto([]);
            setProdImg([]);
            setReturnDate("");
            setType("book");
            setPrice();
            setErrMsg("");
            setCount(0);
        }
    },[changeMode]);

    function handleImage(e) {
        setErrMsg("");
        if (e.target.files.length > 5 || count > 5 || e.target.files.length + count > 5) {
            setErrMsg("You cannot upload more than 5 images.");
            return;
        }
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                setCount(prevCount => prevCount + 1);
                setPhoto(prevFiles => [...prevFiles, file]);
            }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let product = new FormData();
        //common data areas
        product.append('title', title);
        product.append('category', category);
        product.append('description', description);
        product.append("product_type", type);
        if (category === "secondhand") {
            product.append('price', price);
            //console.log({ title: title, category: category, description: description, price: price, product_photo: photo });
        }
        else if (category === "borrow") {
            let date_str = formatDate(new Date(returnDate));
            product.append('return_date', date_str);
            console.log(date_str);
        }
        if (photo) {
            for (let i = 0; i < photo.length; i++) {
                const element = photo[i];
                product.append('product_photo', element, element.name);
            }
        }

        console.log(product);
        if(!changeMode) {
            try {
                setLoading(true);
                setLoadingMsg("Performing image checks...");
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
                const response = await axios.post(`${baseurl}/api/user/product/`, product, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (response.status === 200 || response.status === 201) {
                    navigate("/main_page/" + product.get('category'));
                }
            }
            catch (error) {
                if (error.status === 500) { console.log(error.response); }
                else if (error.response.status === 400) { console.log(error); 
                    setLoading(false);
                    setLoadingMsg("");
                    setErrMsg("Please fill the form with appropriate values!");
                }
            }
        }
        else {
            setLoading(true);
            setLoadingMsg("Performing image checks...");
            axios.patch(`${baseurl}/api/user/product/${id}/`, product, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
                .then((response) => {
                  console.log("patch response: ", response);
                  const deleteRequests = discardedImgs.map((img) => {
                    return axios.delete(`${baseurl}/api/product/${id}/delete-product-photo/${img.id}/`, {
                      headers: { 'Authorization': localStorage.getItem('authorization') }
                    });
                  });
                  return Promise.all(deleteRequests);
                })
                .then((deleteResponses) => {
                  deleteResponses.forEach((deleteResponse) => {
                    console.log("delete response: ", deleteResponse);
                  });
                  navigate(`/product_detail/${category}/${id}`);
                })
                .catch((error) => {
                  console.log(error);
                  if (error.response && error.response.status === 400) {
                    setLoading(false);
                    setLoadingMsg("");
                    setErrMsg("Please fill the form with appropriate values!");
                  }
                });
              
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, 0);
        const day = String(date.getDate()).padStart(2, 0);
        return `${year}-${month}-${day}`;
    }

    function discardSelectedImg(e,index) {
        e.preventDefault();
        let arr = [];
        for (let i = 0; i < photo.length; i++) {
            if(i !== index) {
                arr = [...arr, photo[i]];
            }
            
        }
        setCount(arr.length);
        setPhoto(arr);
    }

    function removeImg(e, index) {
        let stay = [];
        let discard = [];
        for (let i = 0; i < prodImg.length; i++) {
            if(i === index) {
                discard = [...discardedImgs, prodImg[i]];
            }
            else {
                stay = [...stay, prodImg[i]];
            }
        }
        setDiscardedImgs(discard);
        setProdImg(stay);
        setCount(stay.length);
    }

    return (
        <section id="section" className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5" style={{ background: '#edf0f7', display: 'inline-block' }}>
            
            <div className="container-fluid px-1 py-5 mx-auto">
            
                <div className="row d-flex justify-content-center" style={{ height: 'fit-content', margin: '0px', width: '100%', marginTop: '-21px' }}>
                    <div
                        className="col-xl-7 col-lg-8 col-md-9 col-11 text-center"
                        data-aos="fade-left"
                        data-aos-duration="600"
                        style={{  height: 'fit-content', minHeight: '450px', minWidth: "60%" }}
                    >
                        <div id="formCard"
                            className="card"
                            style={{
                                overflow: 'auto',
                                background: '#ffffff',
                                fontSize: '12px',
                                borderRadius: '10px',
                                height: 'fit-content',
                                width: '100%',
                                padding: '7%',
                            }}
                        >
                            {loading ? (<div style={{height:'50px'}}><span className="spinner-border spinner-border" aria-hidden="true" ></span></div> ):
                            <div >
                            <h3 className="text-center" style={{ fontFamily: 'Inter,sans-serif' }}>{!changeMode ? "Add a New Product":"Update Product"}</h3>
                            {errMsg && <div className="alert alert-danger" role="alert">{errMsg}</div>}
                            <form onSubmit={handleSubmit} method="post" className="form-card" style={{ height: 'fit-content', margin: 'auto', width: '60%' }}>
                                <div className="form-group col-xl-6 flex-column d-flex" style={{ width: '100%', paddingTop: '30px' }}>
                                    <div className="row justify-content-between text-left">
                                    <label className="form-control-label" style={{ textAlign: 'left',fontFamily: 'Inter, sans-serif' }}><h5>Title<small style={{color:'darkred', fontSize:'15px'}}> *</small></h5></label>
                                        <input value={title} onChange={(e) => { setTitle(e.target.value); }} required type="text" placeholder="Title"
                                            className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '10px',
                                                height: '100%',
                                                background: text_field_background,
                                                borderRadius: '10px',
                                                paddingLeft: '15px',
                                            }}
                                        >
                                        </input>
                                    </div>
                                    {!changeMode ? <div className="row justify-content-between text-left">
                                        <label className="form-control-label" htmlFor='postTypeSelect'style={{ textAlign: 'left' ,fontFamily: 'Inter, sans-serif'}}><h5>Select a Product Type<small style={{color:'darkred', fontSize:'15px'}}> *</small></h5></label>
                                        <select required value={category} onChange={(e) => { setCategory(e.target.value); console.log(category) }} className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '15px',
                                                height: '100%',
                                                background: text_field_background,
                                                borderRadius: '10px',
                                                paddingLeft: '15px',

                                            }}
                                        >
                                            <option value={"donation"}>Donation</option>
                                            <option value={"borrow"}>Borrow</option>
                                            <option value={"secondhand"}>Secondhand Product</option>

                                        </select>
                                    </div> : <></>}

                                    <div className="row justify-content-between text-left">
                                        <h5 style={{ textAlign: 'left' , fontFamily: 'Inter, sans-serif', }}>Photos<small style={{color:'darkred', fontSize:'15px'}}> *</small></h5>
                                        <label className="form-control-label" htmlFor="FormControl" style={{ fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>Choose files to upload (at most 5)</label>
                                        <input required={!changeMode} name="product_photos" onChange={(e) => { handleImage(e); }}
                                            id="FormControl" type="file" accept="image/*" multiple></input>
                                        <div className="d-flex flex-row justify-content-center" style={{ width:'100%', marginBottom: '20px',}}>
                                            <div className="d-flex flex-row">
                                                {photo ? photo.map((imagePreview, index) => (
                                                    <div className="d-flex flex-column align-items-center" key={index} style={{ margin: '10px', textAlign: 'left', width: '50%' }}>
                                                        <img
                                                            src={URL.createObjectURL(imagePreview)}
                                                            alt={`Preview ${index}`}
                                                            style={{ border: 'solid grey 1px', width: '100px', height: '100px', borderRadius: '5px', marginBottom: '5%' }}
                                                        />
                                                        <button onClick={(e) => discardSelectedImg(e,index)} className="btn btn-primary" type="button" style={{ marginLeft:'5px', width: '40px', fontWeight: 'bold', background: '#0558b0', borderStyle: 'none', borderColor: '#0558b0', height: '40px' }}>
                                                            <i className="bi bi-x-lg"></i>
                                                        </button>
                                                    </div>
                                                )) : <></> }
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap' , marginBottom: '20px',width:'100%'}}>
                                            {changeMode ? prodImg.map((img, index) => (
                                            <div key={index} style={{ margin: '10px', textAlign: 'left', width:'50%' }}>
                                                <img src={img.image} alt='prod_photo' style={{ border: 'solid grey 1px', maxWidth: '100px', maxHeight: '100px', borderRadius: '5px',marginRight: '4%' }}></img>
                                                <button disabled={count === 1} onClick={(e) => removeImg(e,index)} className="btn btn-primary" type="button" style={{ marginLeft:'5px', width: '40px', fontWeight: 'bold', background: '#0558b0', borderStyle: 'none', borderColor: '#0558b0', height: '30px' }}><i className="bi bi-x-lg"></i></button> 
                                            </div>
                                            )) : <></>}
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="row justify-content-between text-left">
                                        <label className="form-control-label" htmlFor="description" style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif' }}><h5>Enter Description</h5></label>
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                            id="description"
                                            placeholder="Description"
                                            rows={2}
                                            className="form-control"
                                            style={{
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '10px',
                                                background: text_field_background,
                                                borderRadius: '10px',
                                                paddingLeft: '15px',
                                                paddingTop: '15px',
                                            }}
                                        />
                                    </div>
                                    <div className="row justify-content-between text-left">
                                        <label className="form-control-label"style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif'}}><h5 style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif' }}>Choose a Product Tag<small style={{color:'darkred', fontSize:'15px'}}> *</small></h5></label>
                                        <select required value={type} onChange={(e) => { setType(e.target.value); console.log(e.target.value)}} className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '15px',
                                                height: '100%',
                                                background: text_field_background,
                                                borderRadius: '10px',
                                                paddingLeft: '15px',

                                            }}
                                        >
                                            <option value={"book"}>Book</option>
                                            <option value={"art"}>Art</option>
                                            <option value={"toys_games"}>Toys & Games</option>
                                            <option value={"electronics"}>Electronics</option>
                                            <option value={"clothing_accessories"}>Clothing & Accessories</option>
                                            <option value={"household"}>Household</option>
                                            <option value={"sports"}>Sports</option>
                                            <option value={"other"}>Other</option>
                                        </select>
                                    </div>
                                    {(category === "secondhand") ? (<div
                                        className="row justify-content-between text-left">
                                        <label className="form-control-label" style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif'}}><h5>Price<small style={{color:'darkred', fontSize:'15px'}}> *</small></h5></label>
                                        <input required={category === "secondhand"} readOnly={category !== "secondhand"} value={price} onChange={(e) => setPrice(e.target.value)} min={1} placeholder="Enter Price (in Turkish Liras)" step="0.01" max={1000000} type="number"
                                            className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '0px',
                                                height: '50%',
                                                background: text_field_background,
                                                borderRadius: '10px',
                                                paddingLeft: '15px',

                                            }}
                                        >
                                        </input>
                                    </div>) : <></>}
                                    {(category === "borrow") ? (<div className="row justify-content-between text-left">
                                        <label htmlFor="date" className="form-control-label" style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif'}}><h5>Return Date<small style={{color:'darkred', fontSize:'15px'}}> *</small></h5></label>
                                        <input value={returnDate} readOnly={category !== "borrow"} required={category === "borrow"} onChange={(e) => { setReturnDate(e.target.value); console.log(e.target.value) }} id="date" className="form-control" style={{
                                            fontFamily: 'Inter, sans-serif',
                                            background: text_field_background,
                                            borderRadius: '10px',
                                            paddingLeft: '15px',
                                            paddingTop: '15px',
                                        }} type="date">

                                        </input>
                                    </div>) : <></>}
                                    <div style={{ paddingTop: '20px' }} className="row justify-content-between text-left">
                                        <div className="col-xl-6 flex-column d-flex">
                                            <button onClick={() => { changeMode ? navigate(`/product_detail/${category}/${id}`) : navigate("/main_page/secondhand") }} className="btn btn-primary d-block w-100 mb-3" style={{ background: '#ffffff', color: '#0558b0', border: 'solid #0558b0', fontFamily: 'Inter, sans-serif', height: '40px' }}>Cancel</button>
                                        </div>
                                        <div className="col-xl-6 flex-column d-flex">
                                            <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background:'#0558b0', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>{changeMode ? "Update" : "Post"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            </div>}
                            {loadingMsg ? <h4>{loadingMsg}</h4> : <></>}
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
}