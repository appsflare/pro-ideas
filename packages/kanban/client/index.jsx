import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App.jsx';
import store from './store';
import './stylesheets/main.scss';

export class KanbanApp extends Component {
    constructor() {
        super(...arguments);
    }
    render() {
        return (<Provider store={store}>
            <App onReset={()=>{}}/>
        </Provider>);
    }
}


