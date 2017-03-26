import ReactQuill from 'react-quill';
/* 
 * Simple editor component that takes placeholder text as a prop 
 */
export class RichTextEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = { editorHtml: '' }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(html) {
        this.setState({ editorHtml: html });        
    }

    render() {
        return (
            <ReactQuill
                theme={'snow'}
                onChange={this.handleChange}
                value={this.state.editorHtml}
                modules={RichTextEditor.modules}
                formats={RichTextEditor.formats}
                placeholder={this.props.placeholder}
            >

            </ReactQuill>
        )
    }
}

/* 
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
RichTextEditor.modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }, { 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
    ]
}
/* 
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
RichTextEditor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

/* 
 * PropType validation
 */
RichTextEditor.propTypes = {
    placeholder: React.PropTypes.string,
}
