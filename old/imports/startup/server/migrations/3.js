
import { Profiles } from '../../../api/profiles/profiles';

Migrations.add({
    version: 3,
    up: function () {
        console.log('add default profile picture to all profiles'); 
        Profiles.find({}).forEach(profile => {
            Profiles.update({ _id: profile._id }, {
                $set: {
                    profileImage: 'https://www.gravatar.com/avatar/00000000000000000000000000000000'
                }
            });
        });
    }
});