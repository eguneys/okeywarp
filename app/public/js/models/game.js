var PlayerModel = Backbone.Model.extend({
    defaults: {
	name: "",
	turnLeft: 0,
	side: "bottom",
	photo: "http://placehold.it/75x75"
    }
});


var PlayerCollection = Backbone.Collection.extend({
    model: PlayerModel
});

var StoneModel = Backbone.Model.extend({
    defaults: {
	stoneType: "1"
    }
});

var StoneCollection = Backbone.Collection.extend({
    model: StoneModel
});


var GameModel = Backbone.Model.extend({

    defaults: {
	gostergeStone: new StoneModel()
    },
    
    stones: new StoneCollection(),
    throwStones: {
	bottom: new StoneCollection(),
	left: new StoneCollection(),
	top: new StoneCollection(),
	right: new StoneCollection(),
    },

    middleStones: new StoneCollection(),

    players: new PlayerCollection()
});
