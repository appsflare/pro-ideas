
import { Component } from 'react';



export default function applyValidation(StepComponent) {

    return class ValidatedComponent extends Component {

        isValidated() {
            const { component } = this.refs;
            return component.isValid();
        }

        render() {

            const { component } = this.props;

            return <StepComponent ref="component" />;
        }

    }
}