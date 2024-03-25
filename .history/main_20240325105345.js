const $$ = selector => document.querySelector(selector);

function Player (health, stamina, strength) {
    this.health = health;
    this.stamina = stamina;
    this.strength = strength;
    this.attackPlayer = function() {
        return this.strength;
    },
    this.specialAttackPlayer = function() {
        return this.strength;
    },
    this.receiveDamage = function(damage) {
        this.health -= damage;
    }
}


function Enemy (health, stamina, strength) {
    this.health = health;
    this.stamina = stamina;
    this.strength = strength;
    this.attackEnemy = function() {
        return this.strength;
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