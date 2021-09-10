import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
//import { withTranslation } from "react-i18next";
import fire from '../config/fire.js';
import Login from './user-pages/Login';
import Register from './user-pages/Register';
//import Swal from 'sweetalert2';

class App extends Component {
  state = {}

  constructor(props)
{
  super(props);
  this.state={
    user : {}
  }
}

authListner(){
  fire.auth().onAuthStateChanged((user)=>{
    if(user)
    {
      console.log("if:" + user)
     // Swal.fire("Welcome to Agriculture...!!! :)" + user.uid , "Email: " + user.email)
      localStorage.setItem('userid', user.uid);
      localStorage.setItem('useremail', user.email);
      this.setState({user})
    }
    else
    {
      console.log("else:" + user)
      this.setState({user : null})
        
    }
  })
} 

  componentDidMount() {
   this.authListner();
   console.log()
    this.onRouteChanged();
  }
  render () {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar/> : '';
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar/> : '';
    let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';
    return (
      <div className="container-scroller">
       {/*  { sidebarComponent } */}
        {this.state.user ? (sidebarComponent) : (null)} 
        <div className="container-fluid page-body-wrapper">
         {/*  { navbarComponent } */}
          {this.state.user ? (navbarComponent) : (null)} 
          <div className="main-panel">
            <div className="content-wrapper">
              
             {this.state.user ? (<AppRoutes/>) : (this.props.location.pathname === "/user-pages/login" ? (<Login/>) : (this.props.location.pathname === "/user-pages/register" ? (<Register/>) : (<Login/>)))} 
            </div>
            { footerComponent }
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED.......................!!!");
    console.log(this.props.location.pathname);
        
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [ '/user-pages/login','/user-pages/register','/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true
        })
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        this.setState({
          isFullPageLayout: false
        })
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }
  }

}

export default (withRouter(App));
