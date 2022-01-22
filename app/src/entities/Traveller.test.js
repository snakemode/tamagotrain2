import { entities } from "../Config";
const cfg = entities.traveller;
import Traveller from "./Traveller";
import Platform from "./Platform";
import MusicBuff from "../buffs/MusicBuff";

describe("Traveller", () => {
    
  let traveller, platform;
  beforeEach(() => {
    traveller = new Traveller();
    platform = new Platform("platformId1");
  });
  
  it("can be constructed", () => {
    expect(traveller).toBeDefined();
    expect(traveller.id).toBeDefined();
    expect(traveller.ticks).toBe(0);
    expect(traveller.completed).toBe(false);
  });
  
  it("tick - increments tick counter", () => {
    traveller.tick(platform);  

    expect(traveller.ticks).toBe(1);
  });

  it("tick - reduces distance from exit by one", () => {
    traveller.ticksFromExit = 100;

    traveller.tick(platform);    

    expect(traveller.ticksFromExit).toBe(99);
  });

  it("tick - doesn't get closer to the exit when passed out", () => {
    traveller.ticksFromExit = 100;
    traveller.isPassedOut = true;

    traveller.tick(platform);    

    expect(traveller.ticksFromExit).toBe(100);
  });

  it("tick - doesn't get closer to the exit when muic is playing", () => {
    traveller.ticksFromExit = 100;
    platform.buffs.push(new MusicBuff());

    traveller.tick(platform);    

    expect(traveller.ticksFromExit).toBe(100);
  });

  it("tick - litters 5 percent of the time when hasn't already littered", () => {
    traveller.droppedTrash = false;
    traveller.random = () => 5;

    traveller.tick(platform); 

    expect(platform.contents[0].constructor.name).toBe("Trash");
    expect(traveller.droppedTrash).toBe(true);
  });

  it("tick - doesn't litter 95% of the time", () => {
    traveller.random = () => 6;

    traveller.tick(platform); 

    expect(traveller.droppedTrash).toBe(false);
  });

  it("tick - doesn't litter if they already have", () => {
    traveller.random = () => 5;

    traveller.tick(platform);  // litters
    traveller.tick(platform);  // doesn't litter

    expect(platform.contents.length).toBe(1); // only one trash
  });

  it("tick - passes out 10 percent of the time when hygiene is poor", () => {
    platform.hygiene = 30;
    traveller.random = () => 10;

    traveller.tick(platform); 

    expect(traveller.isPassedOut).toBe(true);
  });

  it("tick - traveller is at the exit, flags as completed", () => {
    traveller.ticksFromExit = 0;

    traveller.tick(platform); 

    expect(traveller.completed).toBe(true);
  });

  it("tick - traveller is at the exit, changes temperature by configured delta", () => {
    platform.temperature = 20;
    traveller.ticksFromExit = 0;

    traveller.tick(platform);

    expect(platform.temperature).toBe(20 + cfg.temperatureChangeOnCompletion);
  });
});