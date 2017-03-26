import React, { Component } from 'react';
import Wizard from 'react-stepzilla';

import Step1 from './steps/info';

export default class NewIdeaWizard extends Component {

    render() {
        const steps = [{ name: 'Basic Information', component: <Step1 /> }];
        return (
            <div className="container">
                <div className="step-progress">
                    <h2>Post New Idea</h2>
                    <Wizard steps={steps} />
                </div>
            </div>
        );
    }

}