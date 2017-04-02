import { Component } from 'react';

export default class FileUploadInput extends Component {



    onFileSelected(e) {
        const { upload } = this.props;

        const { files } = e.currentTarget;

        if (!files.length)
        { return; }

        upload(files[0]);
    }


    render() {

        const { inProgress } = this.props;

        return (

            <div className="form-group">
                <input type="file" type="file" id="fileinput" disabled={inProgress} ref="fileinput"
                    onChange={this.onFileSelected.bind(this)} />
                <div className="input-group col-xs-12">
                    <span className="input-group-addon"><span><i className="material-icons">photo</i></span></span>
                    <input type="text" className="form-control input-lg" disabled placeholder="Upload Image" />
                    <span className="input-group-btn">
                        <button className="browse btn btn-primary input-lg" type="button">
                            <span><i className="material-icons">file_upload</i></span> Browse</button>
                    </span>
                </div>
            </div>
        );

    }


}