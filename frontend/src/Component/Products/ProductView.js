import React, { createRef, Component } from 'react';
import Header from '../header/header';
import Sidebar from '../sidebar/Sidebar';
import AccountCSS from './account.module.css';
import { Form, Button, Table, Row, Col, Container } from "react-bootstrap";
import axios, { Axios } from 'axios';
import { FaEdit } from "react-icons/fa";
import { BsWallet2 } from "react-icons/bs";
import { FcCheckmark, FcCancel, FcOk, FcInspection, FcOvertime, FcProcess, FcPicture } from "react-icons/fc";
import ScrollableFeed from 'react-scrollable-feed';
import validator from 'validator'
import TableScrollbar from 'react-table-scrollbar';
import { MDBDataTable } from 'mdbreact';
import { Image } from 'cloudinary-react';
import Select from 'react-select';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2'
import SimpleImageSlider from "react-simple-image-slider";
import { Slide } from 'react-slideshow-image';
import { BsXLg } from "react-icons/bs";
import img from '../Images/No-Image-Placeholder.svg.png'
import logo from '../Images/default.jpg'


class ProductView extends Component {

    constructor(props) {

        super(props)

        this.state = {

            AccountID: this.props.match.params.id,
            productData: '',
            baggagedata: [],
            allAcounts: [],
            productName: '',
            category: '',
            companyName: '',
            length: '',
            productDiscription: '',
            BagageID: '',
            BagageType: '',
            SerailNumber: '',
            type: true,
            holdertype: true,
            data: [],
            img: [],
            imgURL: '',
            options: [],
            selectedOptions: [],
            CloudinaryImg: [],
            allBaggage: [],
            allproducts: [],
            allselectedBaggage: [],
            submitButton: false,
            addButton: false,
            baggageResData: [],
            slideImages: [],
            bagageData: [],
            createdDate:''



        }








        this.getAllProducts = this.getAllProducts.bind(this);
        this.getProductById = this.getProductById.bind(this);
      
        this.handleImgClick = this.handleImgClick.bind(this);


    }


    handleImgClick(e) {
        console.log("img onclick",e)
        window.open(e)
    }

    getProductById() {

        const url = 'http://localhost:8000/api/product/getById';
        const data = {
            id: this.state.AccountID
        }

        axios.post(url, data).then((res) => {
            console.log("resss", res)
            if (res.status == 200) {
                if (res.data.data) {

                    const url = 'http://localhost:8000/api/bagage/findByComAndAcc';

                    const data = {
                        "companyName": res.data.data.accountName,
                        "productName": res.data.data.productName
                    }

                    axios.post(url, data).then((res) => {

                        console.log("esde", res.data)
                        this.setState({
                            baggageResData: res.data.data
                        }, () => {
                            console.log("baggageResData", this.state.baggageResData)

                        })
                    })

                    console.log("dateees",res.data.data.createdAt)
                    const date = res.data.data.createdAt
                    
                    


                    const createdDate = date.substr(0,10);

                    

                    this.setState({
                        productData: res.data.data,
                        createdDate:createdDate

                    }, () => {
                        console.log("pro", this.state.productData)
                    })
                } else {
                    alert("no product with that")
                }
            } else {
                alert("technical error");
            }
        })

    }


    toProduct() {

        this.props.history.push('/products');

    }

    editAccountBtn(id) {

        this.props.history.push(`/products/${id}`);

    }












    getAllProducts() {

        const url = 'http://localhost:8000/api/product/get'

        axios.get(url).then((res) => {

            this.setState({
                allproducts: res.data.data,

            }, () => {
                console.log("all products", this.state.allproducts);
            })
        })
    }


