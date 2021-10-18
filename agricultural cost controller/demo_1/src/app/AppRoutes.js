import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
//import Expense from './expense/AddExpense';

var Crop = lazy(() => import('./crop/AddCrop'));

var Dashboard = lazy(() => import('./dashboard/Dashboard'));

var BasicElements = lazy(() => import('./form-elements/BasicElements'));

var BasicTable = lazy(() => import('./tables/BasicTable'));

var Mdi = lazy(() => import('./icons/Mdi'));

var ChartJs = lazy(() => import('./charts/ChartJs'));

var Error404 = lazy(() => import('./error-pages/Error404'));
var Error500 = lazy(() => import('./error-pages/Error500'));

var Login = lazy(() => import('./user-pages/Login'));
var Register1 = lazy(() => import('./user-pages/Register'));

var Expenses = lazy(() => import('./expense/AddExpense'));
var Income = lazy(() => import('./income/AddIncome'));
var Category = lazy(() => import('./category/AddCategory'));


class AppRoutes extends Component {
  render () {
    return (
      <Suspense fallback={<Spinner/>}>
        <Switch>
          <Route path="/dashboard" component={ Dashboard } />

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