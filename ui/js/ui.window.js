/**
 * Lizenz:
 *  Solange Sie diesen Vermerk nicht entfernen, können Sie mit der
 *  Datei machen, was Sie möchten. Wenn wir uns eines Tages treffen
 *  und Sie denken, die Datei ist es wert, können Sie mir dafür ein
 *  Bier ausgeben.
 *
 * Author: Mark Schmale <masch@masch.it>
 *
 **/
 ui.Window = function(options) {
    var defaults = {
        top: 200, 
        left: 50, 
        width: 500, 
        height: 200, 
        content: '', 
        contentUrl: null, 
        contentElement: null, 
        buttons: ['min', 'max', 'close']
    };
    // settings
    var set  = $.extend({}, defaults, options);
    var self = this;

    this.state = 'normal';

    this.element = $('<div></div>').addClass('window window-stack')
                                   .css({
                                        top: set.top, 
                                        left: set.left, 
                                        width: set.width, 
                                        height: set.height
                                   });;
    var title = $('<div></div>').addClass('title').appendTo(this.element);
    this.eleTitle = $('<span />').addClass('text').appendTo(title);
    this.eleButtons = $('<span />').addClass('buttons').appendTo(title);
    this.buttons = {};
    this.eleContent = $('<div></div>').addClass('content').appendTo(this.element);
    title = $('<div></div>').addClass('footer').appendTo(this.element);
    this.eleStatus = $('<span />').addClass('text').appendTo(title);
    this.element.appendTo('body')
                .draggable({
                    handle: 'div.title', 
                    stack: '.window-stack',
                    stop: function(event, ui) {
                        if(ui.position.top < 0){
                            self.element.css('top', 0);
                        }
                    }
                })
                .resizable();

    // add buttons
    this.btnWidth = 0;
    for(var i in set.buttons) {
        var txt = set.buttons[i];
        this.buttons[txt] = $('<img />').addClass('window-button-' + txt).attr('src', './ui/img/' + txt + '_icon.png').appendTo(this.eleButtons);
        this.btnWidth += 16;
    }

    // bind default functions
    // close
    if(this.buttons.close) {
        this.buttons.close.click(function() {
            self.close();
        });
    }
    // minimize
    if(this.buttons.min) {
        this.buttons.min.click(function() {
            self.toggleMin();
        });
    }

    
    
    this.eleTitle.text(set.title);
    this.tbEntry = ui.Manager.getTaskBar().addEntry(set.title, this);
    if(set.contentUrl) {
        this.loadContent(set.contentUrl);
    } 
    else if(set.contentElement) {
        this.eleContent.html($(set.contentElement).html());
    }
    else {
        this.eleContent.html(set.content);
    } 

    var minWidth = this.eleTitle.width() + this.btnWidth + 10;
    this.setMinWidth(minWidth);
}
ui.Window.prototype.toggleMin = function() {
    if(this.state == 'min') {
        this.restore();
    } else {
        this.minimize();
    }
}

ui.Window.prototype.setMinWidth = function(w) {
if(this.element.width() < w) {
    this.element.css('width', w);
}
this.element.resizable('option', 'minWidth', w);
}

ui.Window.prototype.close = function() {
this.element.remove();
$(this).trigger('closed');
}

ui.Window.prototype.minimize = function() {
    this.state = 'min';
    if(!ui.useTaskBar) {
        this.eleContent.hide();
        $(this.element).data('win.old_height', $(this.element).height())
                       .data('win.old_top', $(this.element).position().top)
                       .data('win.old_width', $(this.element).width())
                       .css({'height': 0, bottom: '5px', top: '', 'width': this.element.resizable('option', 'minWidth')});
    } else {
        this.element.hide();
    }
    $(this).trigger('minimized');
}

ui.Window.prototype.restore = function() {
    this.state = 'normal';
    if(!ui.useTaskBar) {
        var h = $(this.element).data('win.old_height');
        var w = $(this.element).data('win.old_width');
        var b = $(this.element).data('win.old_top');
        $(this.element).css({'height': h, top: b, bottom: '', width: w});
        this.eleContent.show();
    } else {
        this.element.show();
    }
    $(this).trigger('restored');
}

ui.Window.prototype.setTitle = function(value) {
    this.eleTitle.html(value);    
    this.setMinWidth(this.btnWidth + this.eleTitle.width() + 10);
    this.tbEntry.setLabel(value);
    $(this).trigger('title-updated');
}

ui.Window.prototype.loadContent = function(url) {
    var self = this;
    var old_status = this.eleStatus.html();
    this.eleStatus.html('loading content...');
    $.get(url, function(txt) {
        self.eleContent.html(txt);
        self.eleStatus.html("" + old_status);
    }, 'plain');
}

ui.Window.prototype.setContent = function(value) {
    this.eleContent.html(value);
    $(this).trigger('content-updated');
}

ui.Window.prototype.setAlwaysOnTop = function(set) {
    if(set !== false) {
        set = true;
    }
    if(set) {
        this.element.addClass('always-on-top');
    } else {
        this.element.removeClass('always-on-top');
    }
}
