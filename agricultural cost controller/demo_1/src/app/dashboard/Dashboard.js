import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import fire from '../../config/fire';
import Modal from 'react-bootstrap/Modal'
import 'bootstrap';
import '@coreui/coreui';
/* import { query, where , orderBy} from "../../config/fire";   */



import {
  CDataTable,
  //CBadge,
  //CButton,
  //CCollapse,
  CCardHeader,
  CCard,
  CCardBody
} from '@coreui/react';
import DatePicker from 'react-datetime-picker';



export class Dashboard extends Component {

  constructor(props) {
    console.log("Constructor")
    super(props)

    // this.abc.bind(this);
    this.setShowIncomeModal = this.setShowIncomeModal.bind(this);
    this.setShowExpenseModal = this.setShowExpenseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchIncome = this.searchIncome.bind(this);
    this.searchExpense = this.searchExpense.bind(this);

    this.state = {
      gettotalExpense: 0,
      gettotalIncome: 0,
      totalprofit: 0,
      profitpercentage: 0,
      incomedata: [],
      expensedata: [],
      ShowIncomeModal: false,
      ShowExpensseModal: false,
      startdate: new Date(),
      enddate: new Date(),
      categoryName: "",
      cropName: "",
      getCategoryName: [],
      getCropName: [],

    }

  }



  transactionHistoryData = {
    labels: ["Profit"],
    datasets: [{
      data: [78, 85, 90],
      backgroundColor: [
        "#111111", "#00d25b", "#ffab00"
      ]
    }
    ]
  };

  transactionHistoryOptions = {
    responsive: true,
    maintainAspectRatio: true,
    segmentShowStroke: false,
    cutoutPercentage: 70,
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  }

  sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  componentDidMount() {
    console.log("In Component DID Mount ")

    //Get userwise , All crop yName & crop Description from crops collections 
    const userid = localStorage.getItem('userid');
    //In running State Quer: Get total Income & Expense of current user and update its profit
    fire.firestore().collection('users').doc(userid).get().then((snapshot) => {
      if (snapshot.exists) {
        var totalExpense = parseInt(snapshot.data().totalExpense)
        var totalIncome = parseInt(snapshot.data().totalIncome)

        console.log(totalIncome)
        console.log(totalExpense)

        var profit = parseInt(totalIncome) - parseInt(totalExpense);
        console.log(profit)
        var profitInPercentage = ((parseInt(profit) / parseInt(totalIncome)) * 100);
        console.log("profitInPercentage:::::::::::: ", parseInt(profitInPercentage))

        if (isNaN(profitInPercentage)) {
          profitInPercentage = 0
        }
        this.setState({
          gettotalExpense: parseInt(totalExpense),
          gettotalIncome: parseInt(totalIncome),
          totalprofit: parseInt(profit),
          profitpercentage: parseInt(profitInPercentage)
        })
      }
      else {

        fire.firestore().collection('users').doc(userid).set({
          totalExpense: 0,
          totalIncome: 0

        }).then(() => {
          console.log("Toatl Expense & Income Fields Created and set to 0")
        }).catch((err) => {
          console.log(err)
        })

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
              //   incomedata.id = doc.id;
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


    // In running State Query: Get current user , Yearswise , yearlyIncome & Yearly Incomes 
    // And Fetching Year wise Expenses Data
    fire.firestore().collection('users').doc(userid).collection('years').get().then((snapshot) => {
      console.log(snapshot)
      const expensedata_arr = [];
      snapshot.docs.forEach(doc => {
        //Year
        var year = doc.id
        console.log(year)
        //Yearly Income and Yearly Expense
        console.log(doc.data())

        if (year) {
          //Fetch Year wise Expense Data
          fire.firestore().collection('users').doc(userid).collection('years').doc(year).collection('expenses').get().then((snapshot) => {
            // console.log(snapshot.data())

            snapshot.docs.forEach(doc => {
              //   console.log(doc.id)
              //   console.log(doc.data())

              var expensedata = doc.data();
              //     expensedata.id = doc.id;
              expensedata.year = year
              expensedata_arr.push(expensedata);
            });
            console.log("Expense Data Array :::::::::::: ", expensedata_arr)

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

  }

  setShowIncomeModal(value) {

    this.setState({
      ShowIncomeModal: value
    })
  }

  setShowExpenseModal(value) {

    this.setState({
      ShowExpensseModal: value
    })
  }

  handleEntailmentRequest(e) {
    // e.preventDefault();

    window.location.reload(true)
    console.log("handle request ");
  }





  handleChange(e) {
    console.log("Hellol:::::::::::::::: ", e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    })

  }


  searchIncome(e) {

    e.preventDefault();

    const userid = localStorage.getItem('userid');
    var crop = this.state.cropName;
    var category = this.state.categoryName;

    var start = new Date(this.state.startdate)
    var end = new Date(this.state.enddate)
    var startYear = new Date(this.state.startdate).getFullYear()
    var endYear = new Date(this.state.enddate).getFullYear()

    var incomedata_arr = []
    console.log("startYear", startYear)
    console.log("endYear", endYear)
    console.log(crop)
    console.log(category)
    console.log(start)
    console.log(end)

    if (startYear === endYear) {
      incomedata_arr = []
      var timeRefStartEnd = fire.firestore().collection('users').doc(userid).collection('years').doc(startYear.toString()).collection('incomes');
      timeRefStartEnd.where("date", ">=", new Date(start)).get().then(snapshot => {
        //pass your 'data' here
        console.log(snapshot.docs)

        snapshot.docs.forEach(doc => {
          console.log(doc.data())
          var incomedata = doc.data();
          if (crop === "-- All --") {
            crop = ""
          }
          else if (category === "-- All --") {
            category = ""
          }

          if (crop !== "" || category !== "") {
            console.log(crop)
            console.log(category)
            if (doc.data().categoryName === category || doc.data().cropName === crop) {

              //   incomedata.id = doc.id;
              incomedata.year = startYear.toString()
              incomedata_arr.push(incomedata);
            }
            else {
        
            }

          }
          else {

            incomedata.year = startYear.toString()
            incomedata_arr.push(incomedata);
          }

        });

        console.log("In IF before then Incomes Data Array:::::::::::: ", incomedata_arr)

        this.setState({

          incomedata: incomedata_arr
        })

      })/* .then(() => {

        timeRefStartEnd.where("date", "<=", new Date(end)).get().then(snapshot => {
          //pass your 'data' here
          console.log(snapshot.docs)

          snapshot.docs.forEach(doc => {
            console.log(doc.id)
            console.log(doc.data())
            var incomedata = doc.data();

            if (crop === "-- All --") {
              crop = ""
            }
            else if (category === "-- All --") {
              category = ""
            }

            if (crop !== "" || category !== "") {
              console.log(crop)
              console.log(category)
              if (doc.data().categoryName === category || doc.data().cropName === crop) {
                  
                incomedata.year = endYear.toString()
                incomedata_arr.push(incomedata);
              }
            
              }

            }
            else {
              console.log(incomedata.cropName)
              if(incomedata_arr.includes(incomedata.cropName)=== false)
              {
                incomedata.year = endYear.toString()
                incomedata_arr.push(incomedata);
                console.log("Not Include")
              }
              else
              {
                console.log("Already Includes")
              }

    
            }



          });

          console.log("In IF after then Incomes Data Array:::::::::::: ", incomedata_arr)


          this.setState({

            incomedata: incomedata_arr
          })

        })

      }) */
    }
    else {
      incomedata_arr = []
      var timeRefStart = fire.firestore().collection('users').doc(userid).collection('years').doc(startYear.toString()).collection('incomes');
      timeRefStart.where("date", ">=", new Date(start)).get().then(snapshot => {

        snapshot.docs.forEach(doc => {
          console.log(doc.data())
          var incomedata = doc.data();



          if (crop === "-- All --") {
            crop = ""
          }
          else if (category === "-- All --") {
            category = ""
          }

          if (crop !== "" || category !== "") {
            console.log(crop)
            console.log(category)
            if (doc.data().categoryName === category || doc.data().cropName === crop) {

              incomedata.year = startYear.toString()
              incomedata_arr.push(incomedata);
            }
            else {
              /*       var error_lbl = "Not Found"
                   this.setState({
                     label : error_lbl
                   }) */
            }

          }
          else {

            incomedata.year = startYear.toString()
            incomedata_arr.push(incomedata);
          }



        });
        console.log("In Else before then Incomes Data Array:::::::::::: ", incomedata_arr)


      }).then(() => {


        var timeRefEnd = fire.firestore().collection('users').doc(userid).collection('years').doc(endYear.toString()).collection('incomes');
        timeRefEnd.where("date", "<=", new Date(end)).get().then(snapshot => {
          console.log(snapshot.docs)
          snapshot.docs.forEach(doc => {
            console.log(doc.data())
            var incomedata = doc.data();





            if (crop === "-- All --") {
              crop = ""
            }
            else if (category === "-- All --") {
              category = ""
            }

            if (crop !== "" || category !== "") {
              console.log(crop)
              console.log(category)
              if (doc.data().categoryName === category || doc.data().cropName === crop) {

                incomedata.year = endYear.toString()
                incomedata_arr.push(incomedata);
              }
              else {
                /*       var error_lbl = "Not Found"
                     this.setState({
                       label : error_lbl
                     }) */
              }

            }
            else {


              incomedata.year = endYear.toString()
              incomedata_arr.push(incomedata);
            }



          });
          console.log("In Else Incomes after then incomes Data Array:::::::::::: ", incomedata_arr)

          this.setState({

            incomedata: incomedata_arr
          })

        })

      });
    }


  }




  searchExpense(e) {

    e.preventDefault();

    const userid = localStorage.getItem('userid');
    var crop = this.state.cropName;
    var category = this.state.categoryName;

    var start = new Date(this.state.startdate)
    var end = new Date(this.state.enddate)
    var startYear = new Date(this.state.startdate).getFullYear()
    var endYear = new Date(this.state.enddate).getFullYear()

    var expensedata_arr = []
    console.log("startYear", startYear)
    console.log("endYear", endYear)
    console.log(crop)
    console.log(category)
    console.log(start)
    console.log(end)

    if (startYear === endYear) {
      expensedata_arr = []
      var timeRefStartEnd = fire.firestore().collection('users').doc(userid).collection('years').doc(startYear.toString()).collection('expenses');
      timeRefStartEnd.where("date", ">=", new Date(start)).get().then(snapshot => {
        //pass your 'data' here
        console.log(snapshot.docs)

        snapshot.docs.forEach(doc => {
          console.log(doc.id)
          console.log(doc.data())
          var expensedata = doc.data();
          if (crop === "-- All --") {
            crop = ""
          }
          else if (category === "-- All --") {
            category = ""
          }

          if (crop !== "" || category !== "") {
            console.log(crop)
            console.log(category)
            if (doc.data().categoryName === category || doc.data().cropName === crop) {

              expensedata.year = startYear.toString()
              expensedata_arr.push(expensedata);
            }
            else {
              //
            }

          }
          else {


            expensedata.year = startYear.toString()
            expensedata_arr.push(expensedata);
          }

        });
        console.log("In IF expensedata Data Array:::::::::::: ", expensedata_arr)
        this.setState({

          expensedata: expensedata_arr
        })


      })/* .then(() => {

        timeRefStartEnd.where("date", "<=", new Date(end)).get().then(snapshot => {
          //pass your 'data' here
          console.log(snapshot.docs)

          snapshot.docs.forEach(doc => {
            console.log(doc.id)
            console.log(doc.data())
            var expensedata = doc.data();

            if (crop === "-- All --") {
              crop = ""
            }
            else if (category === "-- All --") {
              category = ""
            }

            if (crop !== "" || category !== "") {
              console.log(crop)
              console.log(category)
              if (doc.data().categoryName === category || doc.data().cropName === crop) {
                expensedata.year = endYear.toString()
                expensedata_arr.push(expensedata);
              }
              else {
                //
              }

            }
            else {
              expensedata.year = endYear.toString()
              expensedata_arr.push(expensedata);
            }

          });
          console.log("In IF then Incomes Data Array:::::::::::: ", expensedata_arr)


          this.setState({

            expensedata: expensedata_arr
          })

        })
         })
 */
     
    }
    else {
      expensedata_arr = []
      var timeRefStart = fire.firestore().collection('users').doc(userid).collection('years').doc(startYear.toString()).collection('expenses');
      timeRefStart.where("date", ">=", new Date(start)).get().then(snapshot => {

        snapshot.docs.forEach(doc => {
          console.log(doc.data())
          var expensedata = doc.data();

          if (crop === "-- All --") {
            crop = ""
          }
          else if (category === "-- All --") {
            category = ""
          }

          if (crop !== "" || category !== "") {
            console.log(crop)
            console.log(category)
            if (doc.data().categoryName === category || doc.data().cropName === crop) {
              expensedata.year = startYear.toString()
              expensedata_arr.push(expensedata);
            }
            else {
              //
            }

          }
          else {
            expensedata.year = startYear.toString()
            expensedata_arr.push(expensedata);
          }



        });
        console.log("In Else before then Incomes Data Array:::::::::::: ", expensedata_arr)


      }).then(() => {


        var timeRefEnd = fire.firestore().collection('users').doc(userid).collection('years').doc(endYear.toString()).collection('expenses');
        timeRefEnd.where("date", "<=", new Date(end)).get().then(snapshot => {
          console.log(snapshot.docs)
          snapshot.docs.forEach(doc => {
            console.log(doc.data())
            var expensedata = doc.data();

            if (crop === "-- All --") {
              crop = ""
            }
            else if (category === "-- All --") {
              category = ""
            }

            if (crop !== "" || category !== "") {
              console.log(crop)
              console.log(category)
              if (doc.data().categoryName === category || doc.data().cropName === crop) {
                expensedata.year = endYear.toString()
                expensedata_arr.push(expensedata);
              }
              else {
                //
              }

            }
            else {
              expensedata.year = endYear.toString()
              expensedata_arr.push(expensedata);
            }

          });
          console.log("In Else Incomes after then incomes Data Array:::::::::::: ", expensedata_arr)

          this.setState({

            expensedata: expensedata_arr
          })

        })

      });
    }


  }

  render() {
    const incomefields = [
      /* { key: 'id',  _style:{color:'white'} }, */
      { key: 'categoryName', _style: { color: 'white' } },
      { key: 'cropName', _style: { color: 'white' } },
      { key: 'date', _style: { color: 'white' } },
      { key: 'year', _style: { color: 'white' } },
      { key: 'incomeAmount', _style: { color: 'white' } },
      { key: 'incomeDescription', _style: { color: 'white' } }
    ];
    const expensefields = [
      /* { key: 'id',  _style:{color:'white'} }, */
      { key: 'categoryName', _style: { color: 'white' } },
      { key: 'cropName', _style: { color: 'white' } },
      { key: 'date', _style: { color: 'white' } },
      { key: 'year', _style: { color: 'white' } },
      { key: 'expenseAmount', _style: { color: 'white' } },
      { key: 'expenseDescription', _style: { color: 'white' } }
    ];


    const { startdate } = this.state;
    const { enddate } = this.state;

    return (

      <div>
        <div className="row justify-content-center">
          <div className="col-md-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Profit </h4>
                <div className="aligner-wrapper">
                  <Doughnut data={this.transactionHistoryData} options={this.transactionHistoryOptions} />
                  <div className="absolute center-content">
                    <h5 className="font-weight-normal text-whiite text-center mb-2 text-white">{this.state.profitpercentage}%</h5>
                    <p className="text-small text-muted text-center mb-0">Total</p>
                  </div>
                </div>
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Total Profit</h6>
                    {/* <p className="text-muted mb-0">07 Jan 2019, 09:12AM</p> */}
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">${this.state.totalprofit}</h6>
                  </div>
                </div>

              </div>
            </div>
          </div>


        </div>
        <div className="row">
          <div className="col-sm-4 grid-margin">
            <div className="card" onClick={this.setShowExpenseModal}>
              <div className="card-body">
                <h5>Expenses</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">${this.state.gettotalExpense} </h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium"></p>
                    </div>
                    {/* <h6 className="text-muted font-weight-normal">Since last Year</h6> */}
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-codepen text-primary ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-4 grid-margin">
            <div className="card" onClick={this.setShowIncomeModal}>
              <div className="card-body">
                <h5>Income</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">${this.state.gettotalIncome}</h2>
                      <p className="text-success ml-2 mb-0 font-weight-medium"></p>
                    </div>
                    {/* <h6 className="text-muted font-weight-normal">Since last Year</h6> */}
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-wallet-travel text-danger ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4 grid-margin">
            <div className="card">
              <div className="card-body">
                <h5>Profit</h5>
                <div className="row">
                  <div className="col-8 col-sm-12 col-xl-8 my-auto">
                    <div className="d-flex d-sm-block d-md-flex align-items-center">
                      <h2 className="mb-0">${this.state.totalprofit}</h2>
                      <p className="text-danger ml-2 mb-0 font-weight-medium"></p>
                    </div>
                    {/* <h6 className="text-muted font-weight-normal">Since last month</h6> */}
                  </div>
                  <div className="col-4 col-sm-12 col-xl-4 text-center text-xl-right">
                    <i className="icon-lg mdi mdi-monitor text-success ml-auto"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <Modal
          show={this.state.ShowIncomeModal}
          onHide={this.setShowIncomeModal}

          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton >
            <Modal.Title id="example-custom-modal-styling-title">
              Total Income:  ${this.state.gettotalIncome}
            </Modal.Title>


          </Modal.Header>
          <Modal.Body>

            <div className="row">

              <div className="col-md-12 grid-margin stretch-card">

                <div className="card">
                  <div className="card-body">

                    <div className="row">
                      <div className="col-md-2"></div>
                      <div className="col-md-2">
                        <label>Category Name123:</label>


                        <select
                          className="form-control"
                          style={{ color: 'white' }}
                          id="categoryname"
                          name="categoryName"
                          value={this.state.categoryName}
                          onChange={this.handleChange}>
                          <option style={{ color: 'white' }} >-- All --</option>
                          {
                            this.state.getCategoryName.map((option) => (
                              <option style={{ color: 'black' }} value={option}>
                                {option}
                              </option>
                              // console.log(option)
                            )
                            )}
                        </select>


                      </div>
                      <div className="col-md-2">
                        <label>Crop Name: </label>

                        <select className="form-control"
                          id="cropname"
                          name="cropName"
                          style={{ color: 'white' }}
                          value={this.state.cropName}
                          onChange={this.handleChange}>
                          <option style={{ color: 'white' }}>-- All --</option>
                          {
                            this.state.getCropName.map((option) => (
                              <option style={{ color: 'black' }} value={option}>
                                {option}
                              </option>
                              // console.log(option)
                            )
                            )}
                        </select>

                      </div>
                      <div className="col-md-2">
                        <label>From: </label>
                        <div className="text-white bg-light ">

                          <DatePicker

                            data-enable-time
                            value={startdate}
                            onChange={startdate => {
                              this.setState({ startdate });
                            }}
                          />

                        </div>
                      </div>
                      <div className="col-md-2">
                        <label>To: </label>
                        <div className="text-white bg-light ">

                          <DatePicker
                            data-enable-time
                            value={enddate}
                            onChange={enddate => {
                              this.setState({ enddate });
                            }}
                          />

                        </div>
                      </div>
                    </div>
                    <br /><br />
                    <div className="col-md-12">
                      <div className="row justify-content-center">
                        <button className="btn btn-primary" onClick={this.searchIncome} >Search</button>
                      </div>
                    </div>

                    <br />


                    <h3 className="card-firstName">Income's Details</h3>
                    <p className="card-description">
                    </p>

                    <div className="table-responsive">

                      <CCard  >
                        <CCardHeader>Available Year wise Incomes Data</CCardHeader>
                        <CCardBody>

                          <CDataTable

                            items={this.state.incomedata}
                            fields={incomefields}
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


          </Modal.Body>
          <Modal.Footer >
            <button className="btn btn-danger btn-sm font-weight-medium float-right" onClick={this.handleEntailmentRequest}>Close</button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.ShowExpensseModal}
          onHide={this.setShowExpenseModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Total Expense:  ${this.state.gettotalExpense}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">

              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">


                    <div className="row">
                      <div className="col-md-2"></div>
                      <div className="col-md-2">
                        <label>Category Name: </label>

                        <select
                          className="form-control"
                          style={{ color: 'white' }}
                          id="categoryname"
                          name="categoryName"
                          value={this.state.categoryName}
                          onChange={this.handleChange}>
                          <option style={{ color: 'white' }} >-- All --</option>
                          {
                            this.state.getCategoryName.map((option) => (
                              <option style={{ color: 'black' }} value={option}>
                                {option}
                              </option>
                              // console.log(option)
                            )
                            )}
                        </select>

                      </div>
                      <div className="col-md-2">
                        <label>Crop Name: </label>
                        <select className="form-control"
                          id="cropname"
                          name="cropName"
                          style={{ color: 'white' }}
                          value={this.state.cropName}
                          onChange={this.handleChange}>
                          <option style={{ color: 'white' }}>-- All --</option>
                          {
                            this.state.getCropName.map((option) => (
                              <option style={{ color: 'black' }} value={option}>
                                {option}
                              </option>
                              // console.log(option)
                            )
                            )}
                        </select>


                      </div>
                      <div className="col-md-2">
                        <label>From: </label>
                        <div className="text-white bg-light ">

                          <DatePicker
                            data-enable-time
                            value={startdate}
                            onChange={startdate => {
                              this.setState({ startdate });
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <label>To: </label>
                        <div className="text-white bg-light ">

                          <DatePicker bg-red
                            data-enable-time
                            value={enddate}
                            onChange={enddate => {
                              this.setState({ enddate });
                            }}
                          />

                        </div>
                      </div>
                    </div>
                    <br /><br />
                    <div className="col-md-12">
                      <div className="row justify-content-center">
                        <button className="btn btn-primary" onClick={this.searchExpense}>Search</button>
                      </div>
                    </div>

                    <br />

                    <h3 className="card-firstName">Expense's Details</h3>
                    <p className="card-description">
                    </p>
                    <div className="table-responsive">

                      <CCard  >
                        <CCardHeader>Available Expense Data</CCardHeader>
                        <CCardBody>
                          <CDataTable

                            items={this.state.expensedata}
                            fields={expensefields}
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


          </Modal.Body>
          <Modal.Footer >
            <button className="btn btn-danger btn-sm font-weight-medium float-right" onClick={this.handleEntailmentRequest}>Close</button>
          </Modal.Footer>
        </Modal>

      </div>

    );
  }


}

export default Dashboard;