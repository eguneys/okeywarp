var UserModel = Backbone.Model.extend({
    defaults: {
	name: "",
	score: 0,
	level: 0,
	photo: "http://placehold.it/200x200"
    }
});

var UserCollection = Backbone.Collection.extend({
    model: UserModel
});

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
        },
    }
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
	stoneType: 1,
	top: "0",
	left: "0",
    }
});

var StoneCollection = Backbone.Collection.extend({
    model: StoneModel
});

var ChatModel = Backbone.Model.extend({
    defaults: {
	sender: "",
	message: ""
    }
});

var ChatCollection = Backbone.Collection.extend({
    model: ChatModel
});


var GameChatModel = Backbone.Model.extend({
    initialize: function() {
	this.set("users", new UserCollection());
	this.set("chats", new ChatCollection());
    },

    defaults: {
	chatbox: ""
    },

    users: function() { return this.get("users"); },
    chats: function() { return this.get("chats"); }
});



var GameModel = Backbone.Model.extend({

    initialize: function() {
	this.set("stones", new StoneCollection());
	this.set("throwStones", {
	    bottom: new StoneCollection(),
	    left: new StoneCollection(),
	    top: new StoneCollection(),
	    right: new StoneCollection(),
	});
	this.set("middleStones", new StoneCollection());

	this.set("players", new PlayerCollection());
    },
    
    defaults: {
	gostergeStone: new StoneModel(),
	MySide: -1,
	Turn: -1,
	chatModel: new GameChatModel()
    },
    
    stones: function() { return this.get("stones"); },
    throwStones: function() { return this.get("throwStones"); },
    middleStones: function() { return this.get("middleStones"); },

    players: function() { return this.get("players"); },

    turnPlayer: function() { return this.players().findWhere({ name: this.get("Turn") }); },

    myPlayer: function() { return this.players().findWhere({ side: "bottom" }); }
});


var UserSides = [
    "bottom",
    "right",
    "top",
    "left"
];

var PreviousSide = function(side) {
    for (var i in UserSides) {
	if (UserSides[i] == side) {
	    return UserSides[(i - 1 + 4) % 4];
	}
    }
};


var NextSide = function(side) {
    for (var i in UserSides) {
	if (UserSides[i] == side) {
	    return UserSides[(i - 0 + 1) % 4];
	}
    }
};
