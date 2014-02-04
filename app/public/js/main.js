function MainController() {
    var self = this;

    self.GameApp = new Backbone.Marionette.Application();

    self.viewEventBus = new Backbone.Wreqr.EventAggregator();
    self.appEventBus = new Backbone.Wreqr.EventAggregator();
    
    self.usersInfoCollection = new UsersCollection();
    self.gamesInfoCollection = new GameInfoCollection();

    self.init = function() {

	self.GameApp.addRegions({
	    container: '#container'
	});

	self.GameApp.addInitializer(function() {
	    self.GameApp.container.show(new LoginView({vent: self.viewEventBus }));
	});

	self.GameApp.start();
    }
    
    self.viewEventBus.on("drawMiddleStone", function(stone) {

    });
    
    self.viewEventBus.on("drawSideStone", function(stone) {

    });
    
    self.viewEventBus.on("throwStone", function(stone) {

    });

    self.viewEventBus.on("loginClick", function() {
	
    });

    self.viewEventBus.on("playNowClick", function() {
	    
    });

}
    
$(document).ready(function() {

    var mainController = new MainController();

    mainController.init();
    
});


