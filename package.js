Package.describe({
    summary: "Filter, paging and sort for Meteor collections with hooks and Iron Router support.",
    version: "1.0.4",
    name: "deeeed:filter-collections",
    git: "https://github.com/deeeed/filter-collections"
});

Package.onUse(function (api) {
    api.versionsFrom('METEOR@1.3');

    api.use('underscore', ['client', 'server']);
    api.use('logging', ['server']);

    api.addFiles('filter-collections-client.js', ['client']);
    api.addFiles('filter-collections-server.js', ['server']);
    api.export('FilterCollections');
});
