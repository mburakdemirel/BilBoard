import React from 'react';
import Burak from './assets/img/burak.png';

function ComplaintsPage(){
    return (
        <section className="d-flex flex-grow-1   py-4" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container d-flex h-100">
                <div className="row gx-1 gy-3 d-flex  h-100" style={{ margin: '0px', width: '100%', marginTop: '-21px' }}>
                    <div className="col">
                        <div className="d-flex flex-column" style={{ background: 'var(--bs-white)', borderRadius: '10px', height: '100%', width: '100%', padding: '2%' }} data-bs-smooth-scroll="true">
                            <ul className="list-group" style={{ width: '100%', height: '100%', overflow: 'scroll' }} data-bs-smooth-scroll="true">
                                {Array(5).fill().map((_, index) => {

                                    return (
                                        <li className="list-group-item" style={{ padding: '0px', paddingBottom: '10px', borderStyle: 'none' }}>
                                            <div className="card" style={{ borderStyle: 'none', background: '#A0ABC0' }}>
                                                <div className="card-body d-flex flex-row " style={{ borderStyle: 'none', height: '11vw', minHeight: '80px', paddingLeft: '5px', paddingBottom: '5px', paddingRight: '5px', paddingTop: '5px' }}>
                                                    <div className="d-flex flex-column justify-content-between" style={{ width: '90%', height: '90%', margin: '0.7%', minWidth: '200px' }}>
                                                        <div>
                                                            <div className="d-flex r">
                                                                <h1 className="d-flex align-items-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', margin: '0px', fontSize: '20px', width: '70%' }}>Yemekhanedeki kötü yemekler</h1>
                                                                <button className="btn btn-primary d-flex justify-content-center align-items-center " type="button" style={{ width: '30%', height: '100%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px' }}>
                                                                    <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>hayrettin.arim@ug.bilkent.edu.tr</span>
                                                                </button>
                                                            </div>
                                                            <h4 className="d-flex text-truncate text-start" style={{ fontFamily: 'Inter, sans-serif',fontSize: '13px', marginTop: '0px', paddingTop: '5px', whiteSpace: 'normal', height: '68.5938px' }}>bunlar nasıl yemekler. siz bidaha yeasdfsdafsdsdaf asdfasdfsdaf dasfasdfadsfdasfdsf slkfjsadlsfjş sadlfjafjk lasdfj&nbsp; asklfsfkjfsdafk sadfsaddasfsdfsafsadfldasşdlsfşsadflkfsdafdaslfklfjdsfjafjslafjlfjdaslfkjsfjdlfkjsdalfkjasdfj&nbsp;&nbsp;<br />fsdafadsfsadfsdfadsfsdafdsasdfdsmajfdalsşflksdlşfsfkjslafdsdfklafjklafjdsfksadsfasdf<br /><br /></h4>
                                                        </div>
                                                        <div className="d-flex justify-content-end ">
                                                            <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '12%', height: '90%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '1%', minWidth: '120px' }}>
                                                                <i className="bi bi-chat-square-text-fill" style={{ marginRight: '5px' }}></i>
                                                                <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>249</span>
                                                            </button>
                                                            <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '12%', height: '90%', fontWeight: 'bold', background: '#717D96', borderStyle: 'none', borderColor: '#2d3648', marginRight: '0px', minWidth: '120px', padding: '0px' }}>
                                                                <i className="bi bi-share-fill" style={{ marginRight: '5px' }}></i>
                                                                <span className="d-flex" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 'bold', textAlign: 'center', marginRight: '-' }}>Share</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column" style={{ width: '6%', height: '90%', minWidth: '26px', margin: '0.7%' }}>
                                                        <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '100%', height: '40%', background: '#2D3648', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px', borderStyle: 'none' }}>
                                                            <i className="bi bi-arrow-up" style={{ fontSize: '24px' }}></i>
                                                        </button>
                                                        <h4 className="text-center d-flex justify-content-center align-items-center" style={{  fontSize: '18px', margin: '0px', height: '20%', background: '#2D3648', color: 'white', fontFamily: 'Inter, sans-serif' }}>160</h4>
                                                        <button className="btn btn-primary d-flex justify-content-center align-items-center" type="button" style={{ width: '100%', height: '40%', background: '#2D3648', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', borderStyle: 'none' }}>
                                                            <i className="bi bi-arrow-down" style={{ fontSize: '24px' }}></i>
                                                        </button>
                                                    </div>
                                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '90%', margin: '0.7%', width: '13%', minWidth: '60px', background: '#EDF0F7', borderRadius: '10px' }}>
                                                        <img className="rounded-circle" src={Burak} style={{ height: '70%', width: '70%', marginTop: '5%', marginBottom: '5%' }} />
                                                        <h1 className="d-flex justify-content-center" style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', width: '95%' }}>Burak Demirel</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                    )
                                })}





                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

};

export default ComplaintsPage;