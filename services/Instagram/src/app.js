import React from 'react';
import {render} from  'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import App from './components/App';

render(
    (
        <Router history={browserHistory}>
            <Route path="/" component={App}>

            </Route>
        </Router>
    ),
    document.querySelector('.app-container')
);

// <Route path="login" component={Login}/>
// <Route path="logout" component={Logout}/>
// <Route path="about" component={About}/>
// <Route path="dashboard" component={Dashboard} onEnter={requireAuth}/>

// render(
//    <App/>,
//    document.querySelector('.app-container')
// );
