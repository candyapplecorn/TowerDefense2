class Collider {
    constructor(){

    }
}
// Game will be passed elapsed time
// and update things accordingly
class Game {
    constructor() {
        this._collider; // Used for tower shooting @ things
        this._projectiles = []; // List to contain all projectiles
    }

    /*
     *  elapsed: milliseconds
     */
    update (elapsed) {
        this._projectiles = this._projectiles.filter( x => {
            x.move(elapsed); 
            if (x.done) {
                // Have x deal its damage to its target
            }
            return !x.done;
        });
    }
    // step is alias for update
    step (elapsed) { this.update(elapsed); }
}

        /*for (var projectile of this._projectiles) {
            projectile.move(elapsed);
            if (projectile.done()) {
                // have it do damage
            }
        //}
        // Prune used up projectiles from list
        //this._projectiles = this._projectiles.filter(x=>!x.done);*/
