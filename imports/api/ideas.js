import { Mongo } from 'meteor/mongo';

export const Ideas = new Mongo.Collection('ideas');
import { check } from 'meteor/check'; 

 
Meteor.methods({
  'ideas.insert'(name, description) {
    check(name, String);
    check(description, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    let userEmail = Meteor.user().emails[0].address;
 
    Ideas.insert({
      name,
      description,
      createdAt: new Date(),
      owner: this.userId,
      ownerName: userEmail      
    });
  },
  'ideas.calcVotes'(ideaId) {   
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    let idea = Ideas.findOne(ideaId);
    
    if(!idea)
    {
       throw new Meteor.Error('idea-not-found');
    }
    
   let stats = Meteor.call('votes.getStats', ideaId);
   Ideas.update(ideaId, { $set: stats });
    
  },
  'ideas.update'(ideaId, data) {
    check(data, Object);    
    check(data.name, String);
    check(data.description, String);
    
    
     const idea = Ideas.findOne(ideaId);
     
     if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
 
    Ideas.update(ideaId, {$set:{ name: name, description: description }});
  },
  'ideas.remove'(ideaId) {
    check(ideaId, String);
    
     const idea = Ideas.findOne(ideaId);
     
     if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
 
    Ideas.remove(ideaId);
  }
});



