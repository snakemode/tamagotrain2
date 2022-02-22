import { entities } from "../Config";
const cfg = entities.train;
import Train from "./Train";
import Platform from "./Platform";

describe("Train", () => {
    
  let train, platform;
  beforeEach(() => {
    platform = new Platform();
    train = new Train();
  });
  
  it("can be constructed", () => {
    expect(train).toBeDefined();
    expect(train.id).toBeDefined();
    expect(train.hasTicked).toBe(false);
    expect(train.ticks).toBe(0);
  });
  
  it("tick - increments tick counter", () => {
    train.tick(platform);    
    expect(train.ticks).toBe(1);
  });  

  it("tick - increase temperature by 0.25", () => {
    platform.temperature = 10.25;    
    train.tick(platform);    
    expect(platform.temperature).toBe(10.5);
  });  

  it("tick - opens doors on first tick", () => {
    train.ticks = 0;
    train.tick(platform);    
    expect(train.doorState).toBe("opening");
  }); 

  it("tick - closes doors after configured value", () => {
    train.ticks = cfg.doorsCloseAtTick + 1;
    train.tick(platform);    
    expect(train.doorState).toBe("closing");
  });  

  it("tick - adds a new traveller to the platform from confgured tick number", () => {       
    train.ticks = cfg.spawnPassengersFromTick;
    
    train.tick(platform);

    expect(platform.contents.length).toBe(cfg.spawnPassengersPerTick);
    expect(platform.contents[0].constructor.name).toBe("Traveller");
  }); 

  it("tick - spawn rate observes configuration", () => {       
    cfg.spawnPassengersPerTick = 3;
    train.ticks = cfg.spawnPassengersFromTick;
    
    train.tick(platform);

    expect(platform.contents.length).toBe(3);
  }); 

});