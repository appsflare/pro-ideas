import { Component } from 'react';

export default class FileUploadProgress extends Component {

    render() {

        const { link, name, removeFile } = this.props;

        return (

            <div className="card card-profile card-plain">
                <div className="card-image">
                    <img className="img" src={link} />
                    <div className="ripple-container" /></div>
                <div className="content">
                    <h4 className="card-title">{name} <button className="btn btn-just-icon btn-round" onClick={removeFile}><i className="material-icons">delete</i></button> </h4>
                    <h6 className="category text-gray"></h6>
                    <div className="footer">
                    </div>
                </div>
            </div>



        );
    }
}