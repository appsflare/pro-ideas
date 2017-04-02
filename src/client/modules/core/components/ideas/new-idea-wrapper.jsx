import React, { Component } from 'react';
import Wizard from 'react-stepzilla';

import IdeaInfo from './steps/info.jsx';
import IdeaImages from './steps/images.jsx';
import applyStepValidation from './step-validator.jsx';

const Step1 = applyStepValidation(IdeaInfo);
const Step2 = applyStepValidation(IdeaImages);

export default class NewIdeaWizard extends Component {

    render() {
        const steps = [
            { name: 'Basic Information', component: <Step1/> },
            { name: 'Images', component: <Step2/> },
            { name: 'Pages', component: <Step1/> },
            { name: 'Review', component: <Step1/> }
        ];
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