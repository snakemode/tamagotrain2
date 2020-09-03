const config = require("../Config");
const cfg = config.problems.trash;
const Trash = require("./Trash");
const Platform = require("../entities/Platform");

describe("Mouse", () => {
    
  let trash, platform;
  beforeEach(() => {
    platform = new Platform("platformId1");
    platform.hygiene = 50; // Or the mice try to leave.

    trash = new Trash(100, 100);
    trash.isDisplayed = true;
    platform.contents.push(trash);
  });
  
  it("tick - makes platform less hygienic per tick", () => {
    platform.hygiene = config.entities.platform.hygieneCap;    
    
    trash.tick(platform);

    expect(platform.hygiene).toBe(config.entities.platform.hygieneCap + cfg.hygieneChangePerTick);
  });
    
  it("tick - spawns a mouse if platform is not hygienic a percentage of the time", () => {
    platform.hygiene = cfg.chanceOfMouseWhenLessThanHygiene;
    trash.random = () => cfg.chanceOfMousePercent;
    
    trash.tick(platform);

    expect(trash.spawnedMouse).toBe(true);
    expect(platform.contents.length).toBe(2);
    expect(platform.contents[1].constructor.name).toBe("Mouse");
  });
  

});