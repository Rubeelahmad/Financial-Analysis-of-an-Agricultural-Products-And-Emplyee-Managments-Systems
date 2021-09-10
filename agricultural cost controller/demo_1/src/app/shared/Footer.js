import React, { Component } from 'react';
// import { Trans } from 'react-i18next';
class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-center ">
            <span>Copyright © <a href="https://otwosoft.com/" target="_blank" rel="noopener noreferrer">otwosoft.com </a>2021</span>
{/*             <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">Free <a href="https://www.bootstrapdash.com/react-admin-templates/" target="_blank" rel="noopener noreferrer"> react admin </a> templates from BootstrapDash.com.  </span>
 */}          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;