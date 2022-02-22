import { entities } from "../Config";
const cfg = entities.traveller;
import Traveller from "./Traveller";
import Platform from "./Platform";
import MusicBuff from "../buffs/MusicBuff";
import Game from "../Game";

describe("Traveller", () => {

  let game: Game;
  let platform: Platform;
  let traveller: Traveller;
  beforeEach(() => {
    game = new Game();
    platform = game.platform;
    traveller = new Traveller();
  });

  it("can be constructed", () => {
    expect(traveller).toBeDefined();
    expect(traveller.id).toBeDefined();
    expect(traveller.ticks).toBe(0);
    expect(traveller.completed).toBe(false);
  });

  it("tick - reduces distance from exit by one", () => {
    traveller.ticksFromExit = 100;

    traveller.tick(game);

    expect(traveller.ticksFromExit).toBe(99);
  });

  it("tick - doesn't get closer to the exit when passed out", () => {
    traveller.ticksFromExit = 100;
    traveller.isPassedOut = true;

    traveller.tick(game);

    expect(traveller.ticksFromExit).toBe(100);
  });

  it("tick - doesn't get closer to the exit when muic is playing", () => {
    traveller.ticksFromExit = 100;
    platform.buffs.push(new MusicBuff());

    traveller.tick(game);

    expect(traveller.ticksFromExit).toBe(100);
  });

  it("tick - litters 5 percent of the time when hasn't already littered", () => {
    traveller.droppedTrash = false;
    traveller.random = () => 5;

    traveller.tick(game);

    expect(platform.contents[0].constructor.name).toBe("Trash");
    expect(traveller.droppedTrash).toBe(true);
  });

  it("tick - doesn't litter 95% of the time", () => {
    traveller.random = () => 6;

    traveller.tick(game);

    expect(traveller.droppedTrash).toBe(false);
  });

  it("tick - doesn't litter if they already have", () => {
    traveller.random = () => 5;

    traveller.tick(game);  // litters
    traveller.tick(game);  // doesn't litter

    expect(platform.contents.length).toBe(1); // only one trash
  });

  it("tick - passes out 10 percent of the time when hygiene is poor", () => {
    platform.hygiene = 30;
    traveller.random = () => 10;

    traveller.tick(game);

    expect(traveller.isPassedOut).toBe(true);
  });

  it("tick - traveller is at the exit, flags as completed", () => {
    traveller.ticksFromExit = 0;

    traveller.tick(game);

    expect(traveller.completed).toBe(true);
  });

  it("tick - traveller is at the exit, changes temperature by configured delta", () => {
    platform.temperature = 20;
    traveller.ticksFromExit = 0;

    traveller.tick(game);

    expect(platform.temperature).toBe(20 + cfg.temperatureChangeOnCompletion);
  });
});