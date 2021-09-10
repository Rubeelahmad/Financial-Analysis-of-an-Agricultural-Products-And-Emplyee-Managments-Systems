import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import fire from '../../config/fire';
//import Swal from 'sweetalert2';


import "@coreui/coreui";

import {
  CDataTable,
  //CBadge,
  //CButton,
  //CCollapse,
  CCard,
  CCardHeader,
  CCardBody
} from '@coreui/react';


export class Income extends Component {

  constructor(props) {
    super(props);
    this.addIncomes = this.addIncomes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.updatedTotalExpenseAndIncome = this.updatedTotalExpenseAndIncome.bind(this);
    this.resetForm.bind(this);

    //this.signup = this.signup.bind(this);

    this.state = {
      categoryName: "",
      cropName: "",
      date: new Date(),
      incomeAmount: 0,
      incomeDescription: "",
      image: null,
      progress: 0,
      downloadURL: null,
      getCategoryName: [],
      getCropName: [],
      incomedata: []
    }
  }

  //Update Total Expense & Income
  updatedTotalExpenseAndIncome(stateincomeAmount) {
    console.log("In Updated total Expensse And Income")
    const userid = localStorage.getItem('userid');
    var updatedtotalincome = 0
    var updatedtotalexpense = 0
    fire.firestore().collection('users').doc(userid).get().then((snapshot) => {
      console.log(snapshot.data().totalIncome)
      console.log(snapshot.data().totalExpense)
      console.log(stateincomeAmount)

      updatedtotalexpense = parseInt(snapshot.data().totalExpense)
      updatedtotalincome = parseInt(snapshot.data().totalIncome) + parseInt(stateincomeAmount)

      console.log(updatedtotalexpense)
      console.log(updatedtotalincome)
    }).then(() => {
      console.log(updatedtotalexpense)
      console.log(updatedtotalincome)

      fire.firestore().collection('users').doc(userid).set({
        totalExpense: parseInt(updatedtotalexpense),
        totalIncome: parseInt(updatedtotalincome)
      })

    }).catch((err) => {
      console.log(err)
    })

  }


