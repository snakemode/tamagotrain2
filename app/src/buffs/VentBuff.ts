import { buffs } from "../Config";
const cfg = buffs.vent;

export default class VentBuff {
  public ticks: number;
  public completed: boolean;

  constructor() {
    console.log("🌬 VentBuff()");
    this.ticks = cfg.buffLengthInTicks;
    this.completed = false;
  }

  public tick(platform) {
    this.ticks--;

    platform.temperature += cfg.temperatureChangePerTick;
    platform.hygiene += cfg.hygieneChangePerTick;

    if (this.ticks == 0) {
      this.completed = true;
    }
  }
}
