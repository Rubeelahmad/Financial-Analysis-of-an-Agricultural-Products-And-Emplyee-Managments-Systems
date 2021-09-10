import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import fire from '../../config/fire';
//import Swal from 'sweetalert2';

import "@coreui/coreui";

import {CDataTable,
  //CBadge,
  //CButton,
  //CCollapse,
  CCardHeader,
  CCard,
  CCardBody
  } from '@coreui/react';




export class Category extends Component {

    
    constructor(props){


   
        super(props);
        this.addCategory = this.addCategory.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.resetForm = this.resetForm.bind(this);
        //this.signup = this.signup.bind(this);
      
        this.state  = {
          catName : "",
          categoryDescription : "",
          data: [],
          details: "",
          categorydata: [],
          showErrorText: ""
        }
      }
    
      addCategory (e){
        e.preventDefault();
    
        //get User Id
        const userid = localStorage.getItem('userid');
       // console.log(userid)

       var categoryname = this.state.catName
       var categorydescription = this.state.categoryDescription
       if(categoryname)
       {
        var categoryexists = false;
           if(categorydescription === "")
           {
            categorydescription = "-"
           }



      
           fire.firestore().collection('users').doc(userid).collection('CategoriesAll').get().then((snapshot) => {
        

            snapshot.docs.forEach(doc => {
       
              //Yearly Income and Yearly Expense
              console.log(doc.data().catName)
              if(categoryname === doc.data().catName)
              {
                categoryexists = true
                console.log("exits")
                var err = "Error: Category Name Already  Exists.";
                this.setState({
                  showErrorText: err
                })
               // Swal.fire("Category Name Already  Exists.")
              }
            
            });
           
            console.log(categoryexists)
            if(categoryexists)
            {
              //do nothing
              console.log("Do not add category")
            }
            else
            {
              console.log("add category")
  
        fire.firestore().collection('users').doc(userid).collection('CategoriesAll').doc().set({
            catName: categoryname,
            categoryDescription: categorydescription
    
        }).then(()=> {
          console.log("Success: ")
          this.setState({
            catName : "",
            categoryDescription : ""
          })
      //   Swal.fire("Category added Successfully..!")
         window.location.reload(true)
        }).catch((err)=>{
          console.log("Error: " + err)
        //  Swal.fire(err);
        })
      }
    })
       }
       else
       {
        var err = "Error: Please enter the category name..!";
        this.setState({
          showErrorText: err
        })
      //  Swal.fire("Please enter the category name..!")
       }
    
       
      }
    
      
  resetForm(e){
      e.preventDefault()

    this.setState({
         catName : "",
         categoryDescription : ""

    })
  }

      handleChange(e){
        this.setState({
          [e.target.name] : e.target.value
        })
      }
    
    componentDidMount() {

        console.log("Add Categories ComponentAll")

       // bsCustomFileInput.init()

       const userid = localStorage.getItem('userid');
       fire.firestore().collection('users').doc(userid).collection('CategoriesAll').get().then((snapshot) => {
        // console.log(snapshot.data())
        const categorydata_arr = [];
        snapshot.docs.forEach(doc => {
        //   console.log(doc.id)
        //   console.log(doc.data())
  
          var categorydata = doc.data();
        //  categorydata.id  = doc.id;
          categorydata_arr.push(categorydata);
        });
        console.log("categoryname Arra:::::::::::: ", categorydata_arr)
  
        this.setState({
      
          categorydata : categorydata_arr
        }) 
  
      })

    };

    render() {
     


                  

          
          const fields = [
    /*         {key: 'id', _style: {}}, */
            {key: 'catName', _style:{color:'white'} },
            {key: 'categoryDescription' , _style:{color:'white'}  }
         /*    {key: 'role', _style: {}},
            {key: 'status', _style: {}},
            {key: 'action', sorter: false, filter: false, _style: {width: '15%'}} */
          ]; 

        return (
            <div>
               
                <div className="d-flex align-items-center auth px-0">
                    <div className="row w-100 mx-0">
                        <div className="col-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-firstName">Category</h4>
                                    <p className="card-description"> Add Category Form </p>

                                    <form className="forms-sample">
                                        <Form.Group>
                                            <label htmlFor="catname">Category Name</label>
                                            <Form.Control 
                                            style={{color:'white'}}
                                            type="text" 
                                            className="form-control" 
                                            id="catename" 
                                            name="catName" 
                                            value = {this.state.catName}
                                            onChange={this.handleChange}
                                            placeholder="category name ..." />
                                        </Form.Group>
                                        <Form.Group>
                                            <label htmlFor="categorydescription">Describe the Category</label>
                                            <textarea 
                                              style={{color:'white'}}
                                            className="form-control" 
                                            id="categorydescription" 
                                            name="categoryDescription" 
                                            value = {this.state.categoryDescription}
                                            onChange={this.handleChange}
                                            rows="4"
                                            placeholder="write something ..."></textarea>
                                        </Form.Group>
                                        <button type="submit" className="btn btn-primary mr-2" onClick={this.addCategory}>Add Category</button>
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
                <h4 className="card-firstName">Categories Table</h4>
                <p className="card-description"> 
                </p>
                <div className="table-responsive">
                
                <CCard  >
              <CCardHeader>Available Categories Data</CCardHeader>
              <CCardBody>
            
<CDataTable
  
      items = {this.state.categorydata}
      fields = {fields}
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



export default Category




