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
const actionSounds = [
    new Audio("../music/basicattack.mp3"),
    new Audio("../music/specialattack.mp3"),
    new Audio("../music/heal.mp3")
]
endSounds[0].volume = 0.5;
endSounds[1].volume = 0.5;
battleMusic.volume = 0.2;
let basicAttackBtn = selector('#basic-attack');
let specialAttackBtn = selector('#special-attack');
let healBtn = selector('#heal-action');
let menuMusicIsPlaying = false;
let volumeMusicOn = false;
let volumeFxOn = false;

let player = new Player(100, 100, 20);
let enemy = new Enemy(100, 100, 18);

intro();
updateBars();
stateHealth();

function intro() {
    selector("#main-container").style.display = 'none';
    let introAlert = document.createElement('div'),
        introText = document.createElement('p'),
        acceptButton = document.createElement('button');
    acceptButton.setAttribute('id', 'accept');
    introAlert.classList.add('modal-intro');
    introText.classList.add('modal-text');
    acceptButton.textContent = 'ACCEPT';
    introText.textContent = `Welcome to NovaDuel! Use the attack buttons (normal and special attack) to defeat your opponent, you can also heal yourself with the heal button.`;
    introAlert.appendChild(introText);
    introText.appendChild(acceptButton);    document.body.appendChild(introAlert);
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
    musicButton.innerHTML = `<img class="music-button" src="../assets/images/music.png" alt="music.png">`;
    effectsButton.setAttribute('id', 'effects');
    effectsButton.innerHTML = '<img class="speaker-button" src="../assets/images/speaker.png" alt="speaker.png">';
    layer.appendChild(buttonMenu);
    layer.appendChild(layerGradient);
    layer.appendChild(title);
    layer.appendChild(startButton);
    layer.appendChild(musicButton);
    layer.appendChild(effectsButton);
    document.body.appendChild(layer);
    musicButton.addEventListener('click', toggleMusic)
    effectsButton.addEventListener('click', toggleFx)
    startButton.addEventListener('click', () => {
        selector("#main-container").style.display = 'block';
        layer.style.display = 'none';
        playMusic();
    });
    menuButton(buttonMenu, layer);
}

function updateBars() {
    selector("#health-player").style.width = `${player.health}%`;
    selector("#stamina-player").style.width = `${player.stamina}%`;
    selector("#health-enemy").style.width = `${enemy.health}%`;
    selector("#stamina-enemy").style.width = `${enemy.stamina}%`;
    selector('#health-player span').textContent = player.health;
    selector('#stamina-player span').textContent = player.stamina;
    selector('#health-enemy span').textContent = enemy.health;
    selector('#stamina-enemy span').textContent = enemy.stamina;
}

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
    actionSounds[0].play();
    setTimeout(enemyScream(), 400);
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
    }, 1500);
    updateBars();
    playerWins();
});
specialAttackBtn.addEventListener('click', function() {
    actionSounds[1].play();
    setTimeout(enemyScream(), 1000);
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
    }, 2100)
    updateBars();
    playerWins();
});
healBtn.addEventListener('click', function() {
    if (player.health > 70 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo");
    } else {
        actionSounds[2].play();
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "");
        })
        enemyTimeOut = setTimeout(actionsEnemy, 1000);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "")
                stateHealth();
                stateStamina()
            });
        }, 2000)
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
        let gameOver = document.createElement("div"),
            gameOverText = document.createElement("h1"),
            charEnemyWins = document.createElement('img'),
            retryBtn = document.createElement("button"),
            buttonMenu = document.createElement('button');
        gameOver.setAttribute("id", "game-over");
        retryBtn.setAttribute("id", "retry-btn");
        charEnemyWins.setAttribute("src", "../assets/images/enemy.png");
        charEnemyWins.setAttribute("alt", "enemy-char");
        gameOver.classList.add("end-screen");
        charEnemyWins.classList.add('img-enemy-wins');
        buttonMenu.classList.add('menu');
        gameOverText.textContent = "GAME OVER";
        buttonMenu.textContent = 'MENU';
        retryBtn.textContent = "TRY AGAIN";
        gameOver.appendChild(buttonMenu);
        gameOver.appendChild(gameOverText);
        gameOver.appendChild(charEnemyWins);
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
        let victory = document.createElement("div"),
            victoryText = document.createElement("h1"),
            retryBtn = document.createElement("button"),
            buttonMenu = document.createElement('button'),
            charPlayerWins = document.createElement('img');
        victory.setAttribute("id", "victory");
        retryBtn.setAttribute("id", "play-again");
        charPlayerWins.setAttribute("src", "../assets/images/player.png");
        victory.classList.add("victory");
        buttonMenu.classList.add('menu');
        victoryText.classList.add("victory__h1");
        charPlayerWins.classList.add('img-player-wins');
        buttonMenu.textContent = 'MENU';
        victoryText.textContent = "YOU WIN";
        retryBtn.textContent = "PLAY AGAIN";
        victory.appendChild(buttonMenu);
        victory.appendChild(victoryText);
        victory.appendChild(charPlayerWins);
        victory.appendChild(retryBtn);
        document.body.appendChild(victory);
        tryAgain(selector("#play-again"), selector('.victory'));
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

function enemyScream() {
    let randomScream = enemyScreams[Math.floor(Math.random() * 5)];
    enemy.health > 0 ? randomScream.play() : enemyScreams[5].play();
}

function endSound() {
    enemy.health <= 0 ? endSounds[0].play() : endSounds[1].play();
}

function menuButton(button, screen){
    let buttonClose = document.createElement('button');
    button.addEventListener('click', () => {
        let layerMenu = document.createElement('div'),
            menuOl = document.createElement('ul');

        layerMenu.classList.add('layer-menu');
        menuOl.classList.add('menu__ol');
        buttonClose.classList.add('close-menu');
        menuOl.innerHTML = `<li><a href="#">Instructions</a></li><li><a href="#">Credits</a></li><li><a href="#">Github</a></li>`;
        buttonClose.textContent = 'X';
        layerMenu.appendChild(buttonClose);
        layerMenu.appendChild(menuOl);
        screen.appendChild(layerMenu);
    });

    buttonClose.addEventListener('click', () => {
        screen.removeChild(selector('.layer-menu'));
    });
    
}