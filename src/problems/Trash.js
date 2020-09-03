const config = require("../Config");
const cfg = config.problems.trash;
const Problem = require("./Problem");
const Mouse = require("./Mouse");
const rand = require("../utils").rand;

class Trash extends Problem {
  constructor(x, y) {
    super(x, y);
    this.spawnedMouse = false;
  }
  
  tick(platform) {   
    
    platform.hygiene += cfg.hygieneChangePerTick;    
    
    // Spawn mouse if too trashy
    const random = this.random();
    
    if (!this.spawnedMouse && platform.hygiene <= cfg.chanceOfMouseWhenLessThanHygiene && random <= cfg.chanceOfMousePercent) {
      platform.contents.push(new Mouse(this.x, this.y));
      this.spawnedMouse = true;
    }
    
    this.ticks++;
  }  

  onCompletion(platform) {
  }
}

module.exports = Trash;