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
function PythagoreanObj(obj1, obj2) {
    return Pythagorean(obj1.x, obj1.y, obj2.x, obj2.y);
}
function Pythagorean(p1x, p1y, p2x, p2y) {
    console.log("p1x: ", p1x, "p1y", p1y, "p2x ", p2x, "p2y", p2y);
    return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
}
function Pythagorean(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
function Slope(p1x, p1y, p2x, p2y) {
    return (p1y - p2y) / (p1x - p2x);
}
function calcAngle(target, projectile){
  var opposite = (target.y - projectile.y),
      adjacent = (target.x - projectile.x);
  // Angle is in radians
  var angle = Math.atan(opposite/adjacent) * (180/Math.PI);
  angle += adjacent < 0 ? 180 : 0;
  return angle;
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
/*
 * Entity will just contain components; should have a unique id
 */
class Entity {
    constructor(name = "") {
        this._name = name;
    };
}

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
    get position() {
        return {x: this._x, y: this._y};
    };
    close(otherpos) { console.log("ubsude otherpose");return PythagoreanObj(this.position, otherpos.position) < 1 };
    close(x, y) { return Pythagorean(this._x, this._y, x, y) < 1 };
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

class Money {
    constructor(amount = 1, refund = 0.75) {
        this._money = amount;
        this._refundRatio = refund;
        this._created = Date.now();
    }
    get money() { return this._money; };
    set money(m = 0) { this._money = m >= 0 ? m : 0; };
    deposit(amount) { 
        if (typeof amount != "number") return;
        this._money += amount; };
    withdraw(amount) { 
        if (typeof amount != "number") return;
        if (amount > this._money) return false;
        this._money -= amount; 
        return this._money; };
    get refund () { 
        return this._money * (Date.now() - this._created > 1000 * 60 ? 
        this._refundRatio : 1); };
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
        this._angle = 0;
    }
    get angle() { return this._angle; };
    set angle(angle = 0) { this._angle = angle; };
    get target() { return this._target; };
    set target(target = null) { this._target = target; };
    move(posx, posy, speed, elapsed) {
        var r2degInverse = Math.PI / 180;
        var distance = Math.sqrt(Math.pow(posx - this._target.position.x, 2) + 
                                 Math.pow(posy - this._target.position.y, 2));
        this._angle = r2degInverse * calcAngle({x:this._target.position.x, y:this._target.position.y},
                                                            {x:posx, y:posy});
        var movex = Math.cos(this._angle) * speed * elapsed / 1000;
        var movey = Math.sin(this._angle) * speed * elapsed / 1000;
        var movedistance = Pythagorean(movex, movey);
        if (movedistance > distance) {
            movex /= movedistance / distance;
            movey /= movedistance / distance;
        }
        return [ posx + movex, posy + movey, (distance < 1 ? true : false)];
    };
}

class Tower {
    constructor(posx = 0, posy = 0, range = 100, cooldown = 750, projectile = null, cost = 10, health = 100) {
        this._position = new Position(posx, posy);
        this._range = range;
        this._cooldown = cooldown;
        this._lastFired = Date.now();
        this._ready = true;
        this._projectile = projectile; // function that returns a new projectile
        this._health = new Health();
        this._target = null;
        this._cost = new Money(cost);
    }
    get cost() { return this._cost; };
    set cost(cost = 100) { this._cost = cost; };
    get health() { return this._health; };
    set health(health = 100) { this._health = health; };
    get position() { return this._position; };
    set position(position = true) { this._position = position; };
    get ready() { return this._ready; };
    set ready(ready = true) { this._ready = ready; };
    get range() { return this._range; };
    set range(range = 100) { this._range = range; };
    get lastFired() { return this._lastFired; };
    set lastFired(lastFired = 0) { this._lastFired = lastFired; };
    get cooldown() { return this._cooldown; };
    set cooldown(cooldown = 0) { this._cooldown = cooldown; };
    get target() { return this._target; };
    set target(target = 0) { this._target = target; };
    update (elapsed) { 
        this._lastFired += elapsed; 
        this._ready = this._lastFired > this._cooldown ? true : false;
    }
    fire (target) { 
        if (this._ready) {
            this._target = target;
            this._lastFired = 0;
            this._ready = false;
            return this._projectile(this.position.x, this.position.y, target);
        }
        return false;
    }
}

class Health {
    constructor(health = 100){
        this._max = health;
        this._health = health;
    }
    get howdead() { return this._health / this._max; };
    get max() { return this._max; };
    set max(max = 100) { this._max = max; };
    get health() { return this._health; };
    set health(health = 100) { this._health = health; };
    takeDamage(damage = 0) { this._health -= damage; }
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
                target = null, speed = 5, damage = 5, health = 100, money = 1, name = "") {
        super(name);
        this._position = new Position(posx, posy);
        this._vel = new Velocity(velx, vely);
        this._AI = new HomingAI(target);
        this._speed = speed;
        this._done = false;
        this._damage = new Damage(damage);
        this._health = new Health(health);
        this._money = new Money(money);
        /*this._target = target;*/
    }
    get money() { return this._money; };
    set money(money) { this._money = money; };
    get target() { return this._AI.target;/*_target;*/ };
    set target(target) { this._AI.target = target; };
    get health() { return this._health; };
    set health(health) { this._health = health; };
    get done() { return this._done; };
    set done(done) { this._done = done; };
    get speed() { return this._speed; };
    set speed(speed) { this._speed = speed; };
    get damage() { return this._damage; };
    set damage(damage) { this._damage = damage; };
    get position() { return this._position; };
    get vel() { return this._vel; };
    get AI() { return this._AI; };
    move(elapsed) {
        [this._position.x, this._position.y, this._done] = 
            this._AI.move(this._position.x, this._position.y,
                           this._speed, elapsed); 
    }
}
class TinyBullet extends HomingBullet {
    // posx = 0, posy = 0, velx = 0, vely = 0, target = null, speed = 5, damage = 5, health = 100) {
    constructor(posx = 0, posy = 0, target) {                        
        super(posx, posy, 0, 0, target, 60, 5, 100);
    }

}

class TinyEnemy extends HomingBullet {
    // posx = 0, posy = 0, velx = 0, vely = 0, target = null, speed = 5, damage = 5, health = 100, money = 1) {
    constructor(posx = 0, posy = 0, target) {                        
        super(posx, posy, 0, 0, target, 5 * 4, 5, 100, 2);
    }
}

class TinyTower extends Tower {
    constructor(posx = 0, posy = 0, range = 141, cooldown = 3000,
    projectile = function(px = 0, py = 0, target){
        return new TinyBullet(px, py, target);
    }, cost = 10, health = 100) 
    {
        super(posx, posy, range, cooldown, projectile, cost);
        this._AI = new TowerAI(); // Is this needed?
    }
    get AI() { return this._AI; }; // Is this needed?
}

class Player {
    constructor(health = 100, money = 100){
        this._health = new Health(health);
        this._money = new Money(money);
        this._kills = 0;
    }
    get kills() { return this._kills; };
    set kills(kills) { this._kills = kills; };
    get money() { return this._money; };
    set money(money) { this._money = money; };
    get health() { return this._health; };
    set health(health) { this._health = health; };
}
