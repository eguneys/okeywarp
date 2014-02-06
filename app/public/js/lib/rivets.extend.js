// Rivets.js Backbone adapter
rivets.adapters[':'] = {
  // set the listeners to update the corresponding DOM element
  subscribe: function(obj, keypath, callback) {
    obj.on('change:' + keypath, callback);
  },
  // this will be triggered to unbind the Rivets.js events
  unsubscribe: function(obj, keypath, callback) {
    obj.off('change:' + keypath, callback);
  },
  // set the values that it's possible to read from the objects passed to Rivets.js
  read: function(obj, keypath) {
    // if we use a collection we will loop through its models otherwise we just get the model properties
    return obj instanceof Backbone.Collection ? obj.models : obj.get(keypath);
  },
  // It gets triggered whenever we want update a model using Rivets.js
  publish: function(obj, keypath, value) {
    obj.set(keypath, value);
  }
};
