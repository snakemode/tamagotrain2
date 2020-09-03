const config = require("../Config");
const cfg = config.buffs.vent;

class VentBuff {
  constructor() {
    console.log("🌬 VentBuff()");
    this.ticks = cfg.buffLengthInTicks;
    this.completed = false;
  }
  
  tick(platform) {
    this.ticks--;
    platform.temperature += cfg.temperatureChangePerTick;
    platform.hygiene += cfg.hygieneChangePerTick;
    if (this.ticks == 0) {         
      this.completed = true;
    }
  }
}

module.exports = VentBuff;