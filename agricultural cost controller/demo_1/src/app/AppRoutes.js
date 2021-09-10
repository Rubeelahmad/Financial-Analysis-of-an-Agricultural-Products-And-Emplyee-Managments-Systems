import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
//import Expense from './expense/AddExpense';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));

/* const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));
const Typography = lazy(() => import('./basic-ui/Typography')); */

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

const ChartJs = lazy(() => import('./charts/ChartJs'));

const Error404 = lazy(() => import('./error-pages/Error404'));
const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));

const Expenses = lazy(() => import('./expense/AddExpense'));
const Income = lazy(() => import('./income/AddIncome'));
const Category = lazy(() => import('./category/AddCategory'));
const Crop = lazy(() => import('./crop/AddCrop'));

class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route exact path="/dashboard" component={ Dashboard } />

        {/*   <Route path="/expense/buttons" component={ Buttons } />
          <Route path="/expense/dropdowns" component={ Dropdowns } />
          <Route path="/expense/typography" component={ Typography } /> */}

          <Route path="/form-Elements/basic-elements" component={ BasicElements } />

          <Route path="/tables/basic-table" component={ BasicTable } />

          <Route path="/icons/mdi" component={ Mdi } />

          <Route path="/charts/chart-js" component={ ChartJs } />


          <Route path="/user-pages/login-1" component={ Login } />
          <Route path="/user-pages/register-1" component={ Register1 } />

          <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } />

          <Route path="/expense/add-expense" component={ Expenses } />
          <Route path="/income/add-income" component={ Income } />
          <Route path="/category/add-category" component={ Category } />
          <Route path="/crop/add-crop" component={ Crop } />

          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;