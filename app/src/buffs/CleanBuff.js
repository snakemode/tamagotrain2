import { buffs } from "../Config";
const cfg = buffs.clean;

class CleanBuff {
  constructor() {
    console.log("🧼 CleanBuff()");
    this.ticks = cfg.buffLengthInTicks;
    this.completed = false;
    this.hasTicked = false;
  }
  
  tick(platform) {
    this.ticks--;    
    platform.hygiene += cfg.hygieneChangePerTick;
    
    this.removeOneTrash(platform);
    
    if (this.ticks == 0) {
      this.completed = true;
    }
    
    this.hasTicked = true;
  }
  
  removeOneTrash(platform) {
    for (let index in platform.contents) {
      const entity = platform.contents[index];
      if (entity.constructor.name === "Trash") {
        platform.contents = platform.contents.filter(item => item !== entity);
        
        console.log("Removed an item of trash 🚮");
        return;
      }
    }    
  }
}

export default CleanBuff;