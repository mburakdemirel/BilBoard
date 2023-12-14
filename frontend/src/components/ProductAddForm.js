import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../ChooseFileInput.css"
import AOS from "aos";

const text_field_background = "#d9e9fa";

export function ProductAddForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("donation");
    const [photo, setPhoto] = useState([]);
    const [returnDate, setReturnDate] = useState();
    const [errMsg, setErrMsg] = useState("");
    const [count, setCount] = useState(0);

    useEffect(() => {
        AOS.init();
        setPrice(0);
    }, [category]);



    function handleImage(e) {
        console.log(count);
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
        console.log(photo);

    }

    //after submitting the form clean each form area values.
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(category);
        let product = new FormData();
        //common data areas
        product.append('title', title);
        product.append('category', category);
        product.append('description', description);
        console.log(product.keys());
        if (category === "secondhand") {
            console.log("In secondhand");
            product.append('price', price);
            console.log({ title: title, category: category, description: description, price: price, product_photo: photo });
        }
        else if (category === "borrow") {
            console.log("in borrow");
            let date_str = formatDate(new Date(returnDate));
            product.append('return_date', date_str);
            console.log(date_str);
        }
        if (photo) {
            console.log("trying to post a photo");
            for (let i = 0; i < photo.length; i++) {
                const element = photo[i];
                product.append('product_photo', element, element.name);
            }
            console.log(product.get('product_photo'));
        }
        console.log(product);
        try {
            axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
            const response = await axios.post('http://127.0.0.1:8000/api/user/product/', product, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (response.status === 200 || response.status === 201) {
                console.log("Post was successful");
                navigate("/main_page/secondhand");
            }
        }
        catch (error) {
            if (error.status === 500) { console.log(error.response); }
            else if (error.status === 400) { console.log(error.response); }
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, 0);
        const day = String(date.getDate()).padStart(2, 0);
        return `${year}-${month}-${day}`;
    }

    return (
        <section id="section" className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5" style={{ background: '#edf0f7', display: 'inline-block' }}>
            <div className="container-fluid px-1 py-5 mx-auto">
                <div className="row d-flex justify-content-center" style={{ height: 'fit-content', margin: '0px', width: '100%', marginTop: '-21px' }}>
                    <div
                        className="col-xl-7 col-lg-8 col-md-9 col-11 text-center"
                        data-aos="fade-left"
                        data-aos-duration="600"
                        style={{ width: 'fit-content', height: 'fit-content', minHeight: '450px', minWidth: "60%" }}
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
                            <h3 className="text-center" style={{ fontFamily: 'Inter,sans-serif' }}>Add a New Product</h3>
                            {errMsg && <div className="alert alert-danger" role="alert">{errMsg}</div>}
                            <form onSubmit={handleSubmit} method="post" className="form-card" style={{ height: 'fit-content', margin: 'auto', width: '60%' }}>
                                <div className="form-group col-xl-6 flex-column d-flex" style={{ width: '100%', paddingTop: '30px' }}>
                                    <div className="row justify-content-between text-left">
                                    <label className="form-control-label" style={{ textAlign: 'left',fontFamily: 'Inter, sans-serif' }}><h5>Title</h5></label>
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
                                    <div
                                        className="row justify-content-between text-left">
                                        <label required className="form-control-label" htmlFor='postTypeSelect'style={{ textAlign: 'left' ,fontFamily: 'Inter, sans-serif'}}><h5>Select a Product Type</h5></label>
                                        <select value={category} onChange={(e) => { setCategory(e.target.value); console.log(category) }} className="form-control"
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
                                    </div>

                                    <div className="row justify-content-between text-left">
                                        <h5 style={{ textAlign: 'left' , fontFamily: 'Inter, sans-serif', }}>Photos</h5>
                                        <label className="form-control-label" htmlFor="FormControl" style={{ fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>Choose files to upload (at most 5)</label>
                                        <input required name="product_photos" onChange={(e) => { handleImage(e); }}
                                            id="FormControl" type="file" accept="image/*" multiple></input>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' , marginBottom: '20px',}}>
                                            {photo.map((imagePreview, index) => (
                                                <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
                                                    <img
                                                        src={URL.createObjectURL(imagePreview)}
                                                        alt={`Preview ${index}`}
                                                        style={{ border: 'solid grey 1px', maxWidth: '100px', maxHeight: '100px', borderRadius: '5px' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="row justify-content-between text-left">
                                        <label className="form-control-label" htmlFor="description" style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif' }}><h5>Enter your Description</h5></label>
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
                                    {(category === "secondhand") ? (<div
                                        className="row justify-content-between text-left">
                                        <label className="form-control-label"style={{ textAlign : 'left',fontFamily: 'Inter, sans-serif'}}><h5>Price</h5></label>
                                        <input required={category === "secondhand"} readOnly={category !== "secondhand"} value={price} onChange={(e) => setPrice(e.target.value)} min={0} placeholder="Enter Price (in Turkish Liras)" type="number"
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
                                        <label htmlFor="date" className="form-control-label"><h5>Return Date</h5></label>
                                        <input readOnly={category !== "borrow"} required={category === "borrow"} onChange={(e) => { setReturnDate(e.target.value); console.log(e.target.value) }} id="date" className="form-control" style={{
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
                                            <button onClick={() => { navigate("/main_page/secondhand") }} className="btn btn-primary d-block w-100 mb-3" style={{ background: '#ffffff', color: '#0558b0', border: 'solid #0558b0', fontFamily: 'Inter, sans-serif', height: '40px' }}>Cancel</button>
                                        </div>
                                        <div className="col-xl-6 flex-column d-flex">
                                            <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background:'#0558b0', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Post</button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
}