ui.TaskBarEntry = function(label, win) {
    var self = this;
    this.label = label;
    this.wind  = win; 
    console.log($(win));
    $(win).bind('minimized', function() {
        self.state = "min"; 
        $(self).trigger('changed');
    }).bind('restored', function() {
        self.state = "normal"; 
        $(self).trigger('changed');
    });
}

ui.TaskBarEntry.prototype.getLabel = function() {
    return this.label;
}

ui.TaskBarEntry.prototype.setLabel = function(label) {
    this.label = label;
    $(this).trigger('changed');
}

ui.TaskBarEntry.prototype.render = function() {
    var element = $('<div />').addClass('ui-taskbar-entry');
    if(this.state == 'min') {
        element.addClass('minimized');
    }
    var self = this;
    element.text(this.label).click(function() {
        var new_state = self.wind.toggleMin.apply(self.wind);
    });
    return element;
}



