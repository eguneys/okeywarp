

var HomeLayout = Backbone.Marionette.Layout.extend({
    template: "#homeTemplate",

    regions: {
	tabRegion: "#homeTabs"
    },

    initialize: function(options) {
	this.vent = options.vent;

	this.usersInfoCollection = options.usersInfoCollection;
	this.gamesInfoCollection = options.gamesInfoCollection;
	this.homeModel = options.homeModel;
    },

    
    onShow: function() {
	this.tabRegion.show(new HomeTabView({
	    vent: this.vent,
	    model: this.homeModel,
	    usersCollection: this.usersInfoCollection,
	    gamesCollection: this.gamesInfoCollection,
	}));
    }
});

var HomeTabView = Backbone.Marionette.Layout.extend({
    template: "#homeTabTemplate",

    events: {
	"click #playNow": "playNowClick",
	"click #createRoomModal": "createRoomModalClick",
	"click #createRoom": "createRoomClick",
	"click #joinRoomButton": "joinRoomClick"
    },
    
    regions: {
	usersRegion: "#userlist",
	gamesRegion: "#gamelist",
    },

    ui: {
	createRoomModal: "#gamePropertiesModal",
    },

    initialize: function(options) {
	this.vent = options.vent;

	this.usersCollection = options.usersCollection;
	this.gamesCollection = options.gamesCollection;
    },

    onShow: function() {
	this.usersRegion.show(new UsersCollectionView({ collection: this.usersCollection }));
	this.gamesRegion.show(new GameInfoCollectionView({ collection: this.gamesCollection }));

	var that = this;
	this.ui.createRoomModal.on('hidden.bs.modal', function() {
	    if (that.createRoom) that.vent.trigger("createRoomClick");
	});

	rivets.bind(this.$el, this.model);
    },

    joinRoomClick: function(evt) {
	this.vent.trigger("joinRoomClick", $(evt.target).attr("gameid"));
    },

    playNowClick: function() {
	this.vent.trigger("playNowClick");
    },

    createRoomModalClick: function() {
	this.ui.createRoomModal.modal('show');
    },

    createRoomClick: function() {
	this.createRoom = true;
	this.ui.createRoomModal.modal('hide');
    }
});


var GameInfoView = Backbone.Marionette.ItemView.extend({
    template: "#gameInfoTemplate",

    className: "list-group-item"
});

var GameInfoCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: GameInfoView
});

var UserView = Backbone.Marionette.ItemView.extend({
    template: "#userTemplate",

    className: "list-group-item"
});

var UsersCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: UserView
});

var LoginView = Backbone.Marionette.ItemView.extend({
    template: '#loginTemplate',

    events: {
	'click #loginButton': 'onLoginClick'
    },

    ui: {
	nameText: "#nameText"
    },

    initialize: function(options) {
	this.vent = options.vent;
    },

    onLoginClick: function(evt) {
	this.vent.trigger("loginClick", this.ui.nameText.val());
    }
});

