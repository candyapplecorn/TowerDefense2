/*
 * The logic for an opponent AI
 */
class opponentNPCAI {
    constructor(game){
        this._game = game;
        this._elapsed = 0;
        this._spawnEnemyRate = 7500;  
        this._em = new EnemyFactory(this._game._map._begin);
        this._stages = [
            ["Begin", 10000, 1],
            ["Sheep", 250, 60],
            ["Wolf", 850, 30],
            ["Unicorn", 1250, 20],
            ["Sealion", 1300, 15],
            ["Bear", 1350, 24],
            ["Armored Bear", 2000, 12],
            ["Small Enemy", 2500, 20], 
            ["Feisty Enemy", 2250, 30], 
            ["Gorgon", 2150, 30], 
            ["Cyclops", 2100, 30], 
            ["Titan", 2050, 30], 
            ["Little Sister", 1000, 10], 
            ["The Dinyyen", 2000, 20],
            ["The Toto-Baggins", 1950, 25],
            ["TinyEnemy", 1700, 10000000] // END
        ];
        this._currentStage = 0;
    };
    update (elapsed) { 
        if (!this.updateTimer(elapsed)) return;
        this.spawnEnemy();
    };
    updateTimer(elapsed) {
        this._elapsed += elapsed;
        this._spawnEnemyRate = this._stages[this._currentStage][1];
        if (this._elapsed < this._spawnEnemyRate) return false;
        this._elapsed -= this._spawnEnemyRate;
        return true;
    };
    spawnEnemy () {
        this._stages[this._currentStage][2]--;
        if (this._stages[this._currentStage][2] == 0) {
            this._currentStage++;
            this._elapsed = -5000; // 10 second waiting period
            return; }
        this._game._enemies.push(
            this._em.generateEnemy(this._stages[this._currentStage][0]));
    };
}
class EnemyFactory {
    constructor(start) {
        this._base = {
            posx: 0, posy: 0, velx:0, vely:0, target:start
        };
        this.Begin = { name: "Begin" };
        this.Sheep = { speed: 10,   damage: 1,    health: 5,    money: 0.5  };
        this.Wolf = { speed: 15,   damage: 1.5,    health: 15,    money: 1  };
        this.Unicorn = { speed: 20,   damage: 2,    health: 20,    money: 1  };
        this.Sealion = { speed: 20,   damage: 2.5,   health: 25,    money: 1  };
        this.Bear = { speed: 20,   damage: 3,   health: 30,    money: 2  };
        this["Armored Bear"] = { speed: 25,   damage: 3,   health: 50,    money: 2  };
        this["Small Enemy"] = { speed: 25,   damage: 5,   health: 60,    money: 2.5  };
        this["Feisty Enemy"] = { speed: 25,   damage: 5,   health: 65,    money: 2.5  };
        this["Gorgon"] = { speed: 27,   damage: 5,   health: 70,    money: 2.5  };
        this["Cyclops"] = { speed: 30,   damage: 5,   health: 75,    money: 2.5  };
        this["Titan"] = { speed: 31,   damage: 5,   health: 80,    money: 2.8  };
        this["Little Sister"] = { speed: 35,   damage: 5.5,  health: 70,    money: 4.0  };
        this["The Dinyyen"] = { speed: 40,   damage: 5,   health: 100,    money: 2.8  };
        this["The Toto-Baggins"] = { speed: 45,   damage: 5,   health: 105,    money: 2.8  };
        this.TinyEnemy = { speed: 45,   damage: 5,   health: 120,    money: 2.8  };
    }
    generateEnemy(name) {
        if (!this[name]) name = "Sheep";
        var enemyStats = { name: name };
        for (var key of Object.keys(this._base)) enemyStats[key] = this._base[key];
        for (var key of Object.keys(this[name])) enemyStats[key] = this[name][key];
        return new HomingBullet(
            enemyStats.posx,
            enemyStats.posy,
            enemyStats.velx,
            enemyStats.vely,
            enemyStats.target,
            enemyStats.speed,
            enemyStats.damage,
            enemyStats.health,
            enemyStats.money,
            enemyStats.name
        );
    };
}
