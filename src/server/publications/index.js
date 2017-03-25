import currentUser from './current-user';
import activities from './activities';
import followers from './followers';
import ideaComments from './idea-comments';
import ideas from './ideas';
import profiles from './profiles';
import teams from './teams';

export default function () {
    currentUser();
    activities();
    followers();
    ideaComments();
    ideas();
    profiles();
    teams();
};