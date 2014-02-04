var GameApp = new Backbone.Marionette.Application();

var HomeLayout = Backbone.Marionette.Layout.extend({
    template: "#homeTemplate",

    regions: {
	tabRegion: "#homeTabs"
    },

    initialize: function(options) {
	this.vent = options.vent;

	this.usersInfoCollection = options.usersInfoCollection;
	this.gamesInfoCollection = options.gamesInfoCollection;
    },

    
    onShow: function() {
	this.tabRegion.show(new HomeTabView({
	    vent: this.vent,
	    usersCollection: this.usersInfoCollection,
	    gamesCollection: this.gamesInfoCollection,
	}));
    }
});

var HomeTabView = Backbone.Marionette.Layout.extend({
    template: "#homeTabTemplate",

    events: {
	"click #playNow": "playNowClick"
    },
    
    regions: {
	usersRegion: "#userlist",
	gamesRegion: "#gamelist",
    },

    initialize: function(options) {
	this.vent = options.vent;

	this.usersCollection = options.usersCollection;
	this.gamesCollection = options.gamesCollection;
    },

    onShow: function() {
	this.usersRegion.show(new UsersCollectionView({ collection: this.usersCollection }));
	this.gamesRegion.show(new GameInfoCollectionView({ collection: this.gamesCollection }));
	
    },

    playNowClick: function() {
	this.vent.trigger("playNowClick");
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

    initialize: function(options) {
	this.vent = options.vent;
    },

    onLoginClick: function(evt) {
	this.vent.trigger("loginClick");
    }
});



GameApp.addRegions({
    container: '#container'
});


GameApp.addInitializer(function() {
    var viewEventBus = new Backbone.Wreqr.EventAggregator();

    var usersInfoCollection = new UsersCollection();
    var gamesInfoCollection = new GameInfoCollection();

    var homeLayoutView;
    
    GameApp.container.show(new LoginView({vent: viewEventBus }));

    viewEventBus.on("throwStone", function(stone) {
	console.log(stone);
    });

    viewEventBus.on("loginClick", function() {

	homeLayoutView = new HomeLayout({
	    vent: viewEventBus,
	    usersInfoCollection: usersInfoCollection,
	    gamesInfoCollection: gamesInfoCollection,
	});
	
	GameApp.container.show(homeLayoutView);
    });

    viewEventBus.on("playNowClick", function() {
	gamesInfoCollection.add(new GameInfoModel());
	var gameModel = new GameModel();

	homeLayoutView.tabRegion.show(new GameLayout({model: gameModel}));

    });
   
});
