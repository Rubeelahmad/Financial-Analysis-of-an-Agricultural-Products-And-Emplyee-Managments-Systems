import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import fire from '../../config/fire';
//import Swal from 'sweetalert2';
import bsCustomFileInput from 'bs-custom-file-input';


import "@coreui/coreui";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { Bar } from 'react-chartjs-2';



import {
  CDataTable,
  //CBadge,
  //CButton,
  //CCollapse,
  CCardHeader,
  CCard,
  CCardBody
} from '@coreui/react';

export class Expense extends Component {



  constructor(props) {
    console.log("Constructor")
    super(props);
    this.addExpenses = this.addExpenses.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.updatedTotalExpenseAndIncome = this.updatedTotalExpenseAndIncome.bind(this);
    this.resetForm.bind(this);
    this.generatePDF = this.generatePDF.bind(this);

    //this.signup = this.signup.bind(this);

    this.state = {
      categoryName: "",
      cropName: "",
      date: new Date(),
      expenseAmount: 0,
      expenseDescription: "",
      image: null,
      progress: 0,
      downloadURL: null,
      getCategoryName: [],
      getCropName: [],
      expensedata: [],
      showErrorText: ""


    }
  }


  data = {
    labels: "",

    datasets: [{
      label: 'Expense Amount',
      data: "",
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: "rgba(204, 204, 204,0.1)"
        }
      }],
      xAxes: [{
        gridLines: {
          color: "rgba(204, 204, 204,0.1)"
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }
  }


  //Update Total Expense & Income
  updatedTotalExpenseAndIncome(stateexpenseAmount) {
    const userid = localStorage.getItem('userid');
    var updatedtotalincome = 0
    var updatedtotalexpense = 0
    fire.firestore().collection('users').doc(userid).get().then((snapshot) => {
      console.log(snapshot.data().totalIncome)
      console.log(snapshot.data().totalExpense)
      console.log(stateexpenseAmount)

      updatedtotalexpense = parseInt(snapshot.data().totalExpense) + parseInt(stateexpenseAmount)
      updatedtotalincome = parseInt(snapshot.data().totalIncome)
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

  //yearly expense
  addYearlyExpense() {
    console.log("In Add Yearly Expense Function:::::")
    const userid = localStorage.getItem('userid');
    var stateexpenseAmount = this.state.expenseAmount
    if (stateexpenseAmount === "") {
      stateexpenseAmount = 0
    }
    //get selected year
    var selectedYear = new Date(this.state.date).getFullYear()
    console.log(selectedYear)
    console.log(userid)
    console.log(stateexpenseAmount)

    // Add YerlyExpense  Fields and updated Expensse accordingly
    fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).get().then((snapshot) => {
      // console.log(snapshot.exists)
      // console.log(snapshot.data().yearlyExpense)

      //snapshot.data().yearlyExpense !== undefined ||
      if (snapshot.exists === true) {

        console.log("IFFFFFFFFFFFFFFFFFFF")
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

        console.log(stateexpenseAmount)
        //console.log(this.state.incomeAmount)


        if (stateexpenseAmount > 0) {
          var updatedExpenseAmount = parseInt(yearlyExpense) + parseInt(stateexpenseAmount)
          fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).set({
            yearlyExpense: parseInt(updatedExpenseAmount),
            yearlyIncome: parseInt(yearlyIncome)
          }).then(() => {
            console.log("Sum of Toatl yearlyExpense updated as: " + updatedExpenseAmount)
            //Updated Total Expensse and Total Income
            this.updatedTotalExpenseAndIncome(stateexpenseAmount)
          })
        }
      }
      else {
        console.log("IN ELSEEEEEEEEEEEEEEEEEE")
        fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).set({
          yearlyExpense: parseInt(stateexpenseAmount),
          yearlyIncome: 0
        }).then(() => {

          console.log("Toatl yearlyExpense is updated")
          //Updated Total Expensse and Total Income
          this.updatedTotalExpenseAndIncome(stateexpenseAmount)


        })
      }

    }).then(() => {
      console.log("Toatl yearlyExpense is updated")
    }).catch((err) => {
      console.log("Error:")
      console.log(err)
    })


  }

  addExpenses(e) {
    e.preventDefault();
    this.addYearlyExpense()

    //get User Id
    const userid = localStorage.getItem('userid');
    //get selected year
    var selectedYear = new Date(this.state.date).getFullYear()
    console.log(selectedYear)
    console.log(userid)

    if (this.state.date !== "" && this.state.cropName !== "" && this.state.categoryName !== "") {
      fire.firestore().collection('users').doc(userid).collection('years').doc(selectedYear.toString()).collection('expenses').doc().set({
        categoryName: this.state.categoryName,
        cropName: this.state.cropName,
        date: new Date(this.state.date),
        expenseAmount: parseInt(this.state.expenseAmount),
        expenseDescription: this.state.expenseDescription

      }).then(() => {
        if (this.state.image) {

          this.handleUpload();
          this.resetForm();


        }
        else {
          this.resetForm()
          var success = "Success: Expense added Successfully..!";
          this.setState({
            showErrorText: success
          })
          // Swal.fire("Expense added Successfully..!")
          //   window.location.reload(true)

        }

      }).catch((err) => {
        console.log("In err: " + err)
      })
    }
    else {
      // Swal.fire("Some field(s) are missing...!!!")
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
      // console.log(snapshot.data())
    })

    // In running State Query: Get current user , Yearswise , yearlyIncome & Yearly Incomes 
    // And Fetching Year wise Expenses Data
    fire.firestore().collection('users').doc(userid).collection('years').get().then((snapshot) => {
      const expensedata_arr = [];
      var graphyear = [];
      var graphamount = [];
      var year_arr = []
      snapshot.docs.map(doc => {
        year_arr.push(doc.id)
        year_arr = year_arr.sort((a, b) => b - a)

      })
      // console.log(year_arr)
      year_arr.forEach(year => {
        if (year) {
          //Fetch Year wise Expense Data
          var totalAmount = 0;
          fire.firestore().collection('users').doc(userid).collection('years').doc(year).collection('expenses').orderBy("date", "desc").get().then((snapshot) => {

            snapshot.docs.forEach(doc => {
              var expensedata = doc.data();
              // console.log(expensedata)
              expensedata.id = doc.id;
              expensedata.year = year;
              expensedata_arr.push(expensedata);
              //handle amount for graph
              if (isNaN(expensedata.expenseAmount) || (expensedata.expenseAmount === undefined)) {
                expensedata.expenseAmount = 0;
              }
              totalAmount = parseInt(expensedata.expenseAmount) + parseInt(totalAmount);
            //  console.log("In foreach Total Amount: ", totalAmount)

            });

            console.log("totalAmount", totalAmount)
            graphamount.push(totalAmount)
            //handle year for graph
            if (!(graphyear.includes(year))) {
              graphyear.push(year)
            }

            console.log("this.data.labels", graphyear)
            this.data.labels = graphyear
            console.log("this.data.datasets[0].data", graphamount)
            this.data.datasets[0].data = graphamount
         //   console.log("this.data.datasets[0].data ", this.data.datasets[0].data)
            
            this.setState({
              expensedata: expensedata_arr
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
        // console.log(doc.id)
        // console.log(doc.data())

        var name = doc.data().catName;
        categoryname.push(name);
      });
      console.log("categoryname Arra:::::::::::: ", categoryname)

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
      console.log("cropname Arra:::::::::::: ", cropname)

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
        // Swal.fire("Expense added Successfully..!")
        //  window.location.reload(true)

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
      expenseAmount: 0,
      expenseDescription: "",
      image: null,
      progress: 0,
      downloadURL: null
    });
  };


  generatePDF = tickets => {
    // initialize jsPDF
    console.log(tickets)
    const doc = new jsPDF();

    // define the columns we want and their titles
    const tableColumn = ["categoryName", "cropName", "date", "Amount", "Description"];
    // define an empty array of rows


    const tableRows = [];

    // for each ticket pass all its data into an array
    tickets.forEach(ticket => {
      const ticketData = [
        ticket.categoryName,
        ticket.cropName,
        format(new Date(ticket.date), "dd-MM-yyyy"),
        ticket.expenseAmount,
        ticket.expenseDescription,

        // called date-fns to format the date on the ticket
        // format(new Date(ticket.updated_at), "dd-MM-yyyy")
      ];
      // push each tickcet's info into a row
      tableRows.push(ticketData);
    });


    // startY is basically margin-top
    doc.autoTable(tableColumn, tableRows, { startY: 40 });
    const date = new Date();
    console.log("Date: ", date)
    // we use a date string to generate our filename.
    // ticket title. and margin-top + margin-left
    doc.text("Available Expense's Data Report", 60, 30);
    // we define the name of our PDF file.
    doc.save(`Expense_Report_${date.getTime()}.pdf`);
  };


  render() {

    const fields = [
      { key: 'categoryName', _style: { color: 'white' } },
      { key: 'cropName', _style: { color: 'white' } },
      { key: 'date', _style: { color: 'white' } },
      { key: 'year', _style: { color: 'white' } },
      { key: 'expenseAmount', _style: { color: 'white' } },
      { key: 'expenseDescription', _style: { color: 'white' } }
    ];




    return (

      <div>

        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Expense</h4>
                  <p className="card-description"> Add Expense Form </p>
                  <form className="forms-sample" >
                    <Form.Group>
                      <label htmlFor="categoryname">Category Name</label>
                      <select
                        className="form-control"
                        id="categoryname"
                        name="categoryName"
                        style={{ color: 'white' }}
                        value={this.state.categoryName}
                        onChange={this.handleChange}>
                        <option style={{ color: 'white' }}>-- Select --</option>
                        {
                          this.state.getCategoryName.map((option , idx) => (
                            <option style={{ color: 'black' }} value={option} key={idx}>
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
                        style={{ color: 'white' }}
                        value={this.state.cropName}
                        onChange={this.handleChange}>
                        <option style={{ color: 'white' }} >-- Select --</option>
                        {
                          this.state.getCropName.map((option , idx) => (
                            <option style={{ color: 'black' }} value={option} key= {idx}>
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
                        style={{ color: 'white' }}
                        id="date"
                        name="date"
                        value={this.state.date}
                        onChange={this.handleChange}
                        placeholder="Select Date ..." />
                    </Form.Group>

                    <Form.Group>
                      <label htmlFor="expenseamount">Enter Amount You have Spent</label>
                      <Form.Control type="text"
                        style={{ color: 'white' }}
                        className="form-control"
                        id="expenseamount"
                        name="expenseAmount"
                        value={this.state.expenseAmount}
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


                      {/* Progress: {this.state.progress} % */}
                      <button type="submit" hidden={true} className="btn btn-primary mr-2" onClick={this.handleUpload}>Upload</button>


                    </Form.Group>

                    <Form.Group>
                      <label htmlFor="expensedescription">Describe the Expenses</label>
                      <textarea
                        className="form-control"
                        style={{ color: 'white' }}
                        id="expensedescription"
                        name="expenseDescription"
                        value={this.state.expenseDescription}
                        onChange={this.handleChange}
                        rows="4"
                        placeholder="write something ...">
                      </textarea>
                    </Form.Group>
                    <button type="submit" className="btn btn-primary mr-2" onClick={this.addExpenses} >Add Expense</button>
                    <button type="submit" className="btn btn-dark mr-2" onClick={this.resetForm}>Cancel</button>
                    {' '}<label type="text" style={{ color: 'red' }}>{this.state.showErrorText}</label>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="d-flex justify-content-center auth px-0">
          <div className="row w-50 mx-0">
            <div className="col-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Expenses Graph</h4>
                  <Bar data={this.data} options={this.options} redraw />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/*        <div className="row" id="pdfdiv" Component={Paper} > */}
        <div className="row" >

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-firstName">Expense Table</h4>
                <p className="card-description"> Available Year wise Expenses Data
                </p>
                <div className="table-responsive">

                  <CCard  >

                    <CCardHeader>Available Year wise Expense Data</CCardHeader>
                    <CCardBody>
                      <CDataTable

                        items={this.state.expensedata}
                        fields={fields}
                        itemsPerPageSelect
                        itemsPerPage={5}
                        pagination={true}
                        tableFilter={true}
                        sorter={true}
                        _style
                        border={true}
                        responsive={true}
                        outlined={true}
                        footer={true}

                      />

                    </CCardBody>

                    <div className="col-md-12 d-flex justify-content-center ">
                      <button className="btn btn-primary " onClick={() => this.generatePDF(this.state.expensedata)}>generate pdf
                      </button>
                    </div>
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


export default Expense




