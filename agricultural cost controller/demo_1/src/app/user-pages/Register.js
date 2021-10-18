import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fire from '../../config/fire';

export class Register extends Component {

  constructor(props){
    console.log("In constructor")
    super(props);
    //this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this)
    this.signup = this.signup.bind(this);

    this.state  = {
      email : "",
      password : ""
    }
  }
 /*  login(e){
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
      console.log(u)
    }).catch((err)=>{
      console.log(err)
    })
  } */
  signup(e){
    e.preventDefault();
    
    fire.auth().createUserWithEmailAndPassword(this.state.email , this.state.password)
    .then((u)=>{
      console.log(u)
      console.log(u.uid)
      // Add toatlExpense & totalIncome Fields and intialize them with 0
      fire.firestore().collection('users').doc(u.uid).set({
        totalExpense: 0,
        totalIncome:0
  
      }).then(() =>{
        console.log("Toatl Expense & Income Fields Created and set to 0")
      }).catch((err)=>{
        console.log(err)
      })

    }).catch((err)=>{
      console.log(err)
    })
  }
  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  componentDidMount(){

    console.log("In component Did Mount")
  
  }

  render() {
    console.log("In Render")
    return (
      <div>
        <div className="d-flex align-items-center auth px-0 h-100">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo.svg")} alt="logo" />
                </div>
                <h4>New here?</h4>
                <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                <form className="pt-3">
                {/*   <div className="form-group">
                    <input type="text" className="form-control form-control-lg" id="exampleInputUsername1" placeholder="Username" />
                  </div> */}
                  <div className="form-group">
                    {/* <input type="email" className="form-control form-control-lg" id="exampleInputEmail1" placeholder="Email" /> */}
                   <input type="email" 
                    id="email" 
                    name="email"
                    placeholder="Email" 
                    onChange={this.handleChange}
                    value={this.state.email}
                    size="lg" 
                    className="form-control h-auto" />

                  </div>
           {/*        <div className="form-group">
                    <select className="form-control form-control-lg" id="exampleFormControlSelect2">
                      <option>Country</option>
                      <option>United States of America</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Germany</option>
                      <option>Argentina</option>
                    </select>
                  </div> */}
                  <div className="form-group">
                   {/*  <input type="password" className="form-control form-control-lg" id="exampleInputPassword1" placeholder="Password" /> */}
                  <input type="password" 
                    id="password" 
                    name="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.password}
                     size="lg" 
                     className="form-control h-auto" />
                  </div>
                  <div className="mb-4">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                        <i className="input-helper"></i>
                        I agree to all Terms & Conditions
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">
                  <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={this.signup}>Signup</button>

                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    Already have an account? <Link to="/user-pages/login" className="text-primary">Login</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register
