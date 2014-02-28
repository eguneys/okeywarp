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

var GameInfoModel = Backbone.Model.extend({
    defaults: {
	room: null,
	id: 0,
	name: "",
	players: []
    }
});

var GameInfoCollection = Backbone.Collection.extend({
    model: GameInfoModel
});
