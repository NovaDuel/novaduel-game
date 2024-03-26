const selector = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);

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
selector('#health-player').textContent = player.health;
selector('#stamina-player').textContent = player.stamina;
selector('#health-enemy').textContent = enemy.health;
selector('#stamina-enemy').textContent = enemy.stamina;

function actionsEnemy() {
    if (enemy.stamina >= 10) {
        if (enemy.health === 100) {
            let randomAction = Math.floor(Math.random() * 2);
            switch(randomAction) {
                case 0:
                    let enemyStrength = enemy.attackEnemy();
                    player.receiveDamage(enemyStrength);
                    break;
                case 1:
                    let specialEnemyStrength = enemy.specialAttackEnemy();
                    player.receiveDamage(specialEnemyStrength);
                    break;
            }
        } else {
            let randomAction = Math.floor(Math.random() * 3);
            switch(randomAction) {
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
            
        } else {
            let enemyStrength = enemy.attackEnemy();
            player.receiveDamage(enemyStrength);
            // selector('#health-player').textContent = player.health;
        }
    selector("#health-player").style.width = `${player.health}%`;
    selector("#health-enemy").style.width = `${enemy.health}%`;
    selector("#stamina-enemy").style.width = `${enemy.stamina}%`;
    selector('#health-player').textContent = player.health;
    selector('#stamina-player').textContent = player.stamina;
    selector('#health-enemy').textContent = enemy.health;
    selector('#stamina-enemy').textContent = enemy.stamina;
}

let buttons = selectAll(".btn");

selector('#basic-attack').addEventListener('click', function() {
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    selector("#health-enemy").style.width = `${enemy.health}%`;
    selector('#health-enemy').textContent = enemy.health;
    setTimeout(actionsEnemy, 500);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
        });
    }, 1000)
    selector('#health-player').textContent = player.health;
    stateHealth();
});
selector('#special-attack').addEventListener('click', function() {
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    selector("#health-enemy").style.width = `${enemy.health}%`;
    selector('#health-enemy').textContent = enemy.health;
    selector("#stamina-player").style.width = `${player.stamina}%`;
    selector('#stamina-player').textContent = player.stamina;
    setTimeout(actionsEnemy, 500);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
        })
    }, 1000)
    stateHealth();
});
selector('#heal-action').addEventListener('click', function() {
    if (player.health >= 100 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo")
    } else {
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "")
        })
        selector("#stamina-player").style.width = `${player.stamina}%`;
        selector('#stamina-player').textContent = player.stamina;
        selector('#health-player').textContent = player.health;
        setTimeout(actionsEnemy, 500);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "")
            })
        }, 1000)
        stateHealth();
    }
});


function stateHealth() {
    if(enemy.health === 0 || enemy.health < 0) {
        console.log('YOU WIN');
    }
    if (player.health === 0 || player.health < 0) {
        console.log('GAME OVER');
    }
}
