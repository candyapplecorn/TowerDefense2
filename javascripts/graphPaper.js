/*
 *  Puts view into the global namespace. View plots some "graph paper".
 */
var graphPaper = (function(){
    var obj = {
    init: function(){
        this.body = document.getElementsByTagName("body")[0];
        this.body.innerHTML += "";//"<b>some canvas demo</b><br>";
        this.canvas = document.createElement("canvas");
        this.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        return this;
    },
    resize: function(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        // Set the origin to the center
        this.context.translate(width/2, height/2);
        return this;
    },
    wipe: function(color){
        // Draw over the entire canvas to erase stuff
        this.context.fillStyle = color || 'white';
        this.context.fillRect(-this.canvas.width/2,
            -this.canvas.height/2,
            this.canvas.width,
            this.canvas.height);
        return this;
    },
    axii: function() {
        // Draw the Y axis
        this.context.beginPath();
        this.context.moveTo(0, -this.canvas.height);
        this.context.lineTo(0, this.canvas.height);
        this.context.stroke();

        // Draw the X axis
        this.context.beginPath();
        this.context.moveTo(-this.canvas.width, 0);
        this.context.lineTo(this.canvas.width, 0);
        this.context.stroke();
        return this;
    },
    graphPaper: function(bg) { return this.wipe(bg).axii(); }
    };
    return obj.init().resize(500,500).graphPaper();
}());
