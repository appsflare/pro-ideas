import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';

export const ExtendedInput = React.createClass({

    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],

    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue(event, value) { 
        this.setValue(value);        
    },

    render() {

        // An error message is returned ONLY if the component is invalid
        // or the server has returned an error message

        const errorMessage = this.getErrorMessage();

        return (
            <div className={`form-group is-empty ${errorMessage ? 'has-error has-feedback' : ''}`}>
                <Input ref="input" {...this.props} onChange={this.changeValue} />
                <span className="material-icons form-control-feedback">clear</span>
                <span className="material-input" />
                {errorMessage ? <span className="help-block validation-message">{errorMessage}</span> : null}
            </div>
        );
    }
});