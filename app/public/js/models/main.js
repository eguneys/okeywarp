var TabModel = Backbone.Model.extend({
    defaults: {
	id: "",
	name: "",
	active: false
    }
});

var TabCollection = Backbone.Collection.extend({
    model: TabModel
});


var UserModel = Backbone.Model.extend({
    defaults: {
	name: "",
	score: 0
    }
});

var UsersCollection = Backbone.Collection.extend({
    model: UserModel
});


var GameInfoModel = Backbone.Model.extend({
    defaults: {
	name: ""
    }
});

var GameInfoCollection = Backbone.Collection.extend({
    model: GameInfoModel
});
