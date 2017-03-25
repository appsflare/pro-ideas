import React, {Component, PropTypes} from 'react';
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
            <App boardId={this.props.boardId} onReset={() => { } }/>
        </Provider>);
    }
}

KanbanApp.propTypes = {
    boardId: PropTypes.string.isRequired
}
