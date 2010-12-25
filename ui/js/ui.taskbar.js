ui.TaskBar = function() {
    this.element = $('<div />').addClass('ui-taskbar');
    this.element.appendTo('body');
    this.entrys = [];
    this.recreate();
}

ui.TaskBar.prototype.addEntry = function(label, win) {
    var entry = new ui.TaskBarEntry(label, win );
    this.entrys.push(entry);
    var self = this;
    $(entry).bind('changed', function() { self.recreate(); });
    this.recreate();
    return entry;
}

ui.TaskBar.prototype.recreate = function() {
    this.element.html("");
    var self = this;
    for(var i=0;i<this.entrys.length;i++) {
        var obj = this.entrys[i].render();
        obj.appendTo(this.element).click(function() {
            console.log("click");
        });

    }
}