  addYearlyIncome() {

    const userid = localStorage.getItem('userid');
    var stateincomeAmount = this.state.incomeAmount
    if(stateincomeAmount === "" )
    {
      stateincomeAmount = 0
    }
    //get selected year
    var selectedYear = new Date(this.state.date).getFullYear()
    console.log(selectedYear)
    console.log(userid)
    console.log(stateincomeAmount)

    // Add YerlyIncome  Fields are updated accordingly
    fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).get().then((snapshot) => {

      //snapshot.data().yearlyIncome !== undefined 
      if (snapshot.exists === true) {

        console.log("IN IFFFFFFFFFFFFFFFFFFF")
        var yearlyExpense = snapshot.data().yearlyExpense;
        var yearlyIncome = snapshot.data().yearlyIncome;
        console.log(yearlyExpense)
        console.log(yearlyIncome)
        if (isNaN(yearlyExpense)) {
          yearlyExpense = 0
          console.log(yearlyExpense)
        }
        if (isNaN(yearlyIncome)) {
          yearlyIncome = 0
          console.log(yearlyIncome)

        }

        console.log(stateincomeAmount)

        if (stateincomeAmount > 0) {

          var updatedIncomeAmount = parseInt(yearlyIncome) + parseInt(stateincomeAmount)
          fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).set({
            yearlyExpense: parseInt(yearlyExpense),
            yearlyIncome: parseInt(updatedIncomeAmount)
          }).then(() => {
            console.log("Sum of Toatl yearlyIncome updated as: " + updatedIncomeAmount)
            //Updated Total Expensse and Total Income            
            this.updatedTotalExpenseAndIncome(stateincomeAmount)
          })
        }
      }
      else {
        console.log("IN ELSEEEEEEEEEEEEEEEEEE")
        fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).set({
          yearlyExpense: 0,
          yearlyIncome: parseInt(stateincomeAmount)
        }).then(() => {
          console.log("Toatl yearlyIncome is updated ")
          //Updated Total Expensse and Total Income            
          this.updatedTotalExpenseAndIncome(stateincomeAmount)

        })
      }

    }).then(() => {
      console.log("Toatl yearlyIncome is updated")
    }).catch((err) => {
      console.log(err)
    })


  }


  addIncomes(e) {
    e.preventDefault();
    console.log("Start Add Incomes")
    this.addYearlyIncome()
    console.log("Start Add Incomes: After successfully execution of add yearly Income")
    //get User Id
    const userid = localStorage.getItem('userid');
    //get selected year
    var selectedYear = new Date(this.state.date).getFullYear()
    console.log(selectedYear)
    console.log(userid)

    if (this.state.date !== "" && this.state.cropName !== "" && this.state.categoryName !== "") {
      fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).collection('incomes').doc().set({
        categoryName: this.state.categoryName,
        cropName: this.state.cropName,
        date: new Date(this.state.date),
        incomeAmount: parseInt(this.state.incomeAmount),
        incomeDescription: this.state.incomeDescription

      }).then(() => {
        if (this.state.image) {
          this.handleUpload();
          this.resetForm();
        }
        else {
          this.resetForm()
         // Swal.fire("income added Successfully..!")
         var err = "Success: Income added Successfully..!";
         this.setState({
           showErrorText: err
         })
       //   window.location.reload(true)

        }

      }).catch((err) => {
        console.log("Error: " + err)
      })
    }
    else {
  
      var err = "Error: Some field(s) are missing...!!!";
      this.setState({
        showErrorText: err
      })
    }

  }



  handleChange(e) {
    console.log("Hellol:::::::::::::::: ", e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    })

  }


  componentDidMount() {
    console.log("component did mount")



    bsCustomFileInput.init();
    const userid = localStorage.getItem('userid');


    //Get current user's totalIncome & totalIncome
    fire.firestore().collection('users').doc(userid).get().then((snapshot) => {
      if(snapshot.exists === true)
      {
        console.log(snapshot.data())
      }
      else
      {
        console.log( "No User Exists")
      }
     
    })

    // In running State Query: Get current user , Yearswise , yearlyIncome & Yearly Incomes 
    // And Fetching Year wise Incomes Data
    fire.firestore().collection('users').doc(userid).collection('years').get().then((snapshot) => {
      // console.log(snapshot.data())
      const incomedata_arr = [];

      snapshot.docs.forEach(doc => {
        //Year
        var year = doc.id
        console.log(year)
        //Yearly Income and Yearly Expense
        console.log(doc.data())
     
        if (year) {
          //Fetch Year wise Income Data
          fire.firestore().collection('users').doc(userid).collection('years').doc(year).collection('incomes').get().then((snapshot) => {
           // console.log(snapshot.data())
         
            snapshot.docs.forEach(doc => {
              console.log(doc.id)
              console.log(doc.data())
              var incomedata = doc.data();
              incomedata.id = doc.id;
              incomedata.year = year
              incomedata_arr.push(incomedata);
            });
            console.log("In Else Incomes Data Array:::::::::::: ", incomedata_arr)

            this.setState({
      
              incomedata: incomedata_arr
            })
          })
      
        }
   
  

      });

 

    })



    //In Running State Query: Get userwise , All categoryName & CatDescription from categoriesAll collections 
    fire.firestore().collection('users').doc(userid).collection('CategoriesAll').get().then((snapshot) => {
      // console.log(snapshot.data())
      const categoryname = [];
      snapshot.docs.forEach(doc => {
        console.log(doc.id)
        console.log(doc.data())

        var name = doc.data().catName;
        categoryname.push(name);
      });
      // console.log("categoryname Arra:::::::::::: ", categoryname)

      this.setState({
        getCategoryName: categoryname
      })

    })

    //In running State Query: Get userwise , All crop yName & crop Description from crops collections 
    fire.firestore().collection('users').doc(userid).collection('crops').get().then((snapshot) => {
      // console.log(snapshot.data())
      const cropname = [];
      snapshot.docs.forEach(doc => {
        // console.log(doc.id)
        // console.log(doc.data())

        var name = doc.data().cropName;
        cropname.push(name);
      });
      //  console.log("cropname Arra:::::::::::: ", cropname)

      this.setState({
        getCropName: cropname
      })

    })

  };


  handleChange1 = (e) => {
    console.log(e.target.files[0])
    if (e.target.files[0]) {

      this.setState({
        image: e.target.files[0]

      })

    }
  }

  handleUpload = (e) => {

    console.log(this.state.image)

    let file = this.state.image;
    console.log(file.name)
    var storage = fire.storage();
    var storageRef = storage.ref();
    var uploadTask = storageRef.child('folder/' + file.name).put(file);
    uploadTask.on('state_changed', function (snapshot) {

      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, function (error) {
      console.log(error);
    }, function () {

      // Handle successful uploads on complete
      // For instance, get the download URL: https://firestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
        console.log('File available at', url);
       // Swal.fire("income added Successfully..!")
     //   window.location.reload(true)

        /*       if (url) {
               
                  this.state.downloadURL = url
                
              } */

      });

    });

  }

  resetForm() {
    document.getElementById("image").value = ""
    this.setState({
      categoryName: "",
      cropName: "",
      date: new Date(),
      incomeAmount: 0,
      incomeDescription: "",
      image: null,
      progress: 0,
      downloadURL: null
    });
  };

  render() {

    const fields = [
     /*  { key: 'id', _style:{color:'white'} }, */
      { key: 'categoryName', _style:{color:'white'} },
      { key: 'cropName', _style:{color:'white'} },
      { key: 'date', _style:{color:'white'} },
      { key: 'year', _style:{color:'white'} },
      { key: 'incomeAmount', _style:{color:'white'} },
      { key: 'incomeDescription', _style:{color:'white'} }
    ];


    return (
      <div>


        <div className="spinner"></div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Income</h4>
                  <p className="card-description"> Add Income Form </p>
                  <form className="forms-sample">
                    <Form.Group>
                      <label htmlFor="categoryname">Category Name</label>
                      <select
                        className="form-control"
                        style={{color:'white'}}
                        id="categoryname"
                        name="categoryName"
                        value={this.state.categoryName}
                        onChange={this.handleChange}>
                        <option  style={{color:'white'}} >-- Select --</option>
                        {
                          this.state.getCategoryName.map((option) => (
                            <option   style={{color:'black'}} value={option}>
                              {option}
                            </option>
                            // console.log(option)
                          )
                          )}
                      </select>
                    </Form.Group>
                    <Form.Group>
                      <label htmlFor="cropname">Crop Name</label>
                      <select className="form-control"
                        id="cropname"
                        name="cropName"
                        style={{color:'white'}}
                        value={this.state.cropName}
                        onChange={this.handleChange}>
                        <option  style={{color:'white'}}>-- Select --</option>
                        {
                          this.state.getCropName.map((option) => (
                            <option  style={{color:'black'}} value={option}>
                              {option}
                            </option>
                            // console.log(option)
                          )
                          )}
                      </select>
                    </Form.Group>

                    <Form.Group>
                      <label htmlFor="date">Select Date</label>
                      <Form.Control
                        type="date"
                        id="date"
                        name="date"
                        
                        value={this.state.date}
                        onChange={this.handleChange}
                        placeholder="Select Date ..." />
                    </Form.Group>

                    <Form.Group>
                      <label htmlFor="incomeamount">Enter Amount You have Spent</label>
                      <Form.Control type="text"
                        className="form-control"
                        id="incomeamount"
                        style={{color:'white'}}
                        name="incomeAmount"
                        value={this.state.incomeAmount}
                        onChange={this.handleChange}
                        placeholder="0.00 $" />
                    </Form.Group>
                    <Form.Group>
                      <label>Select Image</label>
                      <Form.Control
                        className="form-control"
                        type="file"
                        id="image"
                        name="image"
                        lang="es"
                        onChange={this.handleChange1}
                      />


                      <button type="submit" hidden={true} className="btn btn-primary mr-2" onClick={this.handleUpload}>Upload</button>


                    </Form.Group>

                    <Form.Group>
                      <label htmlFor="incomedescription">Describe the Incomes</label>
                      <textarea
                        className="form-control"
                        style={{color:'white'}}
                        id="incomedescription"
                        name="incomeDescription"
                        value={this.state.incomeDescription}
                        onChange={this.handleChange}
                        rows="4"
                        placeholder="write something ...">
                      </textarea>
                    </Form.Group>
                    <button type="submit" className="btn btn-primary mr-2" onClick={this.addIncomes}>Add Income</button>
                    <button type="submit" className="btn btn-dark mr-2" onClick={this.resetForm}>Cancel</button>
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
                <h4 className="card-firstName">Income Table</h4>
                <p className="card-description"> 
                </p>
                <div className="table-responsive">
     
                <CCard  >
              <CCardHeader>Available Year wise Incomes Data</CCardHeader>
              <CCardBody>
                  <CDataTable

                    items={this.state.incomedata}
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
                  </CCard>
          

                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    )
  }
}



export default Income




