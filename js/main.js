import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js";

const selector = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);
const menuMusic = new Audio("../music/menu-music.mp3");
const battleMusic = new Audio("../music/battle-music.mp3");
const clickSound = new Audio("../music/click.mp3")
const startSound = new Audio("../music/start.mp3")
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
    new Audio("../music/game-over.mp3"),
]
const loseSound = new Audio("../music/lost.mp3");
const actionSounds = [
    new Audio("../music/basic-attack.mp3"),
    new Audio("../music/special-attack.mp3"),
    new Audio("../music/heal.mp3")
]
endSounds[0].volume = 0.5;
endSounds[1].volume = 0.5;
loseSound.volume = 0.2;
clickSound.volume = 0.5;
actionSounds[0].volume = 0.5;
actionSounds[1].volume = 0.5;
actionSounds[2].volume = 0.5;
battleMusic.volume = 0.2;
startSound.volume = 0.3;
let basicAttackBtn = selector('#basic-attack');
let specialAttackBtn = selector('#special-attack');
let healBtn = selector('#heal-action');
let menuMusicIsPlaying = false;
let volumeMusicOn = true;
let volumeFxOn = true;
let playerImage = selector('#player');
let enemyImage = selector('#enemy');
let playerLowInterval;
let enemyLowInterval;

let player = new Player(100, 100, 18);
let enemy = new Enemy(100, 100, 16);

intro();
updateBars();
stateHealth();
stateStamina();

function intro() {
    selector("#main-container").style.display = 'none';
    let introAlert = document.createElement('div');
    let acceptButton = document.createElement('button');
    acceptButton.setAttribute('id', 'accept');
    acceptButton.classList.add('options');
    acceptButton.textContent = 'ACCEPT';
    introAlert.appendChild(acceptButton);
    document.body.appendChild(introAlert);
    acceptButton.addEventListener('click', () => {
        introAlert.remove();
        createPrincipalLayer()
        playMusic();
    });
}

function createPrincipalLayer() {
    let startButton = document.createElement('button');
    let musicButton = document.createElement('button');
    let effectsButton = document.createElement('button');
    let layer = document.createElement('div'),
    buttonMenu = document.createElement('button'),
    title = document.createElement('h1'),
    layerGradient = document.createElement('div');
    title.innerHTML = `<span>N</span>OVA<span>D</span>UEL`;
    
    buttonMenu.textContent = 'MENU';
    layer.classList.add('main-game');
    layer.setAttribute('id', 'main');
    title.classList.add('main-game__h1');
    layerGradient.classList.add('layer-gradient');
    buttonMenu.classList.add('menu');
    startButton.classList.add('start-button');
    startButton.textContent = 'START';
    musicButton.setAttribute('id', 'music');
    musicButton.textContent = 'MUSIC';
    effectsButton.setAttribute('id', 'effects');
    effectsButton.textContent = 'FX';
    layer.appendChild(buttonMenu);
    layer.appendChild(layerGradient);
    layer.appendChild(title);
    layer.appendChild(startButton);
    document.body.appendChild(layer);
    document.body.appendChild(musicButton);
    document.body.appendChild(effectsButton);
    startButton.addEventListener('click', () => {
        selector("#main-container").style.display = 'block';
        layer.style.display = 'none';
        startSound.play();
        playMusic();
    });
    buttonMenu.addEventListener('click', () => {
        clickSound.play();
    })
    musicButton.addEventListener('click', () => {
        clickSound.play();
        toggleMusic();
    })
    effectsButton.addEventListener('click', () => {
        clickSound.play();
        toggleFx();
    })
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

function actionsEnemy() {
    if (enemy.health <= 25 && enemy.stamina >= 20) {
        enemyHeals();
        enemy.healing();
    } else if (enemy.stamina >= 30) {
        if (enemy.health > 60) {
            let randomAction = Math.floor(Math.random() * 2);
            switch(randomAction) {
                case 0:
                    actionSounds[0].play();
                    playerHit();
                    let enemyStrength = enemy.attackEnemy();
                    player.receiveDamage(enemyStrength);
                    break;
                case 1:
                    actionSounds[1].play();
                    playerHit();
                    let specialEnemyStrength = enemy.specialAttackEnemy();
                    player.receiveDamage(specialEnemyStrength);
                    break;
            }
        } else if (enemy.health <= 60){
            let randomAction = Math.floor(Math.random() * 3);
            switch(randomAction) {
                case 0:
                    actionSounds[0].play();
                    playerHit();
                    let enemyStrength = enemy.attackEnemy();
                    player.receiveDamage(enemyStrength);
                    break;
                case 1:
                    actionSounds[1].play();
                    playerHit();
                    let specialEnemyStrength = enemy.specialAttackEnemy();
                    player.receiveDamage(specialEnemyStrength);
                    break;
                case 2:
                    enemyHeals();
                    enemy.healing();
                    break;
                }
            }
    } else {
        actionSounds[0].play();
        playerHit();
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
    actionSounds[0].play();
    setTimeout(enemyHit, 100);
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    });
    enemyTimeOut = setTimeout(actionsEnemy, 1000);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "");
            stateHealth();
            stateStamina()
        });
    }, 2500);
    updateBars();
    playerWins();
});
specialAttackBtn.addEventListener('click', function() {
    actionSounds[1].play();
    setTimeout(enemyHit, 200);
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
    })
    enemyTimeOut = setTimeout(actionsEnemy, 1500);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "")
            stateHealth();
            stateStamina()
        })
    }, 2500)
    updateBars();
    playerWins();
});
healBtn.addEventListener('click', function() {
    if (player.health > 70 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo");
    } else {
        playerHeals();
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "");
        })
        enemyTimeOut = setTimeout(actionsEnemy, 1700);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "")
                stateHealth();
                stateStamina()
            });
        }, 2500)
        updateBars();
    }
});


