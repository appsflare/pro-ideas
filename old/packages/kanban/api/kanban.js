import { Boards } from './boards/boards';

export default class Kanban {

    static getBoardId(integrationId) {

        const user = Meteor.user();
        if (!user) {
            throw new Error('not-authorized');
        }

        const board = Boards.findOne({ integrationId })

        if (board) {
            return board._id
        }

        return Boards.insert({ integrationId, ownerId: user._id });
    }

}