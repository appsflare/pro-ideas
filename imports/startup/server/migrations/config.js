Migrations.config({
  // Log job run details to console 
  log: true,
 
  // Use a custom logger function (defaults to Meteor's logging package) 
  logger: null,
 
  // Enable/disable logging "Not migrating, already at version {number}" 
  logIfLatest: true,
 
  // migrations collection name to use in the database 
  collectionName: "migrations"
});