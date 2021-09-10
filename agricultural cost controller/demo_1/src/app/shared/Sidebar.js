import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
//import { Collapse, Dropdown } from 'react-bootstrap';
//import { Trans } from 'react-i18next';

class Sidebar extends Component {
  constructor(props){
    super(props);

  this.state = {
  };

  
}

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/expense', state: 'expenseBasicUiMenuOpen' },
      { path: '/income', state: 'incomeElementsMenuOpen' },
      { path: '/category', state: 'categoryElementsMenuOpen' },
      { path: '/crop', state: 'cropElementsMenuOpen' },
      // {path:'/charts', state: 'chartsMenuOpen'},
     // { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  render() {
  const userid = localStorage.getItem('userid');
  const useremail = userid ? localStorage.getItem('useremail') : '';
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a className="sidebar-brand brand-logo" href="index.html"><img src={require('../../assets/images/logo.svg')} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini" href="index.html"><img src={require('../../assets/images/logo-mini.svg')} alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <img className="img-xs rounded-circle " src={require('../../assets/images/faces/face15.jpg')} alt="profile" />
                  <span className="count bg-success"></span>
                </div>
                <div className="profile-name">            
                  <h5 className="mb-0 font-weight-normal">{useremail}</h5>
                  <span>Member</span>
                </div>
              </div>
     
            </div>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link">Navigation</span>
          </li>
          <li className={this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon"><i className="mdi mdi-home"></i></span>
              <span className="menu-title">Dashboard</span>
            </Link>
          </li>


          <li className={this.isPathActive('/crop') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.cropElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('cropElementsMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-contacts"></i>
              </span>
              <span className="menu-title">crop</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.cropElementsMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/crop/add-crop') ? 'nav-link active' : 'nav-link'} to="/crop/add-crop">Add Crop</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/category') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.categoryElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('categoryElementsMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title">Category</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.categoryElementsMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/category/add-category') ? 'nav-link active' : 'nav-link'} to="/category/add-category">Add Category</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

      
          <li className={this.isPathActive('/income') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.incomeElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('incomeElementsMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-playlist-play"></i>
              </span>
              <span className="menu-title">Income</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.incomeElementsMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/income/add-income') ? 'nav-link active' : 'nav-link'} to="/income/add-income">Add Income</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>

          <li className={this.isPathActive('/expense') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.expenseBasicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('expenseBasicUiMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-currency-usd"></i>
              </span>
              <span className="menu-title">Expense</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.expenseBasicUiMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/expense/add-expense') ? 'nav-link active' : 'nav-link'} to="/expense/add-expense">Add Expenses</Link></li>
                  {/*         <li className="nav-item"> <Link className={ this.isPathActive('/expense/dropdowns') ? 'nav-link active' : 'nav-link' } to="/expense/dropdowns">Dropdowns</Link></li>
                  <li className="nav-item"> <Link className={ this.isPathActive('/expense/typography') ? 'nav-link active' : 'nav-link' } to="/expense/typography">Typography</Link></li>
                    */}
                </ul>
              </div>
            </Collapse>
          </li>
          
      

        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {

    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });

 
  }

}

export default withRouter(Sidebar);