import './assets/bootstrap/css/bootstrap.min.css';
import PlaceHolder from './assets/img/WF Image Placeholder.png';
import React from 'react';

//There are two kinds of profiles and they are rendered according to the value of myProfile boolean.
//Probably myProfile will take its value from a context. Or we might directly pass is as props.
//TODO: put all style attributes in a css file
function Products({myProfile}) {
    return (
        <div
            className="col-xxl-6 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center justify-content-sm-center align-items-sm-center align-items-md-center align-items-lg-center"
            data-aos="fade-right"
            data-aos-duration="600"
            style={{
                height: '40vw',
                width: '600px',
                minHeight: '380px',
            }}
        >
            <div
                className="d-flex d-xxl-flex flex-column justify-content-evenly justify-content-xxl-center align-items-xxl-center"
                style={{
                    //   background: 'var(--bs-white)',
                    background: '#ffffff',
                    fontSize: '12px',
                    borderRadius: '10px',
                    width: '95%',
                    padding: '5%',
                    height: '100%',
                }}
                data-bs-smooth-scroll="true"
            >
                {myProfile ? (<h1
                    className="text-center"
                    id="h1-products"
                    style={{
                        width: '100%',
                        fontSize: '250%',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '5px',
                    }}
                >
                    My Posts
                </h1>):
                (<h1
                    className="text-center"
                    id="h1-products"
                    style={{
                        width: '100%',
                        fontSize: '250%',
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '5px',
                    }}
                >
                    Posts
                </h1>)}
                <div
                    className="input-group text-center d-flex d-xl-flex flex-row justify-content-lg-center justify-content-xl-center mt-3"
                    style={{
                        width: '100%',
                        borderStyle: 'none',
                        borderBottomStyle: 'none',
                        height: '40px',
                        marginBottom: '10px',
                    }}
                >
                    {/* add onClick attribute to all of these buttons also when clicked their appearance should change*/}
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        id="secondhand"
                        style={{
                            background: '#2d3648',
                            color: '#ffffff',
                            width: '20%',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'inherit',
                            fontWeight: 'bold',
                        }}
                    >
                        Second Hand
                    </button>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        id="l&f"
                        style={{
                            background: '#717d96',
                            width: '20%',
                            color: '#ffffff',
                            fontSize: 'inherit',
                        }}
                    >
                        Lost & Found
                    </button>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        id="borrow"
                        style={{
                            background: '#717d96',
                            width: '20%',
                            color: '#ffffff',
                            fontSize: 'inherit',
                        }}
                    >
                        Borrow
                    </button>
                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        id="borrow"
                        style={{
                            background: '#717d96',
                            width: '20%',
                            color: '#ffffff',
                            fontSize: 'inherit',
                        }}
                    >
                        Complaints
                    </button>

                    <button
                        className="d-flex d-xl-flex d-xxl-flex justify-content-center justify-content-xl-center justify-content-xxl-center input-group-text"
                        id="donation"
                        style={{
                            background: '#717d96',
                            width: '20%',
                            color: '#ffffff',
                            fontSize: 'inherit',
                        }}
                    >
                        Donation
                    </button>


                </div>
                <hr
                    className="d-xxl-flex justify-content-xxl-center align-items-xxl-center"
                    style={{
                        width: '100%',
                        margin: '0',
                        marginTop: '8px',
                        marginBottom: '8px',
                    }}
                />
                <div
                    className="card-group d-flex d-xxl-flex flex-row flex-sm-nowrap flex-md-nowrap flex-lg-nowrap flex-xl-nowrap justify-content-xxl-center align-items-xxl-start flex-xxl-wrap"
                    style={{ height: 'initial', overflow: 'auto' }}
                >
                    {/** this is for testing purposes normally we should use result.map(product => (<div> ...) where result is the result of the http
                 * request and we should use product's data in ... part
                */}
                    {Array(9).fill().map((_, index) => (
                        <div
                            className="card"
                            key={index}
                            id="product"
                            style={{
                                width: '175px',
                                height: '175px',
                                borderRadius: '10px',
                                borderStyle: 'none',
                                borderBottomStyle: 'none',
                                padding: '5px',
                                minWidth: '175px',
                                maxWidth: '175px',
                            }}
                        >
                            <div
                                className="card-body"
                                style={{ width: '100%', height: '100%', padding: '0' }}
                            >
                                <img
                                    style={{ width: '100%', height: '50%' }}
                                    src={PlaceHolder}
                                    alt={`Product ${index}`}
                                />
                                <p >Title: </p>
                                <p >Description: </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

{/** according to the value of myProfile boolean either the user's own profile will be shown (true) or other person's profile will be shown (false) */ }
function ProfileArea({ myProfile }) {
    return (
        <div
            className="col-xl-6 col-xxl-5 offset-xxl-0 d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-grow-1 justify-content-center align-items-center order-last justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-center"
            data-aos="fade-left"
            data-aos-duration="600"
            style={{
                width: '600px',
                height: '40vw',
                minHeight: '554px',
            }}
        >
            <div
                className="d-flex d-xxl-flex flex-column justify-content-xxl-center align-items-xxl-center"
                style={{
                    background: '#ffffff',
                    fontSize: '12px',
                    borderRadius: '10px',
                    height: '100%',
                    width: '95%',
                    padding: '5%',
                    paddingTop: '2%',
                }}
            >
                <div className="d-flex d-xxl-flex flex-column justify-content-center align-items-center align-items-xxl-center" style={{ height: 'initial', width: '100%' }}>
                    <img className="rounded-circle" src={PlaceHolder} style={{ height: '150px', width: '150px', marginBottom: '15px' }} alt="User Profile" />
                    <h1 className="text-center" style={{ width: '100%', fontSize: '258%', fontFamily: 'Inter, sans-serif', marginBottom: '0px', fontWeight: 'bold' }}>
                        Name Surname
                    </h1>
                    <div className="text-end d-flex d-xxl-flex flex-row justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ paddingRight: '0px', fontSize: '16px', width: '100%' }}>
                        <p style={{ marginBottom: '0px', fontWeight: 'bold', fontFamily: 'Inter, sans-serif', width: '35px' }}>4/5</p>
                    </div>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: 'initial', width: '100%', padding: '2%' }}>
                    <p style={{ marginBottom: '0px', fontFamily: 'Inter, sans-serif', fontSize: '22px' }}>Phone</p>
                    <p style={{ marginBottom: '0px', fontFamily: 'Inter, sans-serif', fontSize: '22px' }}>E-Mail</p>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex flex-column justify-content-between align-items-center align-content-around align-items-xxl-start" style={{ height: '25%', width: '100%', minHeight: '100px', background: '#edf0f7', borderRadius: '10px', paddingRight: '5px', paddingLeft: '10px', paddingTop: '3px', maxHeight: '200px' }}>
                    <div className="d-flex flex-row justify-content-between align-items-center align-content-around" style={{ height: '30%', width: '100%', minHeight: '40px' }}>
                        <h1 style={{ width: '60%', fontSize: '1.6em', fontFamily: 'Inter, sans-serif', marginBottom: '0px' }}>About Me</h1>
                    </div>
                </div>
                <hr className="d-xxl-flex justify-content-xxl-center align-items-xxl-center" style={{ width: '100%', margin: '0px', marginTop: '10px', marginBottom: '10px' }} />
                <div className="d-flex justify-content-between align-items-center align-content-around flex-nowrap" style={{ height: '10%', width: '100%', minHeight: '40px', maxHeight: '50px' }}>
                    <div className="d-flex flex-row justify-content-between align-items-center" style={{ height: '100%', width: '290px', minWidth: '100px' }}>
                        {myProfile ?
                            (<>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Messages</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chat-square-fill" style={{ fontSize: '16px' }}>
                                        <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                                    </svg>
                                </button>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Favourites</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-heart-fill" style={{ fontSize: '16px' }}>
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
                                    </svg>
                                </button>
                            </>) :
                            (<>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Send Message</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-chat-square-fill" style={{ fontSize: '16px' }}>
                                        <path d="M2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                                    </svg>
                                </button>
                                <button className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center" style={{ width: '48%', height: '90%', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', minWidth: '20px' }}>
                                    <span style={{ paddingRight: '10px', fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold' }}>Rate</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-hand-thumbs-up-fill" style={{ fontSize: '16px' }}>
                                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"></path>

                                    </svg>
                                </button>
                            </>)
                        }
                    </div>
                    {myProfile ? (<div className="d-flex flex-row justify-content-around align-items-center" style={{ height: '100%', minWidth: '135px' }}>
                        <button
                            className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center"
                            type="button"
                            style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-gear-wide-connected">
                                <path fillRule='evenodd' d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"></path>
                            </svg>
                        </button>
                        <button
                            className="btn btn-primary d-flex d-xxl-flex justify-content-center align-items-center justify-content-xxl-center align-items-xxl-center"
                            type="button"
                            style={{ width: '40px', fontWeight: 'bold', background: '#2d3648', borderStyle: 'none', borderColor: '#2d3648', height: '90%' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-pencil-square">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                            </svg>
                        </button>
                    </div>) : (<></>)}
                </div>
            </div>
        </div>
    );
}

function Profile({ myProfile }) {
    return (
        <section className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container d-sm-flex d-md-flex d-lg-flex d-xl-flex d-xxl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center justify-content-lg-center align-items-lg-center justify-content-xl-center align-items-xl-center justify-content-xxl-center align-items-xxl-center h-100">
                <div className="row gx-1 gy-3 d-xxl-flex justify-content-sm-center justify-content-md-center justify-content-lg-center align-items-xl-center h-100" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}></div>
                <Products myProfile={myProfile}></Products>
                <ProfileArea myProfile={myProfile}></ProfileArea>
            </div>
        </section>
    );

}

export default Profile;