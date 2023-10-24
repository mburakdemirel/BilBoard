// TODO: create a separate css file for it. Also, think about the file upload and how to disable certain fields.
export function AddForm() {
    return (
        <section className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container-fluid px-1 py-5 mx-auto">
                <div className="row d-flex justify-content-center" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                    <div
                        className="col-xl-7 col-lg-8 col-md-9 col-11 text-center"
                        data-aos="fade-left"
                        data-aos-duration="600"
                        style={{ width: '70%', height: '65vh', minHeight: '450px' }}
                    >
                        <div
                            className="card"
                            style={{
                                overflow:'scroll',
                                background: '#ffffff',
                                fontSize: '12px',
                                borderRadius: '10px',
                                height: '100%',
                                width: '100%',
                                padding: '7%',
                            }}
                        >
                            <h3 className="text-center" style={{ fontFamily: 'Inter,sans-serif' }}>Create a Post</h3>
                            <form method="post" className="form-card" style={{ width: '100%' }}>


                                <div className="row justify-content-between text-left" style={{paddingTop:'5px'}}>
                                    <div className="form-group col-xl-6 flex-column d-flex"
                                    // style={{
                                    //     width: '100%',
                                    //     height: '10%',
                                    //     marginBottom: '3%',
                                    //     maxHeight: '75px',
                                    //     minHeight: '60px',
                                    // }}
                                    >
                                        <label className="form-control-label"><h5>Title</h5></label>
                                        <input required type="text" placeholder="Title"
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
                                        </input>
                                    </div>
                                    <div
                                        className="form-group col-xl-6 flex-column d-flex"
                                    // style={{
                                    //     width: '100%',
                                    //     height: '10%',
                                    //     marginBottom: '3%',
                                    //     maxHeight: '75px',
                                    //     minHeight: '60px',
                                    // }}
                                    >
                                        <label className="form-control-label" htmlFor='postTypeSelect'><h5>Select a Post Type</h5></label>
                                        <select className="form-control"
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
                                            <option>Donation</option>
                                            <option>Borrow</option>
                                            <option>Secondhand Product</option>
                                            <option>Lost Product</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row justify-content-between text-left" style={{paddingTop:'10px'}}>
                                    <div
                                        className="form-group col-xl-6 flex-column d-flex"
                                    // style={{
                                    //     width: '100%',
                                    //     height: '10%',
                                    //     marginBottom: '3%',
                                    //     maxHeight: '75px',
                                    //     minHeight: '60px',
                                    // }}
                                    >
                                        <label className="form-control-label"><h5>Price</h5></label>
                                        <input min={0} placeholder="Enter Price (in Turkish Liras)" type="number"
                                            className="form-control"
                                            style={{
                                                width: '100%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '0px',
                                                height: '100%',
                                                background: '#a0abc0',
                                                borderRadius: '10px',
                                                paddingLeft: '15px',
                                                // borderTopLeftRadius: '10px',
                                                // borderBottomLeftRadius: '10px',
                                            }}
                                        >

                                        </input>
                                        {/* <h6
                                            className="form-control"
                                            style={{
                                                width: '15%',
                                                fontFamily: 'Inter, sans-serif',
                                                marginBottom: '0px',
                                                height: '100%',
                                                background: '#a0abc0',
                                                borderRadius: '0px',
                                                borderTopRightRadius: '10px',
                                                borderBottomRightRadius: '10px',
                                                fontSize: '20px',
                                                borderLeft: '1px solid #CBD2E0',
                                            }}
                                        >
                                            TL
                                        </h6> */}
                                    </div>
                                    <div
                                        className="form-group col-xl-6 flex-column d-flex"
                                    // style={{
                                    //     width: '100%',
                                    //     height: '10%',
                                    //     marginBottom: '3%',
                                    //     maxHeight: '75px',
                                    //     minHeight: '60px',
                                    // }}
                                    >
                                        <label className="form-control-label" htmlFor="Category" style={{ fontFamily: 'Inter, sans-serif' }} ><h5>Category</h5></label>
                                        <select
                                            id="Category"
                                            className="form-control"
                                            // style={{
                                            //     width: '100%',
                                            //     fontFamily: 'Inter, sans-serif',
                                            //     marginBottom: '0px',
                                            //     height: '40%',
                                            //     background: '#a0abc0',
                                            //     borderRadius: '10px',
                                            //     paddingLeft: '15px',
                                            // }}
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
                                            <option>???</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row justify-content-between text-left" style={{paddingTop:'10px'}}>
                                    <div className="form-group col-xl-6 flex-column d-flex">
                                        <label className="form-control-label" htmlFor="description" style={{ fontFamily: 'Inter, sans-serif' }}><h5>Enter your Description</h5></label>
                                        <textarea
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
                                    <div className="form-group col-xl-6 flex-column d-flex">
                                        <h5 style={{ fontFamily: 'Inter, sans-serif' }}>Pictures</h5>
                                        <label className="form-control-label" htmlFor="FormControl">Choose files to upload</label>
                                        <input style={{}} id="FormControl" type="file" className="form-control-file" accept="image/png, image/jpg, image/jpeg" multiple></input>
                                    </div>

                                </div>
                                <div style={{paddingTop:'20px'}} className="row justify-content-between text-left">
                                    <div className="col-xl-6 flex-column d-flex">
                                        <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Cancel</button>
                                    </div>
                                    <div className="col-xl-6 flex-column d-flex">
                                        <button className="btn btn-primary d-block w-100 mb-3" type="submit" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>Post</button>
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