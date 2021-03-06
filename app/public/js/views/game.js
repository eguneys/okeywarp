var GameTabView = Backbone.Marionette.Layout.extend({
    template: "#gameTabTemplate",

    regions: {
	gameLayoutRegion: "#gamelayout",
	chatLayoutRegion: "#chatlayout"
    },

    initialize: function(options) {
	this.vent = options.vent;
	this.gameModel = options.gameModel;
    },

    onShow: function() {
	this.gameLayoutRegion.show(new GameLayout({ model: this.gameModel, vent: this.vent }));
	this.chatLayoutRegion.show(new GameChatLayout({ model: this.gameModel.get("chatModel"), vent: this.vent }));
    }
});

var GameChatLayout = Backbone.Marionette.Layout.extend({
    template: "#gameChatTemplate",

    regions: {
	chatRegion: "#gamechatList",
	userRegion: "#gameuserList"
    },

    events: {
	"keypress #chatbox": "onChatPress"
    },

    ui: {
	chatbox: "#chatbox"
    },
    
    initialize: function(options) {
	this.vent = options.vent;
    },

    onShow: function() {
	this.chatRegion.show(new ChatCollectionView({ collection: this.model.chats()}));
    },

    onChatPress: function(evt, value) {
	if (evt.charCode == 13) {
	    this.vent.trigger("chatRequest", this.ui.chatbox.val());
	    this.ui.chatbox.val("");
	    return false;
	}
    },

    chatAdded: function() {
	console.log("yey");
    }

    

});

var ChatView = Backbone.Marionette.ItemView.extend({
    template: "#chatTemplate",
    className: "list-group-item chat-item"
});

var ChatCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: ChatView,

    onAfterItemAdded: function(itemView) {
	$(".nano").nanoScroller();
	$(".nano").nanoScroller({ scroll: "bottom" });
    }
});

var GameLayout = Backbone.Marionette.Layout.extend({
    template: "#gameLayoutTemplate",

    regions: {
	topRegion: ".gameHud",
	playersRegion: ".playersContainer",
	stonesRegion: ".stonesContainer",

	drawMiddleRegion: ".drawMiddle",

	throwBottomRegion: ".throwBottom",
	throwTopRegion: ".throwTop",
	throwRightRegion: ".throwRight",
	throwLeftRegion: ".throwLeft",

	gostergeRegion: ".gosterge",
    },

    initialize: function(options) {
	this.vent = options.vent;
    },

    onShow: function() {

	this.topRegion.show(new GameHudView({vent: this.vent}));
	
	this.playersRegion.show(new PlayersCollectionView({ collection: this.model.players()}));

	this.stonesRegion.show(new StonesCollectionView({ vent: this.vent, collection: this.model.stones() }));
	
	this.throwBottomRegion.show(new ThrowStonesCollectionView({ collection: this.model.throwStones().bottom }));
	this.throwTopRegion.show(new ThrowStonesCollectionView({ collection: this.model.throwStones().top }));
	this.throwRightRegion.show(new ThrowStonesCollectionView({ collection: this.model.throwStones().right }));
	
	this.throwLeftRegion.show(new DrawStonesCollectionView({ collection: this.model.throwStones().left, vent: this.vent }));

	
	this.drawMiddleRegion.show(new MiddleStonesCollectionView({ collection: this.model.middleStones(), vent: this.vent }));


	this.gostergeRegion.show(new StoneView({ model: this.model.get('gostergeStone')}));
	
       },
   });

   var GameHudView = Backbone.Marionette.ItemView.extend({
       template: "#gameHudTemplate",

       events: {
	   "click #leaveRoomModalButton": "leaveRoomModalButtonClick",
	   "click #leaveRoomButton": "leaveRoomButtonClick"
       },

       ui: {
	   leaveRoomModal: "#leaveRoomModal"
       },

       initialize: function(options) {
	   this.vent = options.vent;
       },

       onShow: function() {
	   var that = this;

	   this.ui.leaveRoomModal.on('hidden.bs.modal', function() {
	       if (that.leaveRoom) that.vent.trigger("leaveRoomClick");
	   });
       },

       leaveRoomModalButtonClick: function() {
	   this.ui.leaveRoomModal.modal('show');
       },

       leaveRoomButtonClick: function() {
	   this.leaveRoom = true;
	   this.ui.leaveRoomModal.modal('hide');
       }
   });

   var StoneView = Backbone.Marionette.ItemView.extend({
       template: "#stoneTemplate",

       modelEvents: {
	   'change': 'modelChanged'
       },

       modelChanged: function() {
	   this.render();
       }
      
   });


   var ThrowStonesCollectionView = Backbone.Marionette.CollectionView.extend({
       itemView: StoneView,
   });

   var DrawStonesCollectionView = Backbone.Marionette.CollectionView.extend({
       itemView: StoneView,

       initialize: function(options) {
	   this.vent = options.vent;
       },

       onAfterItemAdded: function(itemView) {
	   var that = this;
	   
       Draggable.create(itemView.$el.children(), {
	   bounds: ".throwLeft",
	   type: "top,left",
	   edgeResistance: 0.01,
	   throwProps: true,
	   maxDuration: 0.5,

	   onDragEnd: function(evt) {

	       var pos = {};

	       pos.x = evt.pageX;
	       pos.y = evt.pageY;

	       var isHit = $('.stonesContainer').hitTestPoint({x: pos.x, y: pos.y });

	       if (isHit)
	       {
		   var offset = $('.stonesContainer').offset();
		   pos.x = pos.x - offset.left;
		   pos.y = pos.y - offset.top;
		    
		   that.vent.trigger("drawSideStone:offset", pos);
		   that.vent.trigger("drawSideStone");
	       }

	   }
       });

    }
});

var MiddleStonesCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: StoneView,

    initialize: function(options) {
	this.vent = options.vent;
    },

    onAfterItemAdded: function(itemView) {
	var that = this;
	
	Draggable.create(itemView.$el.children(), {
	    bounds: ".drawMiddle",
	    type: "top,left",
	    edgeResistance: 0.01,
	    throwProps: true,
	    maxDuration: 0.5,

	    onDragEnd: function(evt) {

		var pos = {};

		pos.x = evt.pageX;
		pos.y = evt.pageY;

		var isHit = $('.stonesContainer').hitTestPoint({x: pos.x, y: pos.y });

		if (isHit)
		{
		    var offset = $('.stonesContainer').offset();
		    pos.x = pos.x - offset.left;
		    pos.y = pos.y - offset.top;
		    
		    that.vent.trigger("drawMiddleStone:offset", pos);
		    that.vent.trigger("drawMiddleStone");
		}
		
	    }
	});
	
    }
});

var StonesCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: StoneView,

    initialize: function(options) {
	this.vent = options.vent;
    },

    onAfterItemAdded: function(itemView) {
	var that = this;

	var xSnap = function(endValue) {
			endValue += stoneWidth / 2;
			if (endValue < stoneWidth) return stoneWidth;
			else if (endValue < 675) return Math.round(endValue / stoneWidth) * stoneWidth;
			return 675;
		    };

	var ySnap = function(endValue) {
			endValue += stoneHeight / 2;
			return endValue>stoneHeight?stoneHeight:0;
		    };

	itemView.$el.children().css('top', ySnap(itemView.$el.children().css('top').replace('px', '') - 0));
	itemView.$el.children().css('left', xSnap(itemView.$el.children().css('left').replace('px', '') - 0));
	
	Draggable.create(itemView.$el.children(), {
		bounds: ".stonesContainer",
		type: "top,left",
		throwProps: true,
		edgeResistance: 0.01,
		maxDuration: 0.5,
		snap: {
		    x: xSnap,
		    y: ySnap
		},
		onDragStart: function() {
		    
		},

		onDragEnd: function(evt) {
		    var pos = {};
		    
		    pos.x = evt.pageX;
		    pos.y = evt.pageY;

		    var isHit = $('.throwBottom').hitTestPoint({x:pos.x, y:pos.y});

		    if (isHit)
		    {
			that.vent.trigger("throwStone", $(evt.target).attr("stoneType"));
		    }
		}
	    });
    }
});

var PlayerView = Backbone.Marionette.ItemView.extend({
    template: "#playerTemplate",

    modelEvents: {
	'change:turnLeft': 'turnLeftChanged',
	'change:side': 'sideChanged'
    },

    turnLeftChanged: function() {
	this.render();
    },

    sideChanged: function() {
	this.render();
    }
    
    
});


var PlayersCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: PlayerView,
});
