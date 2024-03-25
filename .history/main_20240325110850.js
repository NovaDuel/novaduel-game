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
    this.specialAttackPlayer = function() {
        if (this.stamina >= 10) {
            this.stamina -= 10;
            return this.strength + 10 * Math.round(Math.random() * 3);
        }
    },
    this.receiveDamage = function (damage) {
        this.health -= damage;
    }
}

function Game() {
    
}

let player = new Player(100, 100, 20);
let enemy = new Enemy(100, 100, 18);

$$('#basic-attack').addEventListener('click', function() {
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
})
$$('#special-attack').addEventListener('click', function() {
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
})
$$('#heal-action').addEventListener('click', function() {
    player.healing();
    console.log(player.health)
})
