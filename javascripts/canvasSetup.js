class CanvasContainer {
    constructor(state, canvasContainer = "canvasContainer") {
        this._state = state;
        this._canvas = document.getElementById(canvasContainer)
                        .getElementsByTagName("canvas")[0];
        this._cc = (document.getElementById(canvasContainer)).getBoundingClientRect();
        this._canvas.width = this._cc.width - 6, this._canvas.height = this._cc.height;
        this.addListenersToButtons();
    };
    addListenersToButtons() {
        var lis = document.getElementById("selectors");
        var c = lis.getElementsByTagName("li");
        for (var counter = 0, length = c.length; counter < length; counter++) 
        c[counter].addEventListener("click", function(evt){
            if (evt.target.className.indexOf("selected") == -1) {
                var selected = document.querySelectorAll(".selected")[0];
                if(selected)
                    selected.className = selected.className.replace(/selected/i, "");
                evt.target.className += " selected";
                // Change state!
                state.state = evt.target.id;
                if (evt.target.id == "info" && evt.target.innerHTML.indexOf("info") == -1)
                    evt.target.innerHTML = "Click place to<br>buy towers.<br>Click sell to<br>remove them.";
                else if (state.state = "info" && evt.target.id == "info")
                    evt.target.innerHTML = "Sorry, this<br>doesn't do<br>anything.";
            }
            else
                evt.target.className = evt.target.className.replace(/selected/i, "");
        });
    };
    get canvas() { return this._canvas; };
}

class StatWatcher {
    constructor(game) {
        this._game = game;
        this._stats = {};
        for (var x of ["money", "health", "kills", "enemyname", "enemyhealth", "enemyspawnrate"] )
            this._stats[x] = document.getElementById(x);
        this.update();
    };
    update() {
        this._stats.money.innerHTML = Math.floor(this._game.player.money.money);
        this._stats.health.innerHTML = Math.floor(this._game.player.health.health);
        this._stats.kills.innerHTML = this._game.player.kills;
        this._stats.enemyname.innerHTML = this._game._opponent._stages[this._game._opponent._currentStage][0];
        this._stats.enemyhealth.innerHTML = this._game._opponent._em[this._game._opponent._stages[this._game._opponent._currentStage][0]].health;
        this._stats.enemyspawnrate.innerHTML = this._game._opponent._stages[this._game._opponent._currentStage][1];
    }
}
