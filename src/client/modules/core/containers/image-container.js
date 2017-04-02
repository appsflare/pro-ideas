import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, imageId }, onData) => {
    const { LocalState, Collections: { Images } } = context();

    if (Meteor.subscribe('files.images.one', imageId).ready()) {
        const image = Images.findOne(imageId);

        if (image)
        { return onData(null, { link: image.link(), name: image.name }); }
    }

    onData(null);
};



export default (Component) => composeAll(
    composeWithTracker(composer),
    useDeps()
)(Component);
