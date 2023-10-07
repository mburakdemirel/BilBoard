import React from 'react';

function Footer(){
    return (
            <footer className="text-center py-4" style={{ background: '#1a202c' }}>
                <div className="container">
                    <div className="row row-cols-1 row-cols-lg-3">
                        <div className="col">
                            <p className="my-2" style={{ color: 'rgb(255, 255, 255)', textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>
                                Copyright&nbsp;© 2023 BilBoard
                            </p>
                        </div>
                        <div className="col">
                            <ul className="list-inline my-2">
                                <li className="list-inline-item me-4"></li>
                                <li className="list-inline-item me-4"></li>
                            </ul>
                        </div>
                        <div className="col">
                            <ul className="list-inline my-2" style={{ textAlign: 'right' }}>
                                <li className="list-inline-item">
                                    <a className="link-secondary" href="#" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="link-secondary" href="#" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        Terms of Use
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>


    );

};

export default Footer;