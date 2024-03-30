import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js";

const selector = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);
const menuMusic = new Audio("../music/menu-music.mp3");
const battleMusic = new Audio("../music/battle-music.mp3");
const enemyScreams = [
    new Audio("../music/enemy-scream1.mp3"),
    new Audio("../music/enemy-scream2.mp3"),
    new Audio("../music/enemy-scream3.mp3"),
    new Audio("../music/enemy-scream4.mp3"),
    new Audio("../music/enemy-scream5.mp3"),
    new Audio("../music/enemy-die.mp3")
];
const endSounds = [
    new Audio("../music/you-win.mp3"),
    new Audio("../music/game-over.mp3")
]
endSounds[0].volume = 0.5;
endSounds[1].volume = 0.5;
battleMusic.volume = 0.3;
let basicAttackBtn = selector('#basic-attack');
let specialAttackBtn = selector('#special-attack');
let healBtn = selector('#heal-action');
let menuMusicIsPlaying = false;
let volumeMusicOn = false;
let volumeFxOn = false;

let player = new Player(100, 100, 20);
let enemy = new Enemy(100, 100, 18);

function createPrincipalLayer() {
    selector("#main-container").style.display = 'none';
    let startButton = document.createElement('button');
    let musicButton = document.createElement('button');
    let effectsButton = document.createElement('button');
    startButton.classList.add('start-button');
    startButton.textContent = 'START';
    musicButton.setAttribute('id', 'music');
    musicButton.textContent = 'MUSIC';
    effectsButton.setAttribute('id', 'effects');
    effectsButton.textContent = 'FX';
    document.body.appendChild(startButton);
    document.body.appendChild(musicButton);
    document.body.appendChild(effectsButton);
    playMusic();
    selector('.start-button').addEventListener('click', () => {
        selector("#main-container").style.display = 'block';
        selector(".start-button").style.display = 'none';
        playMusic();
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
    enemyWins();
}

let buttons = selectAll(".btn");
let enemyTimeOut;

basicAttackBtn.addEventListener('click', function() {
    enemyScream();
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    });
    enemyTimeOut = setTimeout(actionsEnemy, 800);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "");
            stateHealth();
            stateStamina()
        });
    }, 1000);
    updateBars();
    playerWins();
});
specialAttackBtn.addEventListener('click', function() {
    enemyScream();
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    enemyTimeOut = setTimeout(actionsEnemy, 800);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
            stateHealth();
            stateStamina()
        })
    }, 1000)
    updateBars();
    playerWins();
});
healBtn.addEventListener('click', function() {
    if (player.health > 70 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo");
    } else {
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "");
        })
        enemyTimeOut = setTimeout(actionsEnemy, 800);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "")
                stateHealth();
                stateStamina()
            });
        }, 1000)
        updateBars();
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

function enemyWins() {
    if (player.health <= 0) {
        endSound();
        playMusic();
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
        tryAgain(selector("#retry-btn"), selector('.end-screen'));
    } 
}   

function playerWins() { 
    if (enemy.health <= 0) {
        enemyScream();
        endSound();
        playMusic();
        clearTimeout(enemyTimeOut);
        selector("#main-container").style.display = 'none';
        let victory = document.createElement("div");
        victory.setAttribute("id", "victory");
        victory.classList.add("end-screen");
        let victoryText = document.createElement("h1");
        victoryText.textContent = "YOU WIN";
        let retryBtn = document.createElement("button");
        retryBtn.setAttribute("id", "play-again");
        retryBtn.textContent = "PLAY AGAIN";
        victory.appendChild(victoryText);
        victory.appendChild(retryBtn);
        document.body.appendChild(victory);
        tryAgain(selector("#play-again"), selector('.end-screen'));
    }
}

function tryAgain(buttonRetry, screen) {
    buttonRetry.addEventListener('click', () => {
        playMusic();
        screen.remove();
        player.health = 100;
        enemy.health = 100;
        player.stamina = 100;
        enemy.stamina = 100;
        updateBars();
        selector("#main-container").style.display = 'block';
    });
}

selector("#music").onclick = () => {
    if (volumeMusicOn === false) {
        menuMusic.volume = 1;
        battleMusic.volume = 0.3;
        volumeMusicOn = true;
    } else if (volumeMusicOn === true) {
        menuMusic.volume = 0;
        battleMusic.volume = 0;
        volumeMusicOn = false;
    }
}

selector("#effects").onclick = () => {
    if (volumeFxOn === false) {
        enemyScreams.forEach(scream => {
            scream.volume = 1;
        })
        endSounds.forEach(sound => {
            sound.volume = 1;
        })
        volumeFxOn = true;
    } else if (volumeFxOn === true) {
        enemyScreams.forEach(scream => {
            scream.volume = 0;
        })
        endSounds.forEach(sound => {
            sound.volume = 0;
        })
        volumeFxOn = false;
    }
}

function playMusic() {
    if (menuMusicIsPlaying === false) {
        battleMusic.pause();
        battleMusic.currentTime = 0;
        menuMusic.play();
        menuMusicIsPlaying = true;
    } else if (menuMusicIsPlaying === true) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
        battleMusic.play();
        menuMusicIsPlaying = false;
    }
}

function enemyScream() {
    let randomScream = enemyScreams[Math.floor(Math.random() * 5)];
    enemy.health > 0 ? randomScream.play() : enemyScreams[5].play();
}

function endSound() {
    enemy.health <= 0 ? endSounds[0].play() : endSounds[1].play();
}