function stateHealth() {
    clearInterval(enemyLowInterval);
    clearInterval(playerLowInterval);
    if (player.health > 65){
        healBtn.setAttribute("disabled", "");
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You are already healed");
        });
    }
    
    if (player.health <= 65) {
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You can heal");
        });
    }

    if (player.health <= 35) {
        playerLowHealth();
    } else if (player.health > 35) {
        clearInterval(playerLowInterval);
        playerImage.style.backgroundImage = "url('../assets/images/player.webp')";
    }

    if (enemy.health <= 35) {
        enemyLowHealth();
    } else if (enemy.health > 35) {
        clearInterval(enemyLowInterval);
        enemyImage.style.backgroundImage = "url('../assets/images/enemy.webp')";
    }
};

function stateStamina() {
    if (player.stamina < 20) {
        healBtn.setAttribute("disabled", "");
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You don't have enough stamina");
        });
    } 
    if (player.stamina < 40) {
        specialAttackBtn.setAttribute("disabled", "");
        specialAttackBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You don't have enough stamina");
        });
    }
}

function enemyWins() {
    if (player.health <= 0) {
        loseSound.play();
        setTimeout(endSound, 500);
        playMusic();
        selector("#main-container").style.display = 'none';
        let gameOver = document.createElement("div"),
            gameOverText = document.createElement("h1"),
            charEnemyWins = document.createElement('img'),
            retryBtn = document.createElement("button");
        gameOver.setAttribute("id", "game-over");
        retryBtn.setAttribute("id", "retry-btn");
        charEnemyWins.setAttribute("src", "../assets/images/enemy.webp");
        charEnemyWins.setAttribute("alt", "enemy-char");
        gameOver.classList.add("end-screen");
        charEnemyWins.classList.add('img-enemy-wins');
        gameOverText.textContent = "GAME OVER";
        retryBtn.textContent = "TRY AGAIN";
        gameOver.appendChild(gameOverText);
        gameOver.appendChild(charEnemyWins);
        gameOver.appendChild(retryBtn);
        document.body.appendChild(gameOver);
        tryAgain(selector("#retry-btn"), selector('.end-screen'));
    } 
}   

function playerWins() { 
    if (enemy.health <= 0) {
        enemyHit();
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
        clearInterval(enemyLowInterval);
        clearInterval(playerLowInterval);
        startSound.play();
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

function toggleMusic() {
    if (volumeMusicOn === false) {
        menuMusic.volume = 1;
        battleMusic.volume = 0.2;
        volumeMusicOn = true;
    } else if (volumeMusicOn === true) {
        menuMusic.volume = 0;
        battleMusic.volume = 0;
        volumeMusicOn = false;
    }
}

function toggleFx() {
    if (volumeFxOn === false) {
        enemyScreams.forEach(scream => {
            scream.volume = 1;
        })
        endSounds.forEach(sound => {
            sound.volume = 0.5;
        })
        actionSounds.forEach(sound => {
            sound.volume = 0.5;
        })
        volumeFxOn = true;
    } else if (volumeFxOn === true) {
        enemyScreams.forEach(scream => {
            scream.volume = 0;
        })
        endSounds.forEach(sound => {
            sound.volume = 0;
        })
        actionSounds.forEach(sound => {
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

function enemyHit() {
    let randomScream = enemyScreams[Math.floor(Math.random() * 5)];
    enemyImage.style.backgroundImage = "url('../assets/images/enemy-hit.webp')";
    setTimeout(function() {
        enemyImage.style.backgroundImage = "url('../assets/images/enemy.webp')"
    }, 150);
    enemy.health > 0 ? randomScream.play() : enemyScreams[5].play();
}

function enemyHeals() {
    actionSounds[2].play();
    enemyImage.style.backgroundImage = "url('../assets/images/enemy-heal.webp')";
    setTimeout(function() {
        enemyImage.style.backgroundImage = "url('../assets/images/enemy.webp')"
    }, 1000);
}

function endSound() {
    enemy.health <= 0 ? endSounds[0].play() : endSounds[1].play();
}

function playerHit() {
    playerImage.style.backgroundImage = "url('../assets/images/player-hit.webp')";
    setTimeout(function() {
        playerImage.style.backgroundImage = "url('../assets/images/player.webp')"
    }, 150);
}

function playerHeals() {
    actionSounds[2].play();
    playerImage.style.backgroundImage = "url('../assets/images/player-heal.webp')";
    setTimeout(function() {
        playerImage.style.backgroundImage = "url('../assets/images/player.webp')"
    }, 1000);
}

function enemyLowHealth() {
    enemyLowInterval = setInterval(function() {
        enemyImage.style.backgroundImage = "url('../assets/images/enemy-low.webp')";
        setTimeout(function() {
            enemyImage.style.backgroundImage = "url('../assets/images/enemy.webp')"
        }, 250);
    }, 500)
}

function playerLowHealth() {
    playerLowInterval = setInterval(function() {
        playerImage.style.backgroundImage = "url('../assets/images/player-low.webp')";
        setTimeout(function() {
            playerImage.style.backgroundImage = "url('../assets/images/player.webp')"
        }, 250);
    }, 500)
}