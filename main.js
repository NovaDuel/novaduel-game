const $$ = selector => document.querySelector(selector);

function Player (health, stamina, strength) {
    this.health = health;
    this.stamina = stamina;
    this.strength = strength;
    this.attackPlayer = function() {
        return this.strength;
    },
    this.specialAttackPlayer = function() {
        if (this.stamina >= 10) {
            this.stamina -= 10;
            return this.strength + 10 * Math.round(Math.random() * 3);
        }
    },
    this.receiveDamage = function(damage) {
        this.health -= damage;
    }
    this.healing = function() {
        if (this.stamina >= 20) {
            this.stamina -= 20;
            this.health += 50;
        }
    }
}


function Enemy (health, stamina, strength) {
    this.health = health;
    this.stamina = stamina;
    this.strength = strength;
    this.attackEnemy = function() {
        return this.strength;
    },
    this.specialAttackEnemy = function() {
        if (this.stamina >= 10) {
            this.stamina -= 10;
            return this.strength + 10 * Math.round(Math.random() * 3);
        }
    },
    this.receiveDamage = function (damage) {
        this.health -= damage;
    },
    this.healing = function() {
        if (this.stamina >= 20) {
            this.stamina -= 20;
            this.health += 50;
        }
    }
}

function Game() {
    
}

let player = new Player(100, 100, 20);
let enemy = new Enemy(100, 100, 18);

let actionsArray = ['attack', 'special', 'heal'],
    randomAction = Math.floor(Math.random() * 3);
    

function actionsEnemy(action) {
    switch(action) {
        case 0:
            let enemyStrength = enemy.attackEnemy();
            player.receiveDamage(enemyStrength);
            break;
        case 1:
            let specialEnemyStrength = enemy.specialAttackEnemy();
            player.receiveDamage(specialEnemyStrength);
            break;
        case 2:
            enemy.healing();
            break;
    }
}


$$('#basic-attack').addEventListener('click', function() {
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    setTimeout(actionsEnemy, 1000, randomAction);
    setTimeout(console.log, 2000, player.health);
    console.log(player.health);
    console.log(`enemy's stamina`, enemy.stamina);
    console.log(`enemy's health`, enemy.health);
})
$$('#special-attack').addEventListener('click', function() {
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    //actionsEnemy(randomAction);
    setTimeout(actionsEnemy(randomAction), 8000);
})
$$('#heal-action').addEventListener('click', function() {
    player.healing();
    //actionsEnemy(randomAction);
    setTimeout(actionsEnemy(randomAction), 8000);
})


