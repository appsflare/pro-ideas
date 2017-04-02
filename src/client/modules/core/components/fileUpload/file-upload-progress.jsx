import { Component } from 'react';

export default class FileUploadProgress extends Component {


    render() {

        const { fileName, progress, error } = this.props;

        return (
            <div>
                {fileName}
                <div className="progress progress-bar-default">
                    <div style={{ width: progress + '%' }} aria-valuemax="100"
                        aria-valuemin="0"
                        aria-valuenow={progress || 0} role="progressbar"
                        className="progress-bar">
                        <span className="sr-only">{progress}% uploaded</span>
                        <span>{progress}%</span>
                    </div>
                </div>
            </div>
        );
    }
}