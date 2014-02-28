var MainApp = function(options) {
    var self = this;

    self.eventBus = options.eventBus;

    self.apiKey = "d41adc8f-6b9e-4cf6-a";
    self.secretKey = "localhost";

    if (true) {
	self.apiKey = "d41adc8f-6b9e-4cf6-a";
	self.secretKey = "localhost";
    }
    
    self.keepPolling = true;
    
    self.connect = function(nameId) {
	AppWarp.WarpClient.initialize(self.apiKey, self.secretKey);
	self._warpclient = AppWarp.WarpClient.getInstance();

	self.ResponseHandlers = new ResponseHandlers(self, self.eventBus);
	self.setResponseListeners(self._warpclient);

	self._warpclient.connect(nameId, "");
    };

        

    self.pollOnlineUsers = function () {
	self.getOnlineUsers();
	if (self.keepPolling)
	    setTimeout(self.pollOnlineUsers, 5000);
    }


    self.getLiveRoomInfo = function(id) {
	self._warpclient.getLiveRoomInfo(id);
    }

    self.getOnlineUsers = function() {
	self._warpclient.getOnlineUsers();
    }

    self.createRoom = function(name, owner) {
	self._warpclient.createRoom(name, owner, 4, null);
    };

    self.updateRoomProperties = function(id, properties) {
	self._warpclient.updateRoomProperties(id, properties);
    };

    self.createTurnRoom = function(name, owner, properties) {
	var p = {
	    score: properties.Score,
	    time: properties.Time,
	    gosterge: properties.Gosterge,
	    esli: properties.Esli,
	    ozel: properties.Ozel
	};

	self._warpclient.createTurnRoom(name, owner, 4, p, p.time);
    };

    self.joinRoom = function(id) {
	self._warpclient.joinRoom(id);
    };

    self.leaveRoom = function(id) {
	self._warpclient.leaveRoom(id);
    };


    self.sendChat = function(chat) {
	self._warpclient.sendChat(chat);
    };

    self.sendMove = function(move) {
	self._warpclient.sendMove(move);
    };

    self.setResponseListeners = function() {
	var _warpclient = self._warpclient;
	
	_warpclient.setResponseListener(AppWarp.Events.onConnectDone, self.ResponseHandlers.onConnectDone);
        _warpclient.setResponseListener(AppWarp.Events.onGetAllRoomsDone, self.ResponseHandlers.onGetAllRoomsDone);
	_warpclient.setResponseListener(AppWarp.Events.onGetOnlineUsersDone,  self.ResponseHandlers.onGetOnlineUsersDone);
        _warpclient.setResponseListener(AppWarp.Events.onGetLiveRoomInfoDone, self.ResponseHandlers.onGetLiveRoomInfo);
        _warpclient.setResponseListener(AppWarp.Events.onJoinRoomDone, self.ResponseHandlers.onJoinRoomDone);
	_warpclient.setResponseListener(AppWarp.Events.onLeaveRoomDone, self.ResponseHandlers.onLeaveRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onSubscribeRoomDone, self.ResponseHandlers.onSubscribeRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onLeaveRoomDone, self.ResponseHandlers.onLeaveRoomDone);
        _warpclient.setResponseListener(AppWarp.Events.onUnsubscribeRoomDone, self.ResponseHandlers.onUnsubscribeRoomDone);
	_warpclient.setResponseListener(AppWarp.Events.onCreateRoomDone, self.ResponseHandlers.onCreateRoomDone);
	_warpclient.setResponseListener(AppWarp.Events.onUserChangeRoomProperty, self.ResponseHandlers.onUserChangeRoomProperty);

	_warpclient.setResponseListener(AppWarp.Events.onSendMoveDone, self.ResponseHandlers.onSendMoveDone);

	_warpclient.setNotifyListener(AppWarp.Events.onChatReceived, self.ResponseHandlers.onChatReceived);

	_warpclient.setNotifyListener(AppWarp.Events.onUserJoinedRoom, self.ResponseHandlers.onUserJoinedRoom);
	_warpclient.setNotifyListener(AppWarp.Events.onUserLeftRoom, self.ResponseHandlers.onUserLeftRoom);
	_warpclient.setNotifyListener(AppWarp.Events.onGameStarted, self.ResponseHandlers.onGameStarted);
	_warpclient.setNotifyListener(AppWarp.Events.onMoveCompleted, self.ResponseHandlers.onMoveCompleted);
    }

    // auto join when a room is created
    self.eventBus.on("createRoomDone", function(room) {
	self.joinRoom(room.getRoomId());
    });

};



var ResponseHandlers = function(base, eventBus) {
    var self = this;

    self.base = base;
    self._warpclient = base._warpclient;
    self._eventBus = eventBus;
    
    self.onConnectDone = function(res) {
	if (res == AppWarp.ResultCode.Success)
	{
	    self._eventBus.trigger("connectDone");

	    self.base.pollOnlineUsers();
	    self._warpclient.getAllRooms();

	    
	}  else {
	    console.log(res);
	}
    };

    self.onGetAllRoomsDone = function(rooms) {
	for (var i = 0; i< rooms.getRoomIds().length; ++i) {
	    self._warpclient.getLiveRoomInfo(rooms.getRoomIds()[i]);
	}
    };

    self.onGetOnlineUsersDone = function(users) {
	self._eventBus.trigger("onlineUsers", users.getUsernames());
    };
    
    self.onGetLiveRoomInfo = function(room) {
	self._eventBus.trigger("liveRoomInfo", room);
    };
    
    self.onJoinRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	   self._warpclient.subscribeRoom(room.getRoomId());
	} else {
	    console.log('err: ' + room.getResult());
	}
    };

    self.onLeaveRoomDone = function(room) {
	console.log('here');
	self._eventBus.trigger("leaveRoomDone");
    };
    
    self.onSubscribeRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	    self._eventBus.trigger("subscribeRoomDone", room);
	} else {
	    console.log('err: ' + room.getResult());
	}
	
    };
    
    self.onLeaveRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	    self._eventBus.trigger("leaveRoomDone", room);
	} else {
	    console.log('err: ' + room.getResult());
	}
    };

    self.onUnsubscribeRoomDone = function(room) {
    };



    self.onCreateRoomDone = function(room) {
	if (room.getResult() == AppWarp.ResultCode.Success) {
	    self._eventBus.trigger("createRoomDone", room);
	} else {
	    console.log("err : " + room.getResult());
	}
    };

    self.onUserChangeRoomProperty = function(username, properties, lockTable) {
	console.log({ u: username, p: properties, l: lockTable });
    };

    self.onSendMoveDone = function(event) {
	console.log(event);
    }

    
    // Notify Listeners
    self.onChatReceived = function(chat) {
	self._eventBus.trigger("chatReceived", chat);
    };

    self.onUserLeftRoom = function(room, user) {
	self._eventBus.trigger("userLeftRoom", { room: room, username: user });
    };

    self.onUserJoinedRoom = function(room, user) {
	self._eventBus.trigger("userJoinedRoom", { room: room, username: user});
    };

    self.onGameStarted = function(sender, room, nextTurn) {
	self._eventBus.trigger("gameStarted", {sender: sender, room: room, nextTurn: nextTurn });
	
    };

    self.onMoveCompleted = function(move) {
	self._eventBus.trigger("moveCompleted", move);
    };
}
