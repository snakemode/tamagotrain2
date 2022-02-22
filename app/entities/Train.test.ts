import { entities } from "../Config";
const cfg = entities.train;
import Train from "./Train";
import Game from "../Game";

describe("Train", () => {

  let train, platform, game;
  beforeEach(() => {
    game = new Game();
    platform = game.platform;
    train = new Train();
  });

  it("can be constructed", () => {
    expect(train).toBeDefined();
    expect(train.id).toBeDefined();
    expect(train.hasTicked).toBe(false);
    expect(train.ticks).toBe(0);
  });

  it("tick - increase temperature by 0.25", () => {
    platform.temperature = 10.25;
    train.tick(game);
    expect(platform.temperature).toBe(10.5);
  });

  it("tick - opens doors on first tick", () => {
    train.ticks = 0;
    train.tick(game);
    expect(train.doorState).toBe("open");
  });

  it("tick - closes doors after configured value", () => {
    train.ticks = cfg.doorsCloseAtTick + 1;
    train.tick(game);
    expect(train.doorState).toBe("closed");
  });

  it("tick - adds a new traveller to the platform from confgured tick number", () => {
    train.ticks = cfg.spawnPassengersFromTick;

    train.tick(game);

    expect(platform.contents.length).toBe(cfg.spawnPassengersPerTick);
    expect(platform.contents[0].constructor.name).toBe("Traveller");
  });

  it("tick - spawn rate observes configuration", () => {
    cfg.spawnPassengersPerTick = 3;
    train.ticks = cfg.spawnPassengersFromTick;

    train.tick(game);

    expect(platform.contents.length).toBe(3);
  });
});
