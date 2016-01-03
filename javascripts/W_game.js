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
        for (var tow of towers) {
            tow.update(elapsed);
            if (tow.ready)
                for (var enem of enemies)
                    // This is where a data structure for collisions would help
                    if (PythagoreanObj({x: enem.position.x, y: enem.position.y}, tow.position.position) <= tow.range) {
                        projectiles.push(tow.fire(enem));
                        break;
                    }
        }
        // Make all enemies move -- Identical code to projectiles!
        enemies = enemies.filter(function(x){
            if (!x.AI.target || !x.health.alive()) return false;   
            x.move(elapsed);
            if (x.done) {
                if (x.target && x.target.health) {
                    x.target.health.takeDamage(x.damage.damage);
                    console.log("Tower's health: ", x.target.health.health);
                }
                return false;
            }
            else return true;
        });
        return [ projectiles, shuffle(enemies), towers ];
    };
}
// Game will be passed elapsed time
// and update things accordingly
class Game {
    constructor() {
        this._projectiles = []; // List to contain all projectiles
        this._enemies = [];
        this._towers = []; // At the moment just a single tower.
        this._collider = new Collider(); 
        this._elapsed = 4000;
    }

    get projectiles() { return this._projectiles; };
    set projectiles(projectiles = []) { this._projectiles = projectiles; };
    get towers() { return this._towers; };
    set towers(towers = []) { this._towers = towers; };
    get enemies() { return this._enemies; };
    set enemies(enemies = []) { this._enemies = enemies; };
    /*
     *  elapsed: milliseconds
     */
    update (elapsed) {
        [ this._projectiles, this._enemies, this._towers ] =
        this._collider.update(elapsed, this._projectiles, this._enemies, this._towers);
        this.spawnEnemy(elapsed);
    }
    // step is alias for update
    step (elapsed) { this.update(elapsed); }

    spawnEnemy (elapsed) {
        this._elapsed += elapsed;
        if (this._elapsed < 5000) return;
        this._enemies.push(new TinyEnemy(
            Math.random() * 500 - 250,// posx
            Math.random() * 500 - 250,// posy
            this._towers[Math.floor(Math.random() * this._towers.length)]// target
        ));
        this._elapsed -= 5000;
    }
}
