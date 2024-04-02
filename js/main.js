import { Player } from "./modules/player.js";
import { Enemy } from "./modules/enemy.js";
import { rain } from "./modules/rain.js";

const selector = selector => document.querySelector(selector);
const selectAll = selector => document.querySelectorAll(selector);
const rainMenu = new Audio("../music/rain-menu.mp3");
const menuMusic = new Audio("../music/menu-music.mp3");
const rainSound = new Audio("../music/rain.mp3");
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
rainMenu.volume = 0.4;
rainSound.volume = 0.1;
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
stateStamina();
stateHealth();

function intro() {
    selector("#main-container").style.display = 'none';
    let introAlert = document.createElement('div'),
        introText = document.createElement('div'),
        acceptButton = document.createElement('button');
    acceptButton.setAttribute('id', 'accept');

    introAlert.classList.add('modal-intro');
    introText.classList.add('modal-text');
    acceptButton.textContent = 'ACCEPT';
    introText.innerHTML = `
    <h2 class="modal-text__h2">Welcome to <span>NovaDuel</span>!</h2>
    <p>The use of headphones is recommended for a better experience.</p>
    <p>Use the attack buttons (normal and special attack) to defeat your opponent, you can also heal yourself with the heal button. Be careful with your health and stamina, if you run out of health you will lose the game. Good luck!</p>`;
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
    musicButton.innerHTML = `<img class="music-button" src="../assets/images/music.webp" alt="music on">`;
    effectsButton.setAttribute('id', 'effects');
    effectsButton.innerHTML = '<img class="speaker-button" src="../assets/images/speaker.webp" alt="speaker on">';
    layer.appendChild(buttonMenu);
    layer.appendChild(layerGradient);
    layer.appendChild(title);
    layer.appendChild(startButton);
    layer.appendChild(musicButton);
    layer.appendChild(effectsButton);
    document.body.appendChild(layer);
    startButton.addEventListener('click', () => {
        selector("#main-container").style.display = 'block';
        rain();
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
    menuButton(buttonMenu, selector('.main-game'))
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
    if (enemy.health <= 25 && enemy.stamina >= 20) {
        clearInterval(enemyLowInterval);
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
                    clearInterval(enemyLowInterval);
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
    }
    setTimeout(stateHealth(), 250)
    updateBars();
    enemyWins();
}

let buttons = selectAll(".btn");
let enemyTimeOut;

basicAttackBtn.addEventListener('click', function() {
    actionSounds[0].play();
    setTimeout(enemyHit, 300);
    let playerStrength = player.attackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
        button.style.filter = 'grayscale(60%)';
        button.style.cursor = 'not-allowed';
    });
    enemyTimeOut = setTimeout(actionsEnemy, 1500);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "");
            button.style.filter = 'none';
            button.style.cursor = 'url("../assets/images/cursor-pointer.png"), auto';
            stateHealth();
            stateStamina();
        });
    }, 2500);
    updateBars();
    playerWins();
});
specialAttackBtn.addEventListener('click', function() {
    actionSounds[1].play();
    setTimeout(enemyHit, 300);
    let playerStrength = player.specialAttackPlayer();
    enemy.receiveDamage(playerStrength);
    buttons.forEach(button => {
        button.setAttribute("disabled", "")
        button.style.filter = 'grayscale(60%)';
        button.style.cursor = 'not-allowed';
    })
    enemyTimeOut = setTimeout(actionsEnemy, 1700);
    setTimeout(function() {
        buttons.forEach(button => {
            button.removeAttribute("disabled", "");
            button.style.filter = 'none';
            button.style.cursor = 'url("../assets/images/cursor-pointer.png"), auto';
            stateHealth();
            stateStamina();
        })
    }, 2500)
    updateBars();
    playerWins();
});
healBtn.addEventListener('click', function() {
    clearInterval(playerLowInterval);
    if (player.health > 70 || player.stamina === 0) {
        alert("No puedes curarte ahora mismo");
    } else {
        playerHeals();
        player.healing();
        buttons.forEach(button => {
            button.setAttribute("disabled", "");
            button.style.filter = 'grayscale(60%)';
            button.style.cursor = 'not-allowed';
        })
        enemyTimeOut = setTimeout(actionsEnemy, 2000);
        setTimeout(function() {
            buttons.forEach(button => {
                button.removeAttribute("disabled", "");
                button.style.filter = 'none';
                button.style.cursor = 'url("../assets/images/cursor-pointer.png"), auto';
                stateHealth();
                stateStamina();
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
        healBtn.style.filter = 'grayscale(60%)';
        healBtn.style.cursor = 'not-allowed';
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You are already healed");
        });
    }
    
    if (player.health <= 65) {
        healBtn.style.filter = 'none';
        healBtn.style.cursor = 'url("../assets/images/cursor-pointer.png"), auto';
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You can heal");
        });
    }

    if (player.health <= 35) {
        healBtn.style.filter = 'none';
        healBtn.style.cursor = 'url("../assets/images/cursor-pointer.png"), auto';
        playerLowHealth();
    } else if (player.health > 35) {
        clearInterval(playerLowInterval);
    }

    if (enemy.health <= 35) {
        enemyLowHealth();
    } else if (enemy.health > 35) {
        clearInterval(enemyLowInterval);
    }
};

function stateStamina() {
    if (player.stamina < 20) {
        healBtn.style.filter = 'grayscale(60%)';
        healBtn.style.cursor = 'not-allowed';
        healBtn.setAttribute("disabled", "");
        healBtn.addEventListener('mouseover', (e) => {
            e.target.setAttribute("title", "You don't have enough stamina");
        });
    } 
    if (player.stamina < 40) {
        specialAttackBtn.style.filter = 'grayscale(60%)';
        specialAttackBtn.style.cursor = 'not-allowed';
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
        let victory = document.createElement("div"),
            victoryText = document.createElement("h1"),
            retryBtn = document.createElement("button"),
            charPlayerWins = document.createElement('img');
        victory.setAttribute("id", "victory");
        retryBtn.setAttribute("id", "play-again");
        charPlayerWins.setAttribute("src", "../assets/images/player.webp");
        victory.classList.add("victory");
        victoryText.classList.add("victory__h1");
        charPlayerWins.classList.add('img-player-wins');
        victoryText.textContent = "YOU WIN";
        retryBtn.textContent = "PLAY AGAIN";
        victory.appendChild(victoryText);
        victory.appendChild(charPlayerWins);
        victory.appendChild(retryBtn);
        document.body.appendChild(victory);
        tryAgain(selector("#play-again"), selector('.victory'));
    }
}

function tryAgain(buttonRetry, screen) {
    player.health = 100;
    enemy.health = 100;
    player.stamina = 100;
    enemy.stamina = 100;
    stateHealth();
    updateBars();
    clearInterval(enemyLowInterval);
    clearInterval(playerLowInterval);
    buttonRetry.addEventListener('click', () => {
        startSound.play();
        playMusic();
        screen.remove();
        selector("#main-container").style.display = 'block';
    });
}

function toggleMusic() {
    let musicButton = document.querySelector("#music")
    if (volumeMusicOn === false) {
        musicButton.innerHTML = `<img class="music-button" src="../assets/images/music.webp" alt="music on">`;
        menuMusic.volume = 1;
        battleMusic.volume = 0.2;
        volumeMusicOn = true;
    } else if (volumeMusicOn === true) {
        musicButton.innerHTML = `<img class="music-button" src="../assets/images/music-off.webp" alt="music off">`;
        menuMusic.volume = 0;
        battleMusic.volume = 0;
        volumeMusicOn = false;
    }
}

function toggleFx() {
    let effectsButton = document.querySelector("#effects")
    if (volumeFxOn === false) {
        effectsButton.innerHTML = '<img class="speaker-button" src="../assets/images/speaker.webp" alt="speaker on">';
        enemyScreams.forEach(scream => {
            scream.volume = 1;
        })
        endSounds.forEach(sound => {
            sound.volume = 0.5;
        })
        actionSounds.forEach(sound => {
            sound.volume = 0.5;
        })
        rainMenu.volume = 0.4;
        rainSound.volume = 0.1;
        volumeFxOn = true;
    } else if (volumeFxOn === true) {
        effectsButton.innerHTML = '<img class="speaker-button" src="../assets/images/speaker-off.webp" alt="speaker off">';
        enemyScreams.forEach(scream => {
            scream.volume = 0;
        })
        endSounds.forEach(sound => {
            sound.volume = 0;
        })
        actionSounds.forEach(sound => {
            sound.volume = 0;
        })
        rainMenu.volume = 0;
        rainSound.volume = 0;
        volumeFxOn = false;
    }
}

function playMusic() {
    if (menuMusicIsPlaying === false) {
        rainSound.pause();
        battleMusic.pause();
        rainSound.currentTime = 0;
        battleMusic.currentTime = 0;
        rainMenu.play();
        menuMusic.play();
        menuMusicIsPlaying = true;
    } else if (menuMusicIsPlaying === true) {
        rainMenu.pause();
        menuMusic.pause();
        rainMenu.currentTime = 0;
        menuMusic.currentTime = 0;
        rainSound.loop = true;
        battleMusic.loop = true;
        rainSound.play();
        battleMusic.play();
        menuMusicIsPlaying = false;
    }
}

function enemyHit() {
    let randomScream = enemyScreams[Math.floor(Math.random() * 5)];
    enemyImage.style.backgroundImage = "url('../assets/images/enemy-hit.webp')";
    setTimeout(function() {
        enemyImage.style.backgroundImage = "url('../assets/images/enemy.webp')"
    }, 200);
    enemy.health > 0 ? randomScream.play() : enemyScreams[5].play();
}

function enemyHeals() {
    actionSounds[2].play();
    enemyImage.style.backgroundImage = "url('../assets/images/enemy-heal.webp')";
    setTimeout(function() {
        enemyImage.style.backgroundImage = "url('../assets/images/enemy.webp')"
    }, 1500);
}

function endSound() {
    enemy.health <= 0 ? endSounds[0].play() : endSounds[1].play();
}

function playerHit() {
    playerImage.style.backgroundImage = "url('../assets/images/player-hit.webp')";
    setTimeout(function() {
        playerImage.style.backgroundImage = "url('../assets/images/player.webp')"
    }, 200);
}

function playerHeals() {
    actionSounds[2].play();
    playerImage.style.backgroundImage = "url('../assets/images/player-heal.webp')";
    setTimeout(function() {
        playerImage.style.backgroundImage = "url('../assets/images/player.webp')"
    }, 1500);
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

function menuButton(button, screen){
    let buttonClose = document.createElement('button');
    button.addEventListener('click', () => {
        let layerMenu = document.createElement('div'),
            menuOl = document.createElement('ul');

        layerMenu.classList.add('layer-menu');
        menuOl.classList.add('menu__ol');
        buttonClose.classList.add('close-menu');
        menuOl.innerHTML = `<li><button id="first" class="option-btn">Instructions</button></li><li><button id="second" class="option-btn">Credits</button></li><li><button id="third" class="option-btn">Github</button></li>`;
        buttonClose.textContent = 'X';
        layerMenu.appendChild(buttonClose);
        layerMenu.appendChild(menuOl);
        screen.appendChild(layerMenu);
        
        let arrayoptionBtn = selectAll('.option-btn');
        arrayoptionBtn.forEach(optionBtn => {
            optionBtn.addEventListener('click', () => {
                layerMenu.style.display = 'none';
                layerTextOptions(screen, optionBtn);
            });
        });
    });
    
    buttonClose.addEventListener('click', () => {
        screen.removeChild(selector('.layer-menu'));
    });
    
}

function layerTextOptions(screen, optionButton) {
    let layer = document.createElement('div'),
        option = document.createElement('div');
    
    option.classList.add('option');
    layer.classList.add('layer-option');
    let close;
    switch(optionButton.id) {
        case 'first':
            option.innerHTML = `
            <button class="close-menu" id="btn-close">X</button>
            <h2 class="option__h2">Instructions</h2>
            <ul>
                <li><img src="../assets/images/attack.png"> <p>Normal attack</p></li>
                <li><img src="../assets/images/special.png"> <p>Special attack, consumes 40 stamina.</p></li>
                <li><img src="../assets/images/heal.png"> <p>Heal yourself, consumes 20 stamina.</p></li>
            </ul>`;
            break;
        case 'second':
            option.innerHTML = `
            <button class="close-menu first" id="btn-close">X</button>
            <h2 class="option__h2">Devs</h2>
            <ul class="credits-ul">
                <li>
                <div class="link-wrapper">
                    <a href="https://github.com/DarkOwn3r" target="_blank">
                        <img src="../assets/images/pablo-profile.png">
                        <p>Pablo Santana Ojeda</p>
                    </a>
                </div>
                </li>
                <li>
                    <div class="link-wrapper">
                        <a href="https://github.com/Monica-R" target="_blank">
                            <img src="../assets/images/monica-r-profile.png">
                            <p>Mónica Roka Paco</p>
                        </a>
                    </div>
                </li>
            </ul>`;
            break;
        case 'third':
            option.innerHTML = `<button class="close-menu" id="btn-close">X</button><p><a class="repo-game" href="https://github.com/NovaDuel/novaduel-game" target="_blank"><img src="../assets/images/github.png">NovaDuel</a></p>`;
            break;
    }
    layer.appendChild(option);
    screen.appendChild(layer);
    close = selector('#btn-close');
    close.addEventListener('click', () => {
        screen.removeChild(layer);
    });
}