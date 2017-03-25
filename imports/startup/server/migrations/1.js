import { Profiles } from '../../../api/profiles/profiles';
import { update } from '../../../api/profiles/methods';
import { Ideas } from '../../../api/ideas/ideas';


Migrations.add({
    version: 1,
    up: function () {
        console.log('creating user profiles');

        Meteor.users.find({}).forEach(user => {

            const profile = Profiles.findOne({ ownerId: user._id });

            if (profile) { return; }

             const ideasCount = Ideas.find({ ownerId: user._id }).count();

            Profiles.insert({
                userName: user.emails[0].address.split('@')[0],
                ownerId: user._id,
                ideasCount
            });
        });
    }
});