import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js";

const selector = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);
let basicAttackBtn = selector('#basic-attack')
let specialAttackBtn = selector('#special-attack');
let healBtn = selector('#heal-action');

let player = new Player(100, 100, 20);
let enemy = new Enemy(100, 100, 18);

function createPrincipalLayer() {
    selector("#main-container").style.display = 'none';
    let createButton = document.createElement('button');
    createButton.classList.add('start-button');
    createButton.textContent = 'START';
    document.body.appendChild(createButton);

    selector('.start-button').addEventListener('click', () => {
        selector("#main-container").style.display = 'block';
        selector(".start-button").style.display = 'none';
    });
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
createPrincipalLayer();
updateBars();
stateHealth();

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
    stateHealth();
    endGame();
}

let buttons = selectAll(".btn");

basicAttackBtn.addEventListener('click', function() {
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    });
    setTimeout(actionsEnemy, 800);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "");
            stateHealth();
            stateStamina()
        });
    }, 1000);
    updateBars();
    endGame();
});
specialAttackBtn.addEventListener('click', function() {
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    setTimeout(actionsEnemy, 800);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
            stateHealth();
            stateStamina()
        })
    }, 1000)
    updateBars();
    endGame();
});
healBtn.addEventListener('click', function() {
    if (player.health > 70 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo");
    } else {
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "");
        })
        setTimeout(actionsEnemy, 800);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "")
                stateHealth();
                stateStamina()
            });
        }, 1000)
        updateBars();
        endGame();
    }
});


function stateHealth() {
    if (player.health > 70){
        healBtn.setAttribute("disabled", "");
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You are already healed");
        });
    }
    
    if (player.health <= 70) {
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You can heal");
        });
    }
};

function stateStamina() {
    if (player.stamina < 20) {
        healBtn.setAttribute("disabled", "");
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You don't have enough stamina");
        });
    } 
    if (player.stamina < 10) {
        specialAttackBtn.setAttribute("disabled", "");
        specialAttackBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You don't have enough stamina");
        });
    }
}

function endGame() {
    if (player.health <= 0) {
        selector("#main-container").style.display = 'none';
        let gameOver = document.createElement("div");
        gameOver.setAttribute("id", "game-over");
        gameOver.classList.add("end-screen");
        let gameOverText = document.createElement("h1");
        gameOverText.textContent = "GAME OVER";
        let retryBtn = document.createElement("button");
        retryBtn.setAttribute("id", "retry-btn");
        retryBtn.textContent = "TRY AGAIN";
        gameOver.appendChild(gameOverText);
        gameOver.appendChild(retryBtn);
        document.body.appendChild(gameOver);
    } else if (enemy.health <= 0) {
        selector("#main-container").style.display = 'none';
        let victory = document.createElement("div");
        victory.setAttribute("id", "game-over");
        victory.classList.add("end-screen");
        let victoryText = document.createElement("h1");
        victoryText.textContent = "YOU WIN";
        let retryBtn = document.createElement("button");
        retryBtn.setAttribute("id", "retry-btn");
        retryBtn.textContent = "TRY AGAIN";
        victory.appendChild(victoryText);
        victory.appendChild(retryBtn);
        document.body.appendChild(victory);
    }
}