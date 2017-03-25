import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import boardsTaskStatesDenormalizer from './boardsTaskStatesDenormalizer';

class BoardsCollection extends Mongo.Collection {
    insert(board, callback) {        
        const result = super.insert(board, callback)
        boardsTaskStatesDenormalizer.afterInsertBoard({ _id: result, integrationId : board.integrationId });
        return result;
    }
    remove(selector, callback) {
        return super.remove(selector, callback);
    }
}

export const Boards = new BoardsCollection('kanaban-boards')

// Deny all client-side updates since we will be using methods to manage this collection
Boards.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

Boards.schema = new SimpleSchema({
    integrationId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    ownerId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    }
});

Boards.attachSchema(Boards.schema)

Boards.publicFields = {
    integrationId: 1,
    ownerId: 1
};



Boards.helpers({    
    isPrivate() {
        return !!this.ownerId
    },
    editableBy(userId) {
        if (!this.ownerId) {
            return true
        }

        return this.ownerId === userId
    }
});
