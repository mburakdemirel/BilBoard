import PlaceHolder from './assets/img/WF Image Placeholder.png';
export function AllProducts() {
    return (
        <section className="d-flex d-xxl-flex flex-grow-1 justify-content-center align-items-start align-items-xl-start justify-content-xxl-center align-items-xxl-start py-4 py-xl-5" style={{ background: '#edf0f7', minHeight: '91vh' }}>
            <div className="container mt-5 mb-5">
                <div className="d-flex justify-content-center row">
                    <div className="row" style={{ paddingBottom: '10%' }}>
                        {/** we will get all the products from backend and then map the results */}
                        {Array(20).fill().map((_, index) => (<div key={index} className="col-lg-3 col-sm-6 col-sm-12 pb-4">
                            <div className="card mb-30">
                                <div className="inner">
                                    <div className="main-img"><img src={PlaceHolder} alt="Category" style={{ width: '100%', height: '50%' }} /></div>
                                    <div className="thumblist">
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <h4 className="card-title">Product Title</h4>
                                    <p className="text-muted">100₺</p>
                                    <button className="btn btn-primary btn-sm" style={{ background: '#2d3648', border: 'none', fontFamily: 'Inter, sans-serif', height: '40px' }}>View Product</button>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
        </section>
    )
}