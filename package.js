Package.describe({
  summary: "Smart package for Meteor that adds filter and pager behavior to our Meteor's collections. Supports Iron-Router",
  version: "0.2.0",
  name: "doctorpangloss:filter-collections",
  git: "https://github.com/workpop/filter-collections"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0.2.1');

  api.use('underscore', ['client', 'server']);

  api.addFiles('filter-collections-client.js', ['client']);
  api.addFiles('filter-collections-server.js', ['server']);
  api.export('FilterCollections')
});
