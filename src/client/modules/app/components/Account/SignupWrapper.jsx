import React from 'react';

import dataComposer from '../../lib/Login';
import Component from './Signup.jsx';

const ComponentCtx = dataComposer(Component);

export default class extends React.Component {

    render() {
        return (<div className="row" >
            <div className="col-md-10 col-md-offset-1">
                <div className="card card-signup">
                    <h2 className="card-title text-center">Register</h2>
                    <div className="row">
                        <div className="col-md-5 col-md-offset-1">
                            <div className="info info-horizontal">
                                <div className="icon icon-rose">
                                    <i className="material-icons">timeline</i>
                                </div>
                                <div className="description">
                                    <h4 className="info-title">Marketing</h4>
                                    <p className="description">
                                        We've created the marketing campaign of the website. It was a very interesting collaboration.
                    </p>
                                </div>
                            </div>
                            <div className="info info-horizontal">
                                <div className="icon icon-primary">
                                    <i className="material-icons">code</i>
                                </div>
                                <div className="description">
                                    <h4 className="info-title">Fully Coded in HTML5</h4>
                                    <p className="description">
                                        We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub.
                    </p>
                                </div>
                            </div>
                            <div className="info info-horizontal">
                                <div className="icon icon-info">
                                    <i className="material-icons">group</i>
                                </div>
                                <div className="description">
                                    <h4 className="info-title">Built Audience</h4>
                                    <p className="description">There is also a Fully Customizable CMS Admin Dashboard for this product.</p>
                                </div>
                            </div>
                        </div>
                        <ComponentCtx />
                    </div>
                </div>
            </div>
        </div >
        );
    }
}
