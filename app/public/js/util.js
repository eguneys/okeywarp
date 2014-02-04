var stoneHeight = 64;
var stoneWidth = 48;

var AppendRegion = Marionette.Region.extend({
    open: function(view) {
	this.$el.append(view.$el);
    }
});
