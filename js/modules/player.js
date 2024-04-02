export function Player (health, stamina, strength) {
    this.health = health;
    this.stamina = stamina;
    this.strength = strength;
    this.attackPlayer = function() {
        let miss = Math.round(Math.random() * 10);
        if (miss === 9) {
            return this.strength / 2;
        } else {
            return this.strength;
        }
    },
    this.specialAttackPlayer = function() {
        if (this.stamina >= 40) {
            this.stamina -= 40;
            return this.strength + 10 * Math.round(Math.random() * 3);
        }
    },
    this.receiveDamage = function(damage) {
        this.health -= damage;
    }
    this.healing = function() {
        if (this.stamina >= 20) {
            this.stamina -= 20;
            this.health += 35;
        }
    }
}