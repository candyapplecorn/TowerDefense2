/*
 *  Turns out you can access members directly with _member, but if you access
 *  them without the _, you will call the get or set things
 */
/*
-- Position (x, y)
-- Velocity (x, y)
Physics (body)
Sprite (images, animations)
Health (value)
Character (name, level)
Player (empty)
 */
"use strict"
// Call Pythagorean
function Pythagorean(p1x, p1y, p2x, p2y) {
    return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
}
function Pythagorean(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
function Slope(p1x, p1y, p2x, p2y) {
    return (p1y - p2y) / (p1x - p2x);
}
/*
 * Entity will just contain components; should have a unique id
 */
class Entity {}

/*
 * Position in x and y space
 */
class Position {
    constructor(x = 0, y = 0) {
        this._x = x, this._y = y;
    };
    get x() { return this._x; };
    get y() { return this._y; };
    set y(y = 0) { this._y = y; };
    set x(x = 0) { this._x = x; };
    get pos() {
        return {x: this._x, y: this._y};
    };
}

/*
 * Class Velocity - 
 * x: speed in x direction, y: speed in y direction
 */
class Velocity {
    constructor(x = 0, y = 0) {
        this._x = x, this._y = y;
    };
    get x() { return this._x; };
    get y() { return this._y; };
    set y(y = 0) { this._y = y; };
    set x(x = 0) { this._x = x; };
}

class Damage {
    constructor(damage = 10) {
        this._damage = damage;
    }
    get damage() { return this._damage; };
    set damage(damage = 0) { this._damage = damage; };
}

/*
 *  AI - How does an entity behave?
 */
class AI {}
class TowerAI extends AI {}
class HomingAI extends AI {
    constructor(target = null) {
        super();
        this._target = target;
    }
    get target() { return this._target; };
    set target(target = null) { this._target = target; };
    move(posx, posy, speed, elapsed) {
        var distance = Pythagorean(posx, posy, this._target.x, this._target.y);
        var slope = Slope(posx, posy, this._target.x, this._target.y);
        var angle = Math.atan(slope);
        posx += Math.sin(angle) * speed * elapsed / 1000;
        posx += Math.cos(angle) * speed * elapsed / 1000;
        return { posx: posx, posy: posy, done: (distance < 1 ? true : false) };
    };
}

class Tower extends Position {
    constructor(posx = 0, posy = 0, range = 100, cooldown = 750, projectile = null) {
        super(posx, posy);
        this._range = range;
        this._cooldown = cooldown;
        this._lastFired = Date.now();
        this._ready = true;
        this._projectile = projectile; // function that returns a new projectile
    }
    get ready() { return this._ready; };
    set ready(ready = true) { this._ready = ready; };
    get range() { return this._range; };
    set range(range = 100) { this._range = range; };
    get lastFired() { return this._lastFired; };
    set lastFired(lastFired = 0) { this._lastFired = lastFired; };
    get cooldown() { return this._cooldown; };
    set cooldown(cooldown = 0) { this._cooldown = cooldown; };
    update (elapsed) { 
        this._lastFired += elapsed; 
        this._ready = this._lastFired > this._cooldown ? true : false;
    }
    fire (target) { 
        if (this._ready) {
            this._lastFired = 0;
            return this._projectile(this._x, this._y, target);
        }
        return false;
    }
}

class Health {
    constructor(health = 100){
        this._health = health;
    }
    get health() { return this._health; };
    set health(health = 100) { this._health = health; };
    alive() { return this._health > 0; }
}

// ============================================================================
//      CONCRETE CLASS DECLARATIONS
// ============================================================================

/*
 *  Homing Bullet will take a target and move towards it.
 *  if (done) { do damage, then prune from list }
 *
 *  move()      - moves bullet relative to target by elapsed time and speed
 *  done : bool - is the bullet against its target? 
 */
class HomingBullet extends Entity {
    constructor(posx = 0, posy = 0, velx = 0, vely = 0, 
                target = null, speed = 5, damage = 5, health = 100) {
        super();
        this._pos = new Position(posx, posy);
        this._vel = new Velocity(velx, vely);
        this._AI = new HomingAI(target);
        this._speed = speed;
        this._done = false;
        this._damage = new Damage(damage);
        this._health = new Health(health);
    }
    get health() { return this._health; };
    set health(health) { this._health = health; };
    get done() { return this._done; };
    set done(done) { this._done = done; };
    get speed() { return this._speed; };
    set speed(speed) { this._speed = speed; };
    get damage() { return this._damage; };
    set damage(damage) { this._damage = damage; };
    get pos() { return this._pos; };
    get vel() { return this._vel; };
    get AI() { return this._AI; };
    move(elapsed) {
        [this._pos._x, this._pos._y, this._done] = Object.values(
            this._AI.move(this._pos._x, this._pos._y,
                           this._speed, elapsed)); 
    }
}
class TinyBullet extends HomingBullet {
    // posx = 0, posy = 0, velx = 0, vely = 0, //target = null, speed = 5, damage = 5, health = 100) {
    constructor(posx = 0, posy = 0, target) {                        
        super(posx, posy, 0, 0, target, 5, 5, 100);
    }

}

class TinyTower extends Tower {
    constructor(posx = 0, posy = 0, range = 100, cooldown = 750,
    projectile = function(px = 0, py = 0, target){
        return new TinyBullet(px, py, target);
    }) 
    {
        super(posx, posy, range, cooldown, projectile);
        this._AI = new TowerAI(); // Is this needed?
    }
    get AI() { return this._AI; }; // Is this needed?
}

class Player extends Health {
    constructor(health = 100){
        super();
        this._health = health;
    }
}