    getallBaggage() {

        const url = 'http://localhost:8000/api/product/get';

        axios.get(url).then((res) => {

            this.setState({
                allproducts: res.data.data
            }, () => {
                console.log("all baggage", this.state.allproducts);

                let bagageID = ' ';
                let serialNumber = '';

                const userAttributes = []
                this.state.allproducts.forEach(el => {
                    // el.bagageData.map(obj => {
                    //     bagageID = obj.bagageID,
                    //         serialNumber = obj.serialNumber
                    // }
                    // )

                    const data = el.productCategory == 'tvSeries' ? el.productDetails + " EP" : el.productDetails + " Min"
                    userAttributes.push({
                        companyname: el.accountName,
                        productname: el.productName,
                        detail: data,
                        Baggageid: el.productCategory,
                        produtStaus: <div style={{ "fontSize": "x-large", "writingMode": "vertical-lr" }}>{el.productStatus == 'N' ? <FcInspection /> : <FcOvertime />}</div>,
                        serialNumber: el.productCategory,
                        discription: <span style={{ "whiteSpace": "break-spaces" }}>{el.bagageData.map((obj, index) => {
                            return <><Row>
                                <Col>
                                    <p style={{ "height": "20px" }}>{index + 1 + ". " + obj.serialNumber}</p></Col><Col><span style={{ "marginLeft": "0px" }}>{obj.type}</span></Col><Col><span style={{ "marginLeft": "0px" }}>{obj.status == 'Y' ? <FcOk /> : <FcCancel />}</span></Col></Row></>
                        })}</span>,

                        age: <FaEdit onClick={() => this.editAccountBtn(el._id)} />


                    })
                });

                this.setState({
                    data: {
                        columns: [
                            {
                                label: 'COMPANY NAME',
                                field: 'companyname',
                                sort: 'asc',
                                width: 200,

                            },
                            {
                                label: 'PRODUCT NAME',
                                field: 'productname',
                                sort: 'asc',
                                width: 150
                            },
                            {
                                label: 'productCategory',
                                field: 'Baggageid',
                                sort: 'asc',
                                width: 50,

                            },

                            {
                                label: 'Length',
                                field: 'detail',
                                sort: 'asc',
                                width: 50
                            },
                            {
                                label: 'Product Status',
                                field: 'produtStaus',
                                sort: 'asc',
                                width: 50
                            },
                            {
                                label: 'Baggage serialNumber',
                                field: 'discription',
                                sort: 'asc',
                                width: 250,


                            }
                            ,
                            {
                                label: 'ACTION ',
                                field: 'age',
                                sort: 'asc',
                                width: 50
                            }
                        ],
                        rows: userAttributes
                    }
                })
            })
        })
    }


    editAccountBtn(id) {

        this.setState({
            AccountID: id
        }, () => {
            this.getProductById();
        })

        // this.props.history.push(`/products/${id}`);


    }


    componentDidMount() {





        this.getAllProducts();

        this.getallBaggage();

        this.getProductById();




    }



