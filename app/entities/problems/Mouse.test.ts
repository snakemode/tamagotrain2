import { problems, entities } from "../../Config";
const cfg = problems.mouse;
import Mouse from "./Mouse";
import Game from "../../Game";

describe("Mouse", () => {

  let mouse: Mouse;
  let platform, game;
  beforeEach(() => {
    game = new Game();
    platform = game.platform;
    platform.hygiene = 50; // Or the mice try to leave.

    mouse = new Mouse(100, 100);
    mouse.isDisplayed = true;
  });

  it("ctor loads configured step size", () => {
    expect(mouse.stepSize).toBe(cfg.stepSize);
  });

  it("tick picks a random destination if one is not set", () => {
    delete mouse.destination;

    mouse.tick(game);

    expect(mouse.destination).toBeDefined();
    expect(mouse.destination).not.toBe(mouse.offscreen);
  });

  it("tick - mice set destination to offscreen when it gets hygienic", () => {
    platform.hygiene = entities.platform.hygieneCap;

    mouse.tick(game);

    expect(mouse.destination).toBe(mouse.offscreen);
  });

  it("onCompletion improves hygiene", () => {
    platform.hygiene = 0;

    mouse.onCompletion(game);

    expect(platform.hygiene).toBe(cfg.hygieneChangeWhenMouseLeaves);
  });

  it("tick mice leave when platform is hygienic", () => {
    platform.hygiene = entities.platform.hygieneCap;

    for (let i = 0; i <= 100; i++) {
      mouse.tick(game);
    }

    expect(mouse.completed).toBe(true);
  });


  it("tick mice change destinations and 'wander' after they reach any given destination", () => {
    let firstDestination = null;

    for (let i = 0; i <= 100; i++) {
      mouse.tick(game);

      if (i == 0) {
        firstDestination = mouse.destination;
      }
    }

    expect(mouse.destination).not.toBe(firstDestination);
  });

});