function MainController() {
    var self = this;

    self.GameApp = new Backbone.Marionette.Application();

    self.viewEventBus = new Backbone.Wreqr.EventAggregator();
    self.appEventBus = new Backbone.Wreqr.EventAggregator();

    self.lastOffset = {
	middleStone: { x: 0, y: 0 },
	sideStone: { x: 0, y: 0 }
    };
    
    self.usersInfoCollection = new UserCollection();
    self.gamesInfoCollection = new GameInfoCollection();

    self.homeModel = new HomeModel();
    self.userModel = new UserModel();

    self.gameModel = null;

    self.init = function() {

	self.MainApp = new MainApp({ eventBus: self.appEventBus });

	self.GameApp.addRegions({
	    container: '#container',
	    topbar: '#topbar'
	});

	self.GameApp.addInitializer(function() {
	    self.GameApp.container.show(new LoginView({vent: self.viewEventBus }));
	});

	self.GameApp.start();
    }
    
    self.viewEventBus.on("drawMiddleStone", function(stone) {
	self.MainApp.sendMove({ type: GameConstants.ME_DRAW_CARD_MIDDLE });
    });

    self.viewEventBus.on("drawMiddleStone:offset", function(pos) {
	self.lastOffset.middleStone = pos;
    });
    
    self.viewEventBus.on("drawSideStone", function(stone) {
	self.MainApp.sendMove({ type: GameConstants.ME_DRAW_CARD_SIDE });
    });

    self.viewEventBus.on("drawSideStone:offset", function(pos) {
	self.lastOffset.sideStone = pos;
    });
    
    self.viewEventBus.on("throwStone", function(stone) {
	self.MainApp.sendMove({ type: GameConstants.ME_THROW_CARD, card: stone });
    });

    self.viewEventBus.on("endGame", function(stone) {

    });

    self.viewEventBus.on("chatRequest", function(chat) {
	self.MainApp.sendChat(chat);
    });

    self.viewEventBus.on("loginClick", function(username) {
	self.MainApp.connect(username);
    });

    self.viewEventBus.on("playNowClick", function() {
	
    });

    self.viewEventBus.on("createRoomClick", function() {
	var properties = self.homeModel.get("newRoomProperties");

	self.MainApp.createTurnRoom("quickRoom", "name", properties);
    });

    self.viewEventBus.on("joinRoomClick", function(id) {
	self.MainApp.joinRoom(id);
    });


    self.viewEventBus.on("leaveRoomClick", function() {
	var id = self.gameModel.get('room').getRoomId();
	self.MainApp.leaveRoom(id);
    });
    


    self.appEventBus.on("connectDone", function() {
	self.GameApp.topbar.show(new TopBarView({
	    vent: self.viewEventBus,
	    model: self.userModel
	}));
	self.GameApp.container.show(new HomeLayout({
	    vent: self.viewEventBus,
	    homeModel: self.homeModel,
	    usersInfoCollection: self.usersInfoCollection,
	    gamesInfoCollection: self.gamesInfoCollection
	}));	
    });

    
    self.appEventBus.on("onlineUsers", function(users) {
	var models = [];
        for (var i in users) {
            models.push(new UserModel({name: users[i] }));
        }

	self.usersInfoCollection.reset(models);
    });

    
    self.appEventBus.on("liveRoomInfo", function(room) {
	if (self.gameModel && self.gameModel.get('room').getRoomId() == room.getRoom().getRoomId()) {
	    var usernames = room.getUsers();
	    var myside = usernames.length - 1;
	    
	    self.gameModel.set("MySide", myside);

	    for (var i in usernames) {
                self.gameModel.players().add(new PlayerModel({ name: usernames[i], side: UserSides[(i - myside + 4) % 4] }));
	    }
	    
            self.MainApp.sendChat("AppWarp2Sync ready");
	} else
	if (room.json.maxUsers == 4) {
	    var users = room.getUsers();
	    var room = room.getRoom();
	    self.gamesInfoCollection.add(new GameInfoModel({ room: room, id: room.getRoomId(), name: room.json.name, players: users }));
	}
    });

    
    self.appEventBus.on("subscribeRoomDone", function(room) {
	self.gameModel = new GameModel({ room: room });

	var once = true;
	
	self.gameModel.on("change:Turn", function() {
	    self.gameModel.players().each(function(item) {
		item.set("turnLeft", 0);
	    });
	    
	    self.gameModel.turnPlayer().set("turnLeft", 100);

	    if (once) {
		once = false;
			
		(function countdown() {
		    var turnLeft = self.gameModel.turnPlayer().get("turnLeft");

		    if (turnLeft <= 0) {
			
		    }
		    else {
			self.gameModel.turnPlayer().set("turnLeft", turnLeft - (100 / 24));
		    }
		    setTimeout(countdown, 1000);
		})();
	    }
	});

	
	self.GameApp.container.show(new GameTabView({ gameModel: self.gameModel, vent: self.viewEventBus }));

	self.MainApp.getLiveRoomInfo(room.getRoomId());
    });

    
    self.appEventBus.on("leaveRoomDone", function(room) {
	self.GameApp.container.show(new HomeLayout({
	    vent: self.viewEventBus,
	    homeModel: self.homeModel,
	    usersInfoCollection: self.usersInfoCollection,
	    gamesInfoCollection: self.gamesInfoCollection
	}));
    });

    
    self.appEventBus.on("chatReceived", function(chat) {
	if (self.gameModel) {
	    
	    if (chat.getSender() == GameConstants.SERVER_NAME) {
		var command = JSON.parse(chat.getChat());
		switch(command.type) {
		    case GameConstants.PLAYER_HAND: {
			var stones = command[self.gameModel.myPlayer().get('name')];
			console.log(stones);
			self.gameModel.stones().reset(_.map(stones, function(item, index) {
			    return new StoneModel({ stoneType: item , left: (index + 1) * stoneWidth });
			}));
		    } break;
		    case GameConstants.GAME_STARTINFO: {
			self.gameModel.set("gosterge", new StoneModel({ stoneType: command.gosterge }));
			self.gameModel.middleStones().add(new StoneModel({ stoneType: "54"}));
		    } break;
		    case GameConstants.ME_DRAW_CARD_MIDDLE: {
			
		    } break;
		    case GameConstants.ME_DRAW_CARD_MIDDLE_INFO: {
			self.gameModel.middleStones().pop();
			self.gameModel.middleStones().add(new StoneModel({ stoneType: "54" }));
			self.gameModel.stones().add(new StoneModel({ stoneType: command.card - 0, top: self.lastOffset.middleStone.y, left: self.lastOffset.middleStone.x }));
			
		    } break;
		    case GameConstants.ME_DRAW_CARD_SIDE: {
			var previousSide = PreviousSide(self.gameModel.turnPlayer().get("side"));
			var stone = self.gameModel.throwStones()[previousSide].pop();
			var stoneType = stone.get("stoneType");

			if (self.gameModel.turnPlayer().get("side") == "bottom") {
			    self.gameModel.stones().add(new StoneModel({ stoneType: stoneType - 0, top: self.lastOffset.sideStone.y, left: self.lastOffset.sideStone.x }));
			}
			
		    } break;
		    case GameConstants.ME_AUTO_THROW: {
			var previousTurn = self.gameModel.turnPlayer();
			
			self.gameModel.throwStones()[previousTurn.get("side")].add(new StoneModel({ stoneType: command.card }));

			if (previousTurn.get("side") == "bottom") {
			    var stone = self.gameModel.stones().findWhere({ stoneType: command.card - 0 });
			    self.gameModel.stones().remove(stone);
			}

		    } break;
		}
	    }
	    
	    else {
		var chatModel = self.gameModel.get("chatModel");
		
		chatModel.chats().push(new ChatModel({ sender: chat.getSender(), message: chat.getChat() }));
	    }
	}
    });

    
    self.appEventBus.on("userJoinedRoom", function(args) {
	if (self.gameModel && self.gameModel.get("room").getRoomId() == args.room.getRoomId()) {
	    var i = self.gameModel.players().length;
	    var myside = self.gameModel.get("MySide");
	    
            self.gameModel.players().add(new PlayerModel({ name: args.username, side: UserSides[(i - myside + 4) % 4] }));

        }
    });

    
    self.appEventBus.on("userLeftRoom", function(args) {
	if (self.gameModel && self.gameModel.get("room").getRoomId() == args.room.getRoomId()) {
	    var player = self.gameModel.players().findWhere({ name: args.username });
	    self.gameModel.players().remove(player);

	    var myside = self.gameModel.get("MySide");

	    var leftside = (UserSides.indexOf(player.get("side")) + myside) % 4;

	    var leftsideBackup = leftside;

	    while (++leftside < 4) {
		var decreasePlayer = self.gameModel.players().findWhere({ side: UserSides[(leftside - myside + 4) % 4] });

		if (!decreasePlayer) break;

		decreasePlayer.set("side", PreviousSide(decreasePlayer.get("side")));
	    }

	    if (myside - 0 > leftsideBackup - 0) {
		self.gameModel.players().forEach(function(item) {
		    item.set("side", NextSide(item.get("side")));
		});

		self.gameModel.set("MySide", myside - 1);
	    }
	    
        }	
    });
    
    self.appEventBus.on("gameStarted", function(args) {
	self.gameModel.set("Turn", args.nextTurn);
    });

    
    self.appEventBus.on("moveCompleted", function(move) {
	var previousTurn = self.gameModel.turnPlayer();
	
	self.gameModel.set("Turn", move.getNextTurn());


	if (!move.getMoveData()) {
	    console.log('turn expired');
	    return;
	}
	
	var data = JSON.parse(move.getMoveData());

	self.gameModel.throwStones()[previousTurn.get("side")].add(new StoneModel({ stoneType: data.card }));

	if (previousTurn.get("side") == "bottom") {
	    var stone = self.gameModel.stones().findWhere({ stoneType: data.card - 0 });
	    self.gameModel.stones().remove(stone);
	}
    });

}
    
$(document).ready(function() {

    var mainController = new MainController();

    mainController.init();
    
});


