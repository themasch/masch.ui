ui.Manager = {
    defaultTaskBar: null, 
    getTaskBar: function() {
        if(this.defaultTaskBar == null) {
            this.defaultTaskBar = new ui.TaskBar();
        }
        return this.defaultTaskBar;
    }
}

