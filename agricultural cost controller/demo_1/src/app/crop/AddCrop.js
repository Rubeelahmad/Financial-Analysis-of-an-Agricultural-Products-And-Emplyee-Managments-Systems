import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import fire from '../../config/fire';
//import Swal from 'sweetalert2';
import 'bootstrap';
import "@coreui/coreui";

import {CDataTable,
  //CBadge,
  //CButton,
  //CCollapse,
  CCardHeader,
  CCard,
  CCardBody
  } from '@coreui/react';



export class Crop extends Component {


  constructor(props) {
    super(props);
    this.addCrop = this.addCrop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    //this.signup = this.signup.bind(this);

    this.state = {
      cropName: "",
      cropDescription: "",
      data: [],
      details: "",
      cropdata: [],
      showErrorText: ""
    }
  }

  addCrop(e) {
    e.preventDefault();

    //get User Id
    const userid = localStorage.getItem('userid');
    //console.log(userid)
      var cropname = this.state.cropName
      var cropdescription = this.state.cropDescription
      if(cropname)
      {
        var cropexits = false;
        if(cropdescription === "")
        {
          cropdescription = "-"
        } 

        fire.firestore().collection('users').doc(userid).collection('crops').get().then((snapshot) => {
        

          snapshot.docs.forEach(doc => {
     
            //Yearly Income and Yearly Expense
           // console.log(doc.data().cropName)
            if(cropname === doc.data().cropName)
            {
              cropexits = true
              console.log("exits")
              var err = "Error: Crop Name Already  Exists.";
              this.setState({
                showErrorText: err
              })
             // Swal.fire("Crop Name Already  Exists.")
            }
          
          });
         
          console.log(cropexits)
          if(cropexits)
          {
            //do nothing
            console.log("Do not add crop")
          }
          else
          {
            console.log("add crop")

            fire.firestore().collection('users').doc(userid).collection('crops').doc().set({
              cropName: cropname,
              cropDescription: cropdescription
        
            }).then(() => {
        
              console.log("Success: ")
              this.setState({
                cropDescription: "",
                cropName: ""
              })
             // Swal.fire("Crop added Successfully..!")
              window.location.reload(true)
            }).catch((err) => {
              console.log("Error: " + err)
            //  Swal.fire(err);
            
            })

          }
        
        })

      
  
      }
      else
      {
       // Swal.fire("Please enter the crop name..!")
       console.log("Please enter the crop name..!")
       var err = "Error: Please enter the crop name..!";
       this.setState({
        showErrorText: err
      })

    
    
    }
      

  }



  resetForm(e) {
    e.preventDefault();
    this.setState({
      cropDescription: "",
      cropName: ""
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  componentDidMount() {
    console.log("Add Crops ComponentDidMount")

    // bsCustomFileInput.init()

    const userid = localStorage.getItem('userid');
    fire.firestore().collection('users').doc(userid).collection('crops').get().then((snapshot) => {
      // console.log(snapshot.data())
      const cropdata_arr = [];
      snapshot.docs.forEach(doc => {
        //   console.log(doc.id)
        //   console.log(doc.data())

        var cropdata = doc.data();
       // cropdata.id = doc.id;
        cropdata_arr.push(cropdata);
      });
      console.log("categoryname Arra:::::::::::: ", cropdata_arr)

      this.setState({

        cropdata: cropdata_arr
      })

    })
  };


  render() {

    const fields = [
      /* { key: 'id', _style: {} }, */
      { key: 'cropName', _style:{color:'white'} },
      { key: 'cropDescription', _style:{color:'white'} }
    ];

    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Crop</h4>
                  <p className="card-description" > Add Crop Form </p>
                  <form className="forms-sample">
                
                  <Form.Group>
                  <label htmlFor="cropname">Crop Name</label>
                      <Form.Control 
         
                        type="text"
                        style={{color:'white'}}
                        
                        className="form-control"
                        id="cropname"
                        name="cropName"
                        value={this.state.cropName}
                        onChange={this.handleChange}
                        placeholder="crop name ..." />
                     </Form.Group>
                    <Form.Group>
                      <label htmlFor="txt_describeCategory">Describe the Crop</label>
                      <textarea
                      style={{color:'white'}}
                        className="form-control"
                        id="cropdescription"
                        name="cropDescription"
                        value={this.state.cropDescription}
                        onChange={this.handleChange}
                        rows="4"
                        placeholder="write something ..."></textarea>
                    </Form.Group>
                   
                    <button type="submit" className="btn btn-primary mr-2" onClick={this.addCrop}>Add Crop</button>
                    <button className="btn btn-dark" onClick={this.resetForm}>Cancel</button>
                     {' '}<label type="text" style={{color: 'red'}}>{this.state.showErrorText}</label>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>



        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-firstName">Crops Table</h4>
                <p className="card-description"> 
                </p>
                <div className="table-responsive"  style= {{color:'white'}}>
                <CCard  >
              <CCardHeader>Available Crops Data</CCardHeader>
              <CCardBody>

                  <CDataTable
                    items={this.state.cropdata}
                    fields={fields}
                    itemsPerPageSelect
                    itemsPerPage={5}
                    pagination = {true}
                    tableFilter={true}
                    sorter ={true}
                    _style
                    border ={true}
                    responsive = {true}
                    outlined={true}
                    footer = {true}
                   

                  />
                    
              </CCardBody>
              </CCard  >
            
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    )
  }
}




export default Crop




