import React from "react";
import PlaceHolder from './assets/img/WF Image Placeholder.png';

// TODO: put all style attributes into a css file and think about the layout of this page
// Should there be products next to the messages??
function Products() {
    return (
        <>
            <div className="col-xxl-6 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center justify-content-sm-center align-items-sm-center align-items-md-center align-items-lg-center" data-aos="fade-right" data-aos-duration="600" style={{ height: '40vw', width: '600px', minHeight: '200px' }}>
                <div className="d-flex d-xxl-flex flex-column justify-content-evenly align-items-xxl-center" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%', padding: '5%' }} data-bs-smooth-scroll="true">
                    <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                        {Array(6).fill().map((_,index) => (<li key={index} className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                            <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0' }}>
                                <div className="card-body d-flex d-xxl-flex flex-row justify-content-between align-items-center justify-content-xxl-start align-items-xxl-center" style={{ height: '20%', minHeight: '80px', paddingTop: '5px', paddingBottom: '5px', borderStyle: 'none', paddingLeft: '20px', paddingRight: '6px' }}>
                                    <div className="d-flex d-xxl-flex flex-column justify-content-center" style={{ width: '50%', height: '100%' }}>
                                        <h4 style={{ fontSize: '20px', margin: '0px' }}>Title</h4>
                                        <h3 style={{ paddingTop: '0px', margin: '0px', marginTop: '1px' }}>Price</h3>
                                    </div>
                                    <div className="d-flex d-xxl-flex flex-row justify-content-end align-items-center flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-xxl-end align-items-xxl-center" style={{ width: '50%', height: '100%' }}>
                                        <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '35px' }}>
                                            <i className="fas fa-share-alt"></i>
                                        </button>
                                        <span style={{ width: '12px' }}></span>
                                        <img alt="" src={PlaceHolder} style={{ width: '35%', height: '95%', minWidth: '70px' }} />
                                    </div>
                                </div>
                            </div>
                        </li>))}

                    </ul>
                </div>
            </div>
        </>
    );
}

function Messages() {
    return (
        <>
            <div className="col-xl-6 col-xxl-5 offset-xxl-0 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center order-last justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-center" data-aos="fade-left" data-aos-duration="600" style={{ width: '600px', height: '40vw', minHeight: '380px' }}>
                <div className="d-flex d-xxl-flex flex-column align-items-center justify-content-sm-start justify-content-md-start justify-content-lg-start justify-content-xxl-start align-items-xxl-center" style={{ background: '#ffffff', fontSize: '12px', borderRadius: '10px', height: '100%', width: '95%' }}>
                    <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: '18%', width: '100%', paddingRight: '20px', paddingBottom: '10px', paddingLeft: '20px', paddingTop: '10px' }}>
                        <h1 style={{ width: '50%', fontSize: '200%', fontFamily: 'Inter, sans-serif', marginBottom: '0px' }}
                        >Seller Name</h1>
                        <div className="d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-xxl-center" style={{ height: '100%', width: '60%' }}>
                            <img alt="" className="rounded-circle" src={PlaceHolder} style={{ height: '100%', width: '30%' }} />
                        </div>
                    </div>
                    <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px' }} />
                    <div className="d-flex flex-row justify-content-center justify-content-xl-center justify-content-xxl-center" style={{ height: '65%', width: '100%', overflow: 'scroll' }}>
                        <ul className="list-group flex-column-reverse" style={{ width: '90%', height: '100%', paddingTop: '20px', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                            {/** burada kimin mesajı olduğuna göre sağa veya sola alignlanmış halini göstermeliyiz 
                             * backendden mesajları alıp kim tarafından gönderildiğine göre buna karar veririz
                            */}
                            <li className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0', width: '70%' }}>
                                    <div className="card-body text-start d-flex d-xxl-flex flex-row justify-content-start justify-content-xxl-start align-items-xxl-center" style={{ height: '10%', borderStyle: 'none', width: '100%', padding: '10px', fontSize: '20%' }}>
                                        <p style={{ marginBottom: '0px', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '600%' }}>Paragraphdasfasdfasdfsadfasdfsadfasdfadsfasdfasdfasdf</p>
                                        <div className="d-flex d-xxl-flex flex-row justify-content-end align-items-center flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-xxl-end align-items-xxl-center" style={{ width: '50%', height: '100%' }}>
                                            <span style={{ width: '12px' }}></span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item d-flex justify-content-end" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0', width: '70%' }}>
                                    <div className="card-body text-start d-flex d-xxl-flex flex-row justify-content-start justify-content-xxl-start align-items-xxl-center" style={{ height: '10%', borderStyle: 'none', width: '80%', padding: '10px', fontSize: '20%' }}>
                                        <p style={{ marginBottom: '0px', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '600%' }}>Paragraphdasfasdfasdfsadfasdfsadfasdfadsfasdfasdfasdf</p>
                                        <div className="d-flex d-xxl-flex flex-row justify-content-end align-items-center flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-xxl-end align-items-xxl-center" style={{ width: '50%', height: '100%' }}>
                                            <span style={{ width: '12px' }}></span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="d-flex flex-row justify-content-start align-items-center align-content-around align-items-xxl-start" style={{ height: '10%', width: '90%', background: '#edf0f7', borderRadius: '10px', marginTop: '12px', border: '2px solid #CBD2E0' }}>
                        <div className="d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center align-items-xxl-center" style={{ width: '10%', height: '100%', borderWidth: '2px', borderStyle: 'none' }}>
                            <i className="fas fa-plus" style={{ fontSize: '20px' }}></i>
                        </div>
                        <input className="form-control-sm" type="text" style={{ width: '80%', height: '100%', background: '#edf0f7', borderRadius: '0px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px', borderStyle: 'none', borderTopWidth: '2px', borderTopStyle: 'none', borderRight: '2px solid #CBD2E0', borderBottomWidth: '2px', borderBottomStyle: 'none', borderLeft: '2px solid #CBD2E0' }} />
                        <div className="d-flex d-xxl-flex flex-row justify-content-center align-items-center align-items-sm-center align-items-md-center align-items-lg-center align-items-xl-center justify-content-xxl-center align-items-xxl-center" style={{ width: '10%', height: '100%', borderStyle: 'none' }}>
                            <i className="fas fa-paper-plane" style={{ fontSize: '20px' }}></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function MessagePage() {
    return (
        <section className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-center h-100">
                <div className="row gx-1 gy-3 d-xxl-flex justify-content-sm-center justify-content-md-center justify-content-lg-center align-items-xl-center h-100" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                    {/* I think this should not be here this page should be more like a pop-up page */}
                    <Products></Products>
                    <Messages></Messages>
                </div>
            </div>
        </section>
    )
}