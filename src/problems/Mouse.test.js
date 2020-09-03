const config = require("../Config");
const cfg = config.problems.mouse;
const Mouse = require("./Mouse");
const Platform = require("../entities/Platform");

describe("Mouse", () => {
    
  let mouse, platform;
  beforeEach(() => {
    platform = new Platform("platformId1");
    platform.hygiene = 50; // Or the mice try to leave.

    mouse = new Mouse(100, 100);
    mouse.isDisplayed = true;
  });

  it("ctor loads configured step size", () => {
    expect(mouse.stepSize).toBe(cfg.stepSize);
  });

  it("tick picks a random destination if one is not set", () => {
    delete mouse.destination;
    
    mouse.tick(platform);

    expect(mouse.destination).toBeDefined();
    expect(mouse.destination).not.toBe(mouse.offscreen);
  });

  it("tick - mice set destination to offscreen when it gets hygienic", () => {
    platform.hygiene = config.entities.platform.hygieneCap;    
    
    mouse.tick(platform);

    expect(mouse.destination).toBe(mouse.offscreen);
  });

  it("onCompletion improves hygiene", () => {
    platform.hygiene = 0;
    
    mouse.onCompletion(platform);    
    
    expect(platform.hygiene).toBe(cfg.hygieneChangeWhenMouseLeaves);
  });

  it("tick mice leave when platform is hygienic", () => {
    platform.hygiene = config.entities.platform.hygieneCap;
    
    for (let i = 0; i <= 100; i++) {
      mouse.tick(platform);
    }  
    
    expect(mouse.completed).toBe(true);
  });


  it("tick mice change destinations and 'wander' after they reach any given destination", () => {
    let firstDestination = null;

    for (let i = 0; i <= 100; i++) {
      mouse.tick(platform);

      if (i == 0) {
        firstDestination = mouse.destination;
      }
    }  
    
    expect(mouse.destination).not.toBe(firstDestination);
  });

});