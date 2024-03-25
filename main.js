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
let enemy = new Enemy(100, 50, 18);

//let actionsArray = ['attack', 'special', 'heal'];
console.log(enemy.stamina);
function actionsEnemy() {
    if (enemy.stamina >= 10) {
        if (enemy.health === 100) {
            let randomAction = Math.floor(Math.random() * 2);
            switch(randomAction) {
                case 0:
                    let enemyStrength = enemy.attackEnemy();
                    player.receiveDamage(enemyStrength);
                    $$("#health-player").style.width = `${player.health}%`; 
                    break;
                case 1:
                    let specialEnemyStrength = enemy.specialAttackEnemy();
                    player.receiveDamage(specialEnemyStrength);
                    $$("#health-player").style.width = `${player.health}%`; 
                    $$("#stamina-enemy").style.width = `${enemy.stamina}%`;
                    break;
            }
        console.log(enemy.stamina);
        } else {
            let randomAction = Math.floor(Math.random() * 3);
            switch(randomAction) {
                case 0:
                    let enemyStrength = enemy.attackEnemy();
                    player.receiveDamage(enemyStrength);
                    $$("#health-player").style.width = `${player.health}%`; 
                    break;
                case 1:
                    let specialEnemyStrength = enemy.specialAttackEnemy();
                    player.receiveDamage(specialEnemyStrength);
                    $$("#health-player").style.width = `${player.health}%`; 
                    $$("#stamina-enemy").style.width = `${enemy.stamina}%`;
                    break;
                case 2:
                    enemy.healing();
                    $$("#stamina-enemy").style.width = `${enemy.stamina}%`;
                    break;
            }
            console.log(enemy.stamina);
        }

    } else {
        console.log('ya no tengo stamina');
        let enemyStrength = enemy.attackEnemy();
        player.receiveDamage(enemyStrength);
        $$("#health-player").style.width = `${player.health}%`;
        console.log(enemy.stamina);    
    }
}


$$('#basic-attack').addEventListener('click', function() {
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    $$("#health-enemy").style.width = `${enemy.health}%`; 
    setTimeout(actionsEnemy, 500);
    stateHealth();
});
$$('#special-attack').addEventListener('click', function() {
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    $$("#health-enemy").style.width = `${enemy.health}%`;
    $$("#stamina-player").style.width = `${player.stamina}%`;
    setTimeout(actionsEnemy, 500);
});
$$('#heal-action').addEventListener('click', function() {
    player.healing();
    $$("#stamina-player").style.width = `${player.stamina}%`;
    setTimeout(actionsEnemy, 500);
});


function stateHealth() {
    if(enemy.health <= 0) {
        console.log('YOU WIN');
    }
    if (player.health <= 0) {
        console.log('GAME OVER');
    }
}
