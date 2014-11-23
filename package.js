Package.describe({
  summary: " Smart package for Meteor that adds filter and pager behavior to our Meteor's collections.",
  version: "0.1.8",
  git: "https://github.com/ericchen0121/filter-collections"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');

  api.use('underscore', ['client', 'server']);

  api.addFiles('filter-collections-client.js', ['client']);
  api.addFiles('filter-collections-server.js', ['server']);
});
