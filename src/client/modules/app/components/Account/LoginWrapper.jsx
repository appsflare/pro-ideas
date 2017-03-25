import React from 'react';

import dataComposer from '../../lib/Login';
import Component from './Login.jsx';

const ComponentCtx = dataComposer(Component);

export default class extends React.Component {

    render() {
        return (

            <div className="row">
                <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
                    <div className="card card-signup">
                        <ComponentCtx />
                    </div>
                </div>
            </div>
        );
    }
}
