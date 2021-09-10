import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import fire from '../../config/fire';

class Navbar extends Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }

  handleRefresh = () => {
    // by calling this method react re-renders the component
    console.log("In handle Refresh")
    this.setState({});
  };

  logout = () => {
    fire.auth().signOut();
  }
  toggleOffcanvas = () => {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  toggleRightSidebar = () => {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }
  render = () => {
    const userid = localStorage.getItem('userid');
    const useremail = userid ? localStorage.getItem('useremail') : '';
  
  
    return (
      <nav className="navbar p-0 fixed-top d-flex flex-row">
        <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo-mini" to="/"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></Link>
        </div>
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button className="navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
            <span className="mdi mdi-menu"></span>
          </button>


          <ul className="navbar-nav navbar-nav-right">
            <Dropdown alignRight as="li" className="nav-item d-none d-lg-block">
            
              <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                <div className="navbar-profile">
                  <img className="img-xs rounded-circle" src={require('../../assets/images/faces/face15.jpg')} alt="profile" />
                  <p className="mb-0 d-none d-sm-block navbar-profile-name">{useremail}</p>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
                <h6 className="p-3 mb-0">Profile</h6>
                <Dropdown.Divider />
                <Dropdown.Item href="!#" onClick={evt =>evt.preventDefault()} className="preview-item">
                  <div className="preview-thumbnail" onClick={this.logout}>
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-logout text-danger"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1" onClick={this.logout}>Log Out</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <p className="active " onClick={this.handleRefresh}>Refresh Page</p>
              </Dropdown.Menu>
            </Dropdown>

          </ul>
         
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={this.toggleOffcanvas}>
            <span className="mdi mdi-format-line-spacing"></span>
          </button>
        </div>
      </nav>
    );
  }
}

export default Navbar;
