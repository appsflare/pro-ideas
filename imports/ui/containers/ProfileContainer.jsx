import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profiles/profiles';
import { createContainer } from 'meteor/react-meteor-data';
import { ProfilePage } from '../pages/ProfilePage';

export default createContainer(({ params: { ownerId } }) => {
    const profileHandle = Meteor.subscribe('profiles.public.findOne', ownerId);
    let loading = !profileHandle.ready();
    const profile = Profiles.find({ ownerId }, { sort: { createdAt: -1 } }).fetch()[0];
    const profileExists = !loading && !!profile;

    const user = profile && Meteor.users.findOne({ _id: profile.ownerId });

    return {
        loading,
        profile,
        profileExists,
        user
    };
}, ProfilePage);
