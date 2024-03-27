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
            this.health += 30;
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
            this.health += 30;
        }
    }
}

let player = new Player(100, 100, 20);
let enemy = new Enemy(100, 100, 18);

function Game() {
    
}

function updateBars() {
    selector("#health-player").style.width = `${player.health}%`;
    selector("#stamina-player").style.width = `${player.stamina}%`;
    selector("#health-enemy").style.width = `${enemy.health}%`;
    selector("#stamina-enemy").style.width = `${enemy.stamina}%`;
    selector('#health-player').textContent = player.health;
    selector('#stamina-player').textContent = player.stamina;
    selector('#health-enemy').textContent = enemy.health;
    selector('#stamina-enemy').textContent = enemy.stamina;
}
updateBars();

function actionsEnemy() {
    if (enemy.stamina >= 10) {
        if (enemy.health > 70) {
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
        } else if (enemy.health <= 70){
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
    updateBars();
}

let buttons = selectAll(".btn");

selector('#basic-attack').addEventListener('click', function() {
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    setTimeout(actionsEnemy, 500);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
        });
    }, 1000)
    stateHealth();
    updateBars();
});
selector('#special-attack').addEventListener('click', function() {
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    setTimeout(actionsEnemy, 500);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
        })
    }, 1000)
    stateHealth();
    updateBars();
});
selector('#heal-action').addEventListener('click', function() {
    if (player.health >= 100 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo")
    } else {
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "")
        })
        setTimeout(actionsEnemy, 500);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "")
            })
        }, 1000)
        stateHealth();
        updateBars();
    }
});


function stateHealth() {
    if(enemy.health <= 0) {
        alert('YOU WIN');
    }
    if (player.health <= 0) {
        alert('GAME OVER');
    }
}
