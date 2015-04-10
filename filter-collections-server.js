FilterCollections = {};

FilterCollections._extendedPublishCursor = function (cursor, sub, collection, name) {
    var observeHandle = cursor.observeChanges({
        added: function (id, fields) {
            // Add the name of this filter collection
            fields.__filter = name;
            sub.added(collection, id, fields);
        },
        changed: function (id, fields) {
            fields.__filter = name;
            sub.changed(collection, id, fields);
        },
        removed: function (id) {
            sub.removed(collection, id);
        }
    });

    // We don't call sub.ready() here: it gets called in livedata_server, after
    // possibly calling _publishCursor on multiple returned cursors.

    // register stop callback (expects lambda w/ no args).
    sub.onStop(function () {
        observeHandle.stop();
    });
};

FilterCollections.publish = function (collection, options) {

    var self = this;

    options = options || {};

    var callbacks = options.callbacks || {};

    // var cursor = {};

    var name = (options.name) ? options.name : collection._name;

    var publisherResultsId = 'fc-' + name + '-results';
    var publisherCountId = 'fc-' + name + '-count';
    var publisherCountCollectionName = name + 'CountFC';

    /**
     * Publish query results.
     */

    Meteor.publish(publisherResultsId, function (query) {

        var allow = true;

        if (callbacks.allow && _.isFunction(callbacks.allow))
            allow = callbacks.allow(query, this);

        if (!allow) {
            throw new Meteor.Error(417, 'Not allowed');
        }

        query = (query && !_.isEmpty(query)) ? query : {};

        query.selector = query.selector || {};

        query.options = query.options || {
            sort: [],
            skip: 0,
            limit: 10
        };

        if (callbacks.beforePublish && _.isFunction(callbacks.beforePublish))
            query = callbacks.beforePublish(query, this) || query;

        var cursor = collection.find(query.selector, query.options);

        if (callbacks.afterPublish && _.isFunction(callbacks.afterPublish))
            cursor = callbacks.afterPublish('results', cursor, this) || cursor;

        FilterCollections._extendedPublishCursor(cursor, this, collection._name, publisherResultsId);
    });

    /**
     * Publish result count.
     */

    Meteor.publish(publisherCountId, function (query) {
        var self = this;
        var allow = true;
        var cursor = {};

        if (callbacks.allow && _.isFunction(callbacks.allow))
            allow = callbacks.allow(query, this);

        if (!allow) {
            throw new Meteor.Error(417, 'Not allowed');
        }

        query = (query && !_.isEmpty(query)) ? query : {};
        query.selector = query.selector || {};

        if (callbacks.beforePublish && _.isFunction(callbacks.beforePublish))
            query = callbacks.beforePublish(query, this) || query;

        var count = collection.find(query.selector).count() || 0;

        if (callbacks.afterPublish && _.isFunction(callbacks.afterPublish))
            cursor = callbacks.afterPublish('count', cursor, this) || cursor;

        self.added(publisherCountCollectionName, Meteor.uuid(), {
            count: count,
            query: query
        });

        this.ready();
    });
};
