var HomeModel = Backbone.Model.extend({
    defaults: {
	newRoomProperties: {
            Scores: [10, 15, 20, 25],
            Times: [25, 50],
            boolValues: ['on', 'off'],
            Score: 10,
            Time: 25,
            Gosterge: 'on',
            Esli:  'off',
            Ozel: 'off'
        }
	
    }
});

var UserModel = Backbone.Model.extend({
    defaults: {
	name: "",
	score: 0
    }
});

var UserCollection = Backbone.Collection.extend({
    model: UserModel
});

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
	stoneType: "1",
	top: "0",
	left: "0",
    }
});

var StoneCollection = Backbone.Collection.extend({
    model: StoneModel
});


var GameModel = Backbone.Model.extend({

    defaults: {
	gostergeStone: new StoneModel(),
	MySide: -1,
	Turn: -1
    },
    
    stones: new StoneCollection(),
    throwStones: {
	bottom: new StoneCollection(),
	left: new StoneCollection(),
	top: new StoneCollection(),
	right: new StoneCollection(),
    },

    middleStones: new StoneCollection(),

    players: new PlayerCollection(),

    turnPlayer: function() { return this.players.findWhere({ name: this.get("Turn") }); },

    myPlayer: function() { return this.players.findWhere({ side: "bottom" }); }
});


var UserSides = [
    "bottom",
    "right",
    "top",
    "left"
];
