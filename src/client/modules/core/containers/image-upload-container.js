import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, clearErrors }, onData) => {
    const { LocalState } = context();
    const error = LocalState.get('IMAGE_UPLOAD_ERROR');
    onData(null, { error });

    return clearErrors;
};

export const depsMapper = (context, actions) => ({
    upload: actions.Files.uploadImage,
    removeFile: actions.Files.removeImageFile,
    clearErrors: actions.Files.uploadImageClearErrors,
    context: () => context
});

export default (Component) => composeAll(
    composeWithTracker(composer),
    useDeps(depsMapper)
)(Component);
