import { problems, entities } from "../../Config";
const cfg = problems.trash;
import Trash from "./Trash";
import Game from "../../Game";

describe("Mouse", () => {

  let game: Game;
  let trash, platform;
  beforeEach(() => {
    game = new Game();
    platform = game.platform;
    platform.hygiene = 50; // Or the mice try to leave.

    trash = new Trash(100, 100);
    trash.isDisplayed = true;
    platform.contents.push(trash);
  });

  it("tick - makes platform less hygienic per tick", () => {
    platform.hygiene = entities.platform.hygieneCap;

    trash.tick(game);

    expect(platform.hygiene).toBe(entities.platform.hygieneCap + cfg.hygieneChangePerTick);
  });

  it("tick - spawns a mouse if platform is not hygienic a percentage of the time", () => {
    platform.hygiene = cfg.chanceOfMouseWhenLessThanHygiene;
    trash.random = () => cfg.chanceOfMousePercent;

    trash.tick(game);

    expect(trash.spawnedMouse).toBe(true);
    expect(platform.contents.length).toBe(2);
    expect(platform.contents[1].constructor.name).toBe("Mouse");
  });


});