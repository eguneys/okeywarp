

var GameLayout = Backbone.Marionette.Layout.extend({
    template: "#gameLayoutTemplate",

    regions: {
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
	this.playersRegion.show(new PlayersCollectionView({ collection: this.model.players}));

	this.stonesRegion.show(new StonesCollectionView({ vent: this.vent, collection: this.model.stones }));
	
	this.throwBottomRegion.show(new ThrowStonesCollectionView({ collection: this.model.throwStones.bottom }));
	this.throwTopRegion.show(new ThrowStonesCollectionView({ collection: this.model.throwStones.top }));
	this.throwRightRegion.show(new ThrowStonesCollectionView({ collection: this.model.throwStones.right }));
	
	this.throwLeftRegion.show(new DrawStonesCollectionView({ collection: this.model.throwStones.left }));

	
	this.drawMiddleRegion.show(new MiddleStonesCollectionView({ collection: this.model.middleStones}));


	this.gostergeRegion.show(new StoneView({ model: this.model.get('gostergeStone')}));
	
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

       onAfterItemAdded: function(itemView) {

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

	       if (isHit) this.vent.trigger("drawSideStone");

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

		if (isHit) that.vent.trigger("drawMiddleStone");
		
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
	
	Draggable.create(itemView.$el.children(), {
		bounds: ".stonesContainer",
		type: "top,left",
		throwProps: true,
		edgeResistance: 0.01,
		maxDuration: 0.5,
		snap: {
		    x: function(endValue) {
			endValue += stoneWidth / 2;
			if (endValue < stoneWidth) return stoneWidth;
			else if (endValue < 675) return Math.round(endValue / stoneWidth) * stoneWidth;
			return 675;
		    },
		    y: function(endValue) {
			endValue += stoneHeight / 2;
			return endValue>stoneHeight?stoneHeight:0;
		    }
		},
		onDragStart: function() {
		    
		},

		onDragEnd: function(evt) {
		    var pos = {};
		    
		    pos.x = evt.pageX;
		    pos.y = evt.pageY;

		    var isHit = $('.throwBottom').hitTestPoint({x:pos.x, y:pos.y});

		    if (isHit) that.vent.trigger("throwStone", evt.target);
		}
	    });
    }
});

var PlayerView = Backbone.Marionette.ItemView.extend({
    template: "#playerTemplate"
});


var PlayersCollectionView = Backbone.Marionette.CollectionView.extend({
    itemView: PlayerView,
});
