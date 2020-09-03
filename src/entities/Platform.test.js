const Platform = require("./Platform");

describe("Platform", () => {
    
  let platform;
  beforeEach(() => {
    platform = new Platform("platformId1");
  });
  
  it("can be constructed", () => {
    expect(platform).toBeDefined();
  });
  
  it("tick - increments tick counter", () => {
    platform.tick();    
    expect(platform.ticks).toBe(1);
  });

  it("tick - triggers each occupying element to act", () => {
    platform.hygiene = 100;
    platform.contents.push(new SomethingThatDecreasesHygieneByOne());
    
    platform.tick(); 
    
    expect(platform.hygiene).toBe(99);
  });

  it("tick - processes any queued messages", () => {
    platform.unprocessedMessages.push({ "foo": "bar" });
    
    platform.tick(); 
    
    expect(platform.unprocessedMessages.length).toBe(0);
  });

  it("tick - creates a train when message is for arrival", () => {
    platform.unprocessedMessages.push({ arrived: true });
    
    platform.tick(); 
    
    expect(platform.train).toBeDefined();
    expect(platform.hasTrain).toBe(true);
  });

  it("tick - creates a train when message is for departure", () => {
    platform.unprocessedMessages.push({ departed: true });
    
    platform.tick(); 
    
    expect(platform.train).toBeNull();
    expect(platform.hasTrain).toBe(false);
  });

  it("tick - ticks any train", () => {
    platform.unprocessedMessages.push({ arrived: true });
    
    platform.tick(); 
    
    expect(platform.train.ticks).toBe(1);
  });
  
  it("tick - ticks any buff", () => {
    const buff = { ticks: 0, tick: function () { this.ticks++; } };
    platform.buffs.push(buff);
    
    platform.tick(); 
    
    expect(buff.ticks).toBe(1);
  });

  it("tick - ticks any content", () => {
    const platformOccpier = { ticks: 0, tick: function () { this.ticks++; } };
    platform.contents.push(platformOccpier);
    
    platform.tick(); 
    
    expect(platformOccpier.ticks).toBe(1);
  });

  it("tick - doesn't crash if a platform occupier isn't tickable", () => {
    const platformOccpier = { ticks: 0 };
    platform.contents.push(platformOccpier);
    
    platform.tick(); 
    
    expect(platformOccpier.ticks).toBe(0);
  });

  it("tick - removes any completed buff", () => {
    platform.buffs.push({ completed: true });
    
    platform.tick(); 
    
    expect(platform.buffs.length).toBe(0);
  });

  it("tick - removes any completed content", () => {
    platform.contents.push({ completed: true });
    
    platform.tick(); 
    
    expect(platform.contents.length).toBe(0);
  });

  it("tick - prevents key stats from becoming invalid", () => {
    platform.hygiene = -100
    platform.capacity = -100;

    platform.tick(); 

    expect(platform.hygiene).toBe(0);
    expect(platform.capacity).toBe(0);
  });
  
});


class SomethingThatDecreasesHygieneByOne {
  tick(platform) { 
    console.log("ontick");
    platform.hygiene--; 
  }
}
