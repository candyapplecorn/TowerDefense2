// Collider detects collisions between:
//  - Enemies and Towers
//  - Projectiles and Enemies
// Collider takes care of creating projectiles,
// making towers fire, and updating/removing projectiles, 
// towers and enemies.
class Collider {
    constructor(){};
    update(elapsed, projectiles, enemies, towers) {
        // Make all projectiles move
        projectiles = projectiles.filter(function(x){
            if (!x.AI.target) return false;   
            x.move(elapsed); // Always setting done to true
            if (x.done) {
                if (x.target)
                    x.target.health.takeDamage(x.damage.damage);
                return false;
            }
            else return true;
        });
        // Make all towers fire at available enemies if possible
        //function pyp(x1, y1, x2, y2){ return Math.sqrt(Math.pow(Math.floor(x1 - x2), 2) + Math.pow(Math.floor(y1 - y2)), 2); }
        //function pyob(a, b){ return pyp(a.x, a.y, b.x, b.y); }
        for (var tow of towers) {
            tow.update(elapsed);
            if (tow.ready && tow.target && tow.target.health.alive() && Math.sqrt(Math.pow(Math.floor(tow.position.x - tow.target.position.x), 2) + Math.pow((tow.position.y - tow.target.position.y), 2))<= tow.range) {

                projectiles.push(tow.fire(tow.target));
                break;
            }
            else if (tow.ready)
                for (var enem of enemies)
                    // This is where a data structure for collisions would help
                    if (Math.sqrt(Math.pow(Math.floor(tow.position.x - enem.position.x), 2) + Math.pow((tow.position.y - enem.position.y), 2))<= tow.range) {
                        projectiles.push(tow.fire(enem));
                        break;
                    }
        }
        // Make all enemies move -- Identical code to projectiles!
        enemies = enemies.filter(function(x){
            if (!x.AI.target || !x.health.alive()) return false;   
            x.move(elapsed);
            if (!x.done) return true;
            if (x.AI.target.pathValue != 0) {
                x.AI.target = x.AI.target._prev, x._done = false;
                return true;
            }
            if (x.target && x.target.health) {
                x.target.health.takeDamage(x.damage.damage);
                console.log("Tower's health: ", x.target.health.health);
            }
            return false;
        });
        return [ projectiles, enemies];
    };
}
// Game will be passed elapsed time
// and update things accordingly
class Game {
    constructor(mrows = 10, mcols = 10, mh = 400, mw = 400) {
        this._projectiles = []; // List to contain all projectiles
        this._enemies = [];
        //this._towers = []; // At the moment just a single tower.
        this._collider = new Collider(); 
        this._elapsed = 4000;
        this._map = new Map(mrows, mcols, mh, mw); // map.tiles.filter(x => x.tower != null).map(x => x.tower)
    }

    get projectiles() { return this._projectiles; };
    set projectiles(projectiles = []) { this._projectiles = projectiles; };
    get towers() { return this._map.towers; };
    get enemies() { return this._enemies; };
    set enemies(enemies = []) { this._enemies = enemies; };
    /*
     *  elapsed: milliseconds
     */
    update (elapsed) {
        //this._map.calculatePathing(); // If returns false, error!
        [ this._projectiles, this._enemies ] =
        this._collider.update(elapsed, this._projectiles, this._enemies, this.towers);
        this.spawnEnemy(elapsed);
    }
    // step is alias for update
    step (elapsed) { this.update(elapsed); }

    spawnEnemy (elapsed) {
        this._elapsed += elapsed;
        if (this._elapsed < 2500) return;
        this._enemies.push(new TinyEnemy(
            0,0,this._map._begin
        ));
        this._elapsed -= 2500;
    }
}
