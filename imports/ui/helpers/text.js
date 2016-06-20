import {Showdown} from 'meteor/markdown';
const converter = new Showdown.converter();
export default {
    toHtml(markdown='') {
        return converter.makeHtml(markdown)
    },
    createMarkup(markdown) {
        return { __html: this.toHtml(markdown) }
    }
}