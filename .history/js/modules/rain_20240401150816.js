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
        
        drops += 
    }
}

rain();