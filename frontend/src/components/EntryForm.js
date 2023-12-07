import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export function EntryForm({ isComplaint }) {
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("lost");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("in submission");
        let entry = new FormData();
        entry.append("topic", topic);
        entry.append("description", description);
        if (!isComplaint) {
            entry.append("category", category);
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
                const response = axios.post("http://127.0.0.1:8000/api/user/laf-entry/", entry, { headers: { 'Content-Type': 'multipart/form-data' } });

                console.log("Post was successful");
                navigate("/main_page/secondhand");
            }
            catch (error) {
                console.log(error.response);
            }
        }
        else {
            try {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('authorization');
                const response = axios.post("http://127.0.0.1:8000/api/user/complaint-entry/", entry, { headers: { 'Content-Type': 'multipart/form-data' } });

                console.log("Post was successful");
                navigate("/main_page/secondhand");

            }
            catch (error) {
                console.log(error.response);
            }
        }

    }

    return (
        <section className="d-flex justify-content-center align-items-center py-4 py-xl-5" style={{ background: '#edf0f7', minHeight: '100vh' }}>
            <div className="container-fluid px-1 py-5 mx-auto" style={{ overflow: 'scroll' }}>
                <div className="row d-flex justify-content-center" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                    <div
                        className="col-xl-7 col-lg-8 col-md-9 col-11 text-center"
                        data-aos="fade-left"
                        data-aos-duration="600"
                        style={{ width: '70%', height: '70vh', minHeight: '450px' }}
                    >
                        <div
                            className="card"
                            style={{
                                overflow: 'scroll',
                                background: '#ffffff',
                                fontSize: '12px',
                                borderRadius: '10px',
                                height: '90%',
                                width: '100%',
                                padding: '7%',
                            }}
                        >
                            <form onSubmit={handleSubmit} method="post" className="form-card justify-content-center align-items-center" style={{ margin: 'auto', width: '60%' }}>

                            {isComplaint ? <h3 className="text-center" style={{ fontFamily: 'Inter,sans-serif' }}>Post a New Complaint</h3> : <h3 className="text-center" style={{ fontFamily: 'Inter,sans-serif' }}>Post a Lost/Found Notice</h3>}

                                <div className="col-xl-6 flex-column d-flex " style={{ width: '100%' }}>
                                    <div className="form-group row justify-content-between text-center">
                                        <label className="form-control-label"><h5>Topic/Title</h5></label>
                                        <input onChange={(e) => setTopic(e.target.value)} required type="text" placeholder="Title"
                                            className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '0px',
                                                height: '100%',
                                                background: '#a0abc0',
                                                borderRadius: '10px',
                                                paddingLeft: '15px',
                                                borderStyle: 'none',
                                            }}
                                        >
                                        </input>
                                    </div>
                                    {/* <div className="form-group row justify-content-between text-center">
                                        <label className="form-control-label"><h5>Target Email</h5></label>
                                        <input onChange={(e)=>{setTargetMail(e.target.value)}} type="email" placeholder="Target Email"
                                            name="email"
                                            className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '0px',
                                                height: '100%',
                                                background: '#a0abc0',
                                                borderRadius: '10px',
                                                paddingLeft: '15px',
                                                borderStyle: 'none',
                                            }}
                                        >
                                        </input>
                                    </div> */}

                                    {!isComplaint ? <div className="form-group row justify-content-between text-center">
                                        <label className="form-control-label" htmlFor="Category" style={{ fontFamily: 'Inter, sans-serif' }} ><h5>Choose Category</h5></label>
                                        <select required onChange={(e) => {setCategory(e.target.value); console.log(e.target.value);}}
                                            id="Category"
                                            className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '0px',
                                                height: '100%',
                                                background: '#a0abc0',
                                                borderRadius: '10px',
                                                paddingLeft: '15px',

                                            }}
                                        >
                                            <option value={"lost"}>Lost</option>
                                            <option value={"found"}>Found</option>
                                        </select>
                                    </div> : <></>}
                                    <div className="form-group row justify-content-between text-center">
                                        <label className="form-control-label" htmlFor="description" style={{ fontFamily: 'Inter, sans-serif' }}><h5>Enter Description</h5></label>
                                        <textarea required onChange={(e) => { setDescription(e.target.value) }}
                                            id="description"
                                            placeholder="Description"
                                            rows={2}
                                            className="form-control"
                                            style={{
                                                fontFamily: 'Inter, sans-serif',
                                                background: '#a0abc0',
                                                borderRadius: '10px',
                                                paddingLeft: '15px',
                                                paddingTop: '15px',
                                            }}
                                        />
                                    </div>
                                    <div style={{ paddingTop: '20px' }} className="row justify-content-between text-left">
                                        <div className="col-xl-6 flex-column d-flex">
                                            <button onClick={() => { navigate("/main_page/secondhand") }} className="btn btn-primary d-block w-100 mb-3" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Cancel</button>
                                        </div>
                                        <div className="col-xl-6 flex-column d-flex">
                                            <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Post</button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}