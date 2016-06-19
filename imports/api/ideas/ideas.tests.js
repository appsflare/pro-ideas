/* eslint-env mocha */

import { Factory } from 'meteor/factory';
import { Ideas } from './ideas.js';
import { insert, makePublic, makePrivate, updateName, remove } from './methods.js';
import { Todos } from '../todos/todos.js';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';

if (Meteor.isServer) {
  require('./server/publications.js');

  describe('ideas', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const list = Factory.create('list');
        assert.typeOf(list, 'object');
        assert.match(list.name, /List /);
      });
    });

    describe('publications', () => {
      const userId = Random.id();

      // TODO -- make a `listWithTodos` factory
      const createList = (props = {}) => {
        const list = Factory.create('list', props);
        _.times(3, () => {
          Factory.create('todo', { listId: list._id });
        });
      };

      before(() => {
        Ideas.remove({});
        _.times(3, () => createList());
        _.times(2, () => createList({ userId }));
        _.times(2, () => createList({ userId: Random.id() }));
      });


      describe('ideas.public', () => {
        it('sends all public ideas', (done) => {
          const collector = new PublicationCollector();
          collector.collect('ideas.public', (collections) => {
            chai.assert.equal(collections.ideas.length, 3);
            done();
          });
        });
      });

      describe('ideas.private', () => {
        it('sends all owned ideas', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('ideas.private', (collections) => {
            chai.assert.equal(collections.ideas.length, 2);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let listId;
      let todoId;
      let otherListId;
      let userId;

      beforeEach(() => {
        // Clear
        Ideas.remove({});
        Todos.remove({});

        // Create a list and a todo in that list
        listId = Factory.create('list')._id;
        todoId = Factory.create('todo', { listId })._id;

        // Create throwaway list, since the last public list can't be made private
        otherListId = Factory.create('list')._id;

        // Generate a 'user'
        userId = Random.id();
      });

      describe('makePrivate / makePublic', () => {
        function assertListAndTodoArePrivate() {
          assert.equal(Ideas.findOne(listId).userId, userId);
          assert.isTrue(Ideas.findOne(listId).isPrivate());
          assert.isTrue(Todos.findOne(todoId).editableBy(userId));
          assert.isFalse(Todos.findOne(todoId).editableBy(Random.id()));
        }

        it('makes a list private and updates the todos', () => {
          // Check initial state is public
          assert.isFalse(Ideas.findOne(listId).isPrivate());

          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { listId };

          // Making the list private adds userId to the todo
          makePrivate._execute(methodInvocation, args);
          assertListAndTodoArePrivate();

          // Making the list public removes it
          makePublic._execute(methodInvocation, args);
          assert.isUndefined(Todos.findOne(todoId).userId);
          assert.isTrue(Todos.findOne(todoId).editableBy(userId));
        });

        it('only works if you are logged in', () => {
          // Set up method arguments and context
          const methodInvocation = { };
          const args = { listId };

          assert.throws(() => {
            makePrivate._execute(methodInvocation, args);
          }, Meteor.Error, /ideas.makePrivate.notLoggedIn/);

          assert.throws(() => {
            makePublic._execute(methodInvocation, args);
          }, Meteor.Error, /ideas.makePublic.notLoggedIn/);
        });

        it('only works if it\'s not the last public list', () => {
          // Remove other list, now we're the last public list
          Ideas.remove(otherListId);

          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { listId };

          assert.throws(() => {
            makePrivate._execute(methodInvocation, args);
          }, Meteor.Error, /ideas.makePrivate.lastPublicList/);
        });

        it('only makes the list public if you made it private', () => {
          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { listId };

          makePrivate._execute(methodInvocation, args);

          const otherUserMethodInvocation = { userId: Random.id() };

          // Shouldn't do anything
          assert.throws(() => {
            makePublic._execute(otherUserMethodInvocation, args);
          }, Meteor.Error, /ideas.makePublic.accessDenied/);

          // Make sure things are still private
          assertListAndTodoArePrivate();
        });
      });

      describe('updateName', () => {
        it('changes the name, but not if you don\'t have permission', () => {
          updateName._execute({}, {
            listId,
            newName: 'new name',
          });

          assert.equal(Ideas.findOne(listId).name, 'new name');

          // Make the list private
          makePrivate._execute({ userId }, { listId });

          // Works if the owner changes the name
          updateName._execute({ userId }, {
            listId,
            newName: 'new name 2',
          });

          assert.equal(Ideas.findOne(listId).name, 'new name 2');

          // Throws if another user, or logged out user, tries to change the name
          assert.throws(() => {
            updateName._execute({ userId: Random.id() }, {
              listId,
              newName: 'new name 3',
            });
          }, Meteor.Error, /ideas.updateName.accessDenied/);

          assert.throws(() => {
            updateName._execute({}, {
              listId,
              newName: 'new name 3',
            });
          }, Meteor.Error, /ideas.updateName.accessDenied/);

          // Confirm name didn't change
          assert.equal(Ideas.findOne(listId).name, 'new name 2');
        });
      });

      describe('remove', () => {
        it('does not delete the last public list', () => {
          const methodInvocation = { userId };

          // Works fine
          remove._execute(methodInvocation, { listId: otherListId });

          // Should throw because it is the last public list
          assert.throws(() => {
            remove._execute(methodInvocation, { listId });
          }, Meteor.Error, /ideas.remove.lastPublicList/);
        });

        it('does not delete a private list you don\'t own', () => {
          // Make the list private
          makePrivate._execute({ userId }, { listId });

          // Throws if another user, or logged out user, tries to delete the list
          assert.throws(() => {
            remove._execute({ userId: Random.id() }, { listId });
          }, Meteor.Error, /ideas.remove.accessDenied/);

          assert.throws(() => {
            remove._execute({}, { listId });
          }, Meteor.Error, /ideas.remove.accessDenied/);
        });
      });

      describe('rate limiting', () => {
        it('does not allow more than 5 operations rapidly', () => {
          const connection = DDP.connect(Meteor.absoluteUrl());

          _.times(5, () => {
            connection.call(insert.name, {});
          });

          assert.throws(() => {
            connection.call(insert.name, {});
          }, Meteor.Error, /too-many-requests/);

          connection.disconnect();
        });
      });
    });
  });
}
