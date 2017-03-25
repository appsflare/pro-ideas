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
                                    <i className="material-icons">flash_on</i>
                                </div>
                                <div className="description">
                                    <h4 className="info-title">Share Your Ideas</h4>
                                    <p className="description">
                                        Have an idea flashing in your head? Get in and share your ideas with everyone.
                    </p>
                                </div>
                            </div>
                            <div className="info info-horizontal">
                                <div className="icon icon-primary">
                                    <i className="material-icons">code</i>
                                </div>
                                <div className="description">
                                    <h4 className="info-title">Explain What It Is</h4>
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
                                    <h4 className="info-title">Start Collaborating</h4>
                                    <p className="description">Build a team to realize your ideas.</p>
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
