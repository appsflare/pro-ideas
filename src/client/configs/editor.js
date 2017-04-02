const editorConfigs = {

    all: {

        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }, { 'font': [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        },

        formats: ['header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video']

    },

    mediaOnly: {


        modules: {
            toolbar: [
                ['image', 'video']
            ]
        },

        formats: ['image', 'video']

    },


    videoOnly: {


        modules: {
            toolbar: [
                ['video']
            ]
        },

        formats: ['video']

    },

    imageOnly: {


        modules: {
            toolbar: [
                ['image']
            ]
        },

        formats: ['image']

    },

    shortText: {

        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                ['link'], ['clean']
            ]
        },

        formats: ['header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'link']

    }



};

export default editorConfigs;