import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profiles/profiles';
import { Activities } from '../../api/activities/activities';
import { createContainer } from 'meteor/react-meteor-data';
import { ProfilePage } from '../pages/ProfilePage';

function getActivityStream(activities) {
    let groupedActivityStreams = _.chain(activities)
        .map(i => {
            i.group = moment(i.createdAt).format('Do MMMM, YYYY');
            return i;
        }).groupBy('group')
        .value();

    let activityStreams = [];
    _.each(groupedActivityStreams, (stream, date) => {
        activityStreams.push({ date, stream })
    });
    return activityStreams;
}

export default createContainer(({ params: { ownerId } }) => {

    const usersHandle = Meteor.subscribe('profiles.users.public');

    const profileHandle = Meteor.subscribe('profiles.public.findOne', ownerId);
    const activitiesHandle = Meteor.subscribe('activities.public', ownerId);


    let loading = (!profileHandle.ready() || !activitiesHandle.ready() || !usersHandle.ready());



    const profile = Profiles.find({ ownerId }, { sort: { createdAt: -1 } }).fetch()[0];
    const profileExists = !loading && !!profile;

    const user = profile && Meteor.users.findOne({ _id: profile.ownerId });

    const activities = Activities.find({}, { sort: { createdAt: -1 } }).fetch();
    
    const contributions = Activities.find({ ownerId, type: { $in: ['ideas.create', 'ideas.comments.create'] } }, { sort: { createdAt: -1 } }).fetch();


    let activityStreams = getActivityStream(activities);
    let contributionStreams = getActivityStream(contributions);


    return {
        loading,
        profile,
        profileExists,
        user,
        activityStreams,
        contributionStreams
    };
}, ProfilePage);
