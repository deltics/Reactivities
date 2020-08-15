import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import * as serviceWorker from './serviceWorker';
import 'mobx-react-lite/batchingForReactDom';
import dateFnsLocalizer from 'react-widgets-date-fns';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'semantic-ui-css/semantic.min.css';
import App from './app/App';
import ScrollToTop from "./app/layout/ScrollToTop";
import './app/layout/styles.css';


// Initialise DateFns
dateFnsLocalizer();


export const history = createBrowserHistory();


ReactDOM.render(
    <Router history={history}>
        <ScrollToTop>
            <App/>
        </ScrollToTop>
    </Router>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