    render() {
        const { selectedOptions, productData } = this.state;
        return (
            <div className='main-wrapper'>
                <div className='app-header'>
                    <Header />

                </div>
                <div className='app-body'>
                    <div className='body-wrapper'>
                        <div className='app-sidebar'>
                            <Sidebar />
                        </div>
                        <div className='app-content'>

                            <Row>

                                {/*product register */}
                                <div className={AccountCSS.container}>
                                    <div style={{ "marginLeft": "20px", "marginTop": "20px", "marginBottom": "25px", "fontSize": "20px" }}>
                                        Product Data<span style={{ "marginLeft": "550px", "fontSize": "40px" }}>{productData.productStatus == 'Y' ? <FcOvertime /> : <FcInspection />}</span>

                                    </div>

                                    <div style={{ "marginLeft": "20px" }}>

                                        <div style={{ "marginLeft": "10px", "width": "730px" }}>

                                            <Row>

                                                <Col>

                                                    <p>Account Name :</p>
                                                </Col>

                                                <Col>

                                                    <p>Product Name :</p>


                                                </Col>




                                            </Row>
                                            <div style={{ "marginLeft": "1px", "backgroundColor": "rgb(245 245 245)" }}>
                                                <Row>


                                                    <Col>
                                                        <p style={{ "marginLeft": "10px" }}>{productData.accountName}</p>
                                                    </Col>

                                                    <Col>
                                                        <p style={{ "marginLeft": "10px" }}>{productData.productName}</p>
                                                    </Col>



                                                </Row>
                                            </div>
                                            <Row>

                                                <Col>  <p  style={{ "marginTop": "10px" }}>Product Type :</p></Col>
                                                <Col>  <p style={{ "marginTop": "10px" }}>Date :</p></Col>



                                            </Row>
                                            <div style={{ "marginLeft": "1px", "backgroundColor": "rgb(245 245 245)" }}>
                                                <Row>

                                                    <Col>   <p style={{ "marginLeft": "10px" }}>{productData.productCategory}</p></Col>
                                                    <Col>  <p style={{ "marginLeft": "10px" }}>{this.state.createdDate}</p></Col>

                                                </Row>

                                            </div>
                                            <Row>

                                                <p style={{ "marginTop": "10px" }}>Discription :</p>

                                            </Row>

                                            <div style={{ "overflow": "auto", "height": "490px", "overflowX": "hidden", "marginLeft": "1px", "backgroundColor": "rgb(245 245 245)" }}>

                                                <Row>

                                                    <div dangerouslySetInnerHTML={{ __html: productData.productDiscription }} style={{ "marginLeft": "10px", "width": "700px" }} />

                                                </Row>

                                            </div>


                                        </div>


                                    </div>
                                </div>

                                {/* all account display */}
                                <div className={AccountCSS.containertwo}>
                                    <Row>
                                        <Col>

                                            <div style={{ "marginLeft": "20px", "marginTop": "20px", "marginBottom": "40px", "fontSize": "20px" }}>
                                                Bagage Details

                                            </div>
                                        </Col>
                                        {/* <Col>
                                            <input
                                                className="form-control"
                                                type="search"
                                                placeholder="Search"
                                                name="searchQuery"
                                                onChange={this.handleSearchArea}
                                                style={{
                                                    width: "180px",

                                                    marginRight: "2px",
                                                    marginTop: "20px",
                                                    height: "30px",

                                                    borderColor: "rgba(6, 21, 117,0.5)",
                                                    float: "right"
                                                }}
                                            ></input>

                                        </Col> */}

                                    </Row>

                                    {

                                        this.state.baggageResData.length != 0 ? <div style={{ "overflow": "auto", "height": "720px", "overflowX": "auto" }}>

                                            {this.state.baggageResData &&

                                                this.state.baggageResData.map(obj =>

                                                    <div class="card mb-3" style={{ "max-width": "790px", "paddingBottom": "10px" }}>
                                                        <div class="row g-1">
                                                            <div class="col-md-8">
                                                                <div style={{ "overflow": "auto", "height": "320px", "overflowX": "auto" }}>


                                                                    {obj.CloudinaryImg &&
                                                                        obj.CloudinaryImg.length == 0 ? <img src={logo} class="img-fluid rounded-start" alt="..." style={{ "height": "320px" }} /> : obj.CloudinaryImg.map(Object =>
                                                                            <img src={Object.url} class="img-fluid rounded-start" alt="..." onClick={() => this.handleImgClick(Object.url)} style={{ "paddingBottom": "10px" }} />
                                                                        )}


                                                                </div>

                                                            </div>
                                                            <div class="col-md-4">
                                                                <div class="card-body">
                                                                    <h5 class="card-title">Baggage Data<span style={{ "marginLeft": "50px", "fontSize": "larger" }}>{obj.status == 'Y' ? <FcOk /> : <FcCancel />}</span></h5>
                                                                    <p class="card-text">Serial Number : {obj.serialNumber}</p>
                                                                    <p class="card-text">Baggage ID : {obj.bagageID}</p>
                                                                    <p class="card-text">Baggage Type : {obj.type}</p>

                                                                    {/* <Button variant="primary" type="submits" style={{ "marginTop": "20px", "width": "80px", "fontSize": "smaller" }} onClick={() => this.cancelBaggage(obj._id, index)}>
                                                                        Cancel
                                                                    </Button> */}
                                                                    {/* <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                )


                                            }
                                        </div> : <div style={{ "height": "720px" }}><span style={{ "marginLeft": "350px" }}>NO BAGGAGE SELECT<div style={{ "marginLeft": "420px" }}><BsWallet2 /></div></span></div>

                                    }

                                </div>

                            </Row>

                            <Row>
                                <div style={{ "paddingBottom": "20px" }}>

                                </div>
                            </Row>

                            <Row>

                                <div className={AccountCSS.container3} >

                                    <Row>
                                        <Col>

                                            <div style={{ "marginLeft": "20px", "marginTop": "20px", "marginBottom": "40px", "fontSize": "20px" }}>
                                                All Products

                                            </div>
                                        </Col>
                                        {/* <Col>
                                            <input
                                                className="form-control"
                                                type="search"
                                                placeholder="Search"
                                                name="searchQuery"
                                                onChange={this.handleSearchArea}
                                                style={{
                                                    width: "180px",

                                                    marginRight: "2px",
                                                    marginTop: "20px",
                                                    height: "30px",

                                                    borderColor: "rgba(6, 21, 117,0.5)",
                                                    float: "right"
                                                }}
                                            ></input>

                                        </Col> */}

                                    </Row>


                                    <MDBDataTable


                                        style={{ "whitespace": "nowrap", }}
                                        scrollY
                                        maxHeight="500px"
                                        loading={false}
                                        hover
                                        bordered
                                        word-wrap="breakword"

                                        whitespace="nowrap"
                                        textoverflow="ellipsis"

                                        data={this.state.data}
                                        className={AccountCSS.yourcustomstyles}
                                    />

                                </div>

                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductView;
