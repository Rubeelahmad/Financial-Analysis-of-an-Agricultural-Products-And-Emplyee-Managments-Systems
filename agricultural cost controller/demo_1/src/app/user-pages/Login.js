import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import fire from '../../config/fire';



export class Login extends Component {

constructor(props){
  super(props);
  this.login = this.login.bind(this);
  this.handleChange = this.handleChange.bind(this)
  //this.signup = this.signup.bind(this);

  this.state  = {
    email : "",
    password : ""
  }
}

login(e){
  e.preventDefault();
  fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password ).then((u)=>{
 /*    console.log(u)
    console.log(u.email)
    console.log(u.uid) */
  }).catch((err)=>{
    console.log(err)
  })
}
/* signup(e){
  e.preventDefault();
  fire.auth().createUserWithEmailAndPassword(this.state.email , this.state.password)
  .then((u)=>{
    console.log(u)
  }).catch((err)=>{
    console.log(err)
  })
} */
handleChange(e){
  this.setState({
    [e.target.name] : e.target.value
  })
}


  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo.svg")} alt="logo" />
                </div>
                <h4>Welcome to Agriculture</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="Email" 
                    onChange={this.handleChange}
                    value={this.state.email}
                    size="lg" 
                    className="h-auto" />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control 
                    type="password" 
                    id="password" 
                    name="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    value={this.state.password}
                     size="lg" 
                     className="h-auto" />
                  </Form.Group>
                  <div className="mt-3">
                    {/* <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard">
                      SIGN IN</Link> */}
                      <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={this.login}>SignIn</button>

                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input"/>
                        <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                    </div>
                    <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-muted">Forgot password?</a>
                  </div>
              {/*     <div className="mb-2">
                    <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                      <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                    </button>
                  </div> */}
                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account? <Link to="/user-pages/register" className="text-primary">Register</Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }
}

export default Login
