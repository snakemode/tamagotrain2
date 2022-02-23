import Game from "./Game";
import Platform from "./entities/Platform";

describe("Game", () => {

  let game: Game;
  beforeEach(() => {
    game = new Game();
  });

  it("can be constructed", () => {
    expect(game).toBeDefined();
  });

  it("tick - increments tick counter", () => {
    game.tick();
    expect(game.ticks).toBe(1);
  });

  it("tick - ticks each platform", () => {
    game.platform = new Platform();

    game.tick();

    expect(game.platform.ticks).toBe(1);
  });

  it("tick - triggers game over when temperature too hot", () => {
    game.platform.temperature = 60;
    game.tick();
    expect(game.status).toBe("ended");
  });

  it("tick - triggers game over when temperature too cold", () => {
    game.platform.temperature = -60;
    game.tick();
    expect(game.status).toBe("ended");
  });

  it("tick - triggers game over when unhygienic", () => {
    game.platform.hygiene = 0;
    game.tick();
    expect(game.status).toBe("ended");
  });

  it("tick - triggers game over when platform is full", () => {
    game.platform.contents.push({} as any);
    game.platform.contents.push({} as any);
    game.platform.capacity = 1;
    game.tick();
    expect(game.status).toBe("ended");
  });

  it("queueAction clean queues appropriate buff up", () => {
    game.queueAction("CleanBuff");

    game.tick();

    expect(game.platform.buffs.length).toBe(1);
    expect(game.platform.buffs[0].constructor.name).toBe("CleanBuff");
  });

  it("queueAction vent queues appropriate buff up", () => {
    game.queueAction("VentBuff");

    game.tick();

    expect(game.platform.buffs.length).toBe(1);
    expect(game.platform.buffs[0].constructor.name).toBe("VentBuff");
  });

  it("queueAction music queues appropriate buff up", () => {
    game.queueAction("MusicBuff");

    game.tick();

    expect(game.platform.buffs.length).toBe(1);
    expect(game.platform.buffs[0].constructor.name).toBe("MusicBuff");
  });

  it("queueAction unknown buff, raises error", () => {
    game.queueAction("not_a_real_buff");
    expect(() => game.tick()).toThrow("Could not find handler called not_a_real_buff");
  });

  it("start updates game status", () => {
    game.start(startOptions);

    expect(game.status).toBe("active");
    game.stop();
  });

  it("start updates game status", () => {
    game.stop();
    expect(game.status).toBe("ended");
  });

  it("start ticks game counter", async () => {
    // Magic numbers here just make the game tick faster so tests don't take time
    game.config.ticksPerSecond = 100;
    game.start(startOptions);

    await sleep(15);

    expect(game.ticks).toBeGreaterThan(0);
    game.stop();
  });
});

const startOptions = {
  onGameStart: async () => { },
  onGameEnd: () => { }
};
const sleep = (timeout) => new Promise(r => setTimeout(r, timeout));