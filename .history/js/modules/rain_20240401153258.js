export function rain() {
    let rainFront = document.querySelector("#front-row");
    let rainBack = document.querySelector("#back-row");

    let increment = 0;
    let drops = "";
    let backDrops = "";

    let drop = document.createElement("div");
    let stem = document.createElement("div");
    let splat = document.createElement("div");
    drop.classList.add("drop");
    stem.classList.add("stem");
    splat.classList.add("splat");

    

    while (increment < 100) {
        let randomHundred = Math.round(Math.random() * 98);
        let randomFive = Math.round(Math.random() * 5);
        increment += randomFive;

        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randomFive + randomFive - 1 + 100) + '%; animation-delay: 0.' + randomHundred + 's; animation-duration: 0.5' + randomHundred + 's;"><div class="stem" style="animation-delay: 0.' + randomHundred + 's; animation-duration: 0.5' + randomHundred + 's;"></div><div class="splat" style="animation-delay: 0.' + randomHundred + 's; animation-duration: 0.5' + randomHundred + 's;"></div></div>';
        backDrops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randomFive + randomFive - 1 + 100) + '%; animation-delay: 0.' + randomHundred + 's; animation-duration: 0.5' + randomHundred + 's;"><div class="stem" style="animation-delay: 0.' + randomHundred + 's; animation-duration: 0.5' + randomHundred + 's;"></div><div class="splat" style="animation-delay: 0.' + randomHundred + 's; animation-duration: 0.5' + randomHundred + 's;"></div></div>';
    }

    rainFront.append(drops);
    rainBack.append(backDrops);

    console.log("it's still raining")
}

rain();