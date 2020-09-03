const uuidv4 = require("../utils").uuidv4;
const rand = require("../utils").rand;

class Problem {
  constructor(x, y) {
    this.id = uuidv4();
    this.ticks = 0;
    this.x = x;
    this.y = y;    
    console.log("❗ " + this.constructor.name + "(id=" + this.id + ")");
  }

  random(min, max) { 
    min = min || 0;
    max = max || 100;
    return rand(min, max); 
  }
}

module.exports = Problem;