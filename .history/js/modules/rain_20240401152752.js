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

        drop.style.left = `${increment}%`;
        drop.style.bottom = `${randomFive}%`;
        drop.style.animationDelay = `0.${randomHundred}s`;
        drop.style.animationDuration = `0.5${randomHundred}s`
        stem.style.animationDelay = `0.${randomHundred}s`;
        stem.style.animationDuration = `0.5${randomHundred}s`
        splat.style.animationDelay = `0.${randomHundred}s`;
        splat.style.animationDuration = `0.5${randomHundred}s`

        drops += drop;
        backDrops += drop
    }

    rainFront.append(drops);
    rainBack.append(backDrops);

    console.log("it's still raining")
}

rain();