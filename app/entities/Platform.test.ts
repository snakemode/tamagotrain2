import Game from "../Game";
import { IGameEntity } from "./IGameEntity";
import Platform from "./Platform";

describe("Platform", () => {

  let game: Game;
  let platform: Platform;
  beforeEach(() => {
    game = new Game();
    platform = game.platform;
  });

  it("can be constructed", () => {
    expect(platform).toBeDefined();
  });

  it("tick - platform tick mirrors game tick counter", () => {
    game.ticks = 10;

    platform.tick(game);

    expect(platform.ticks).toBe(10);
  });

  it("tick - triggers each occupying element to act", () => {
    platform.hygiene = 100;
    platform.contents.push(new SomethingThatDecreasesHygieneByOne());

    platform.tick(game);

    expect(platform.hygiene).toBe(99);
  });

  it("tick - processes any queued messages", () => {
    const message = { foo: "bar" } as any;
    platform.unprocessedMessages.push(message);

    platform.tick(game);

    expect(platform.unprocessedMessages.length).toBe(0);
  });

  it("tick - creates a train when message is for arrival", () => {
    const message = { arrived: true } as any;
    platform.unprocessedMessages.push(message);

    platform.tick(game);

    expect(platform.train).toBeDefined();
    expect(platform.hasTrain).toBe(true);
  });

  it("tick - creates a train when message is for departure", () => {
    const message = { departed: true } as any;
    platform.unprocessedMessages.push(message);

    platform.tick(game);

    expect(platform.train).toBeNull();
    expect(platform.hasTrain).toBe(false);
  });

  it("tick - ticks any train", () => {
    const message = { arrived: true } as any;
    platform.unprocessedMessages.push(message);

    platform.tick(game);

    expect(platform.train.ticks).toBe(1);
  });

  it("tick - ticks any buff", () => {
    const buff = { ticks: 0, tick: function () { } };
    platform.buffs.push(buff);

    platform.tick(game);

    expect(buff.ticks).toBe(1);
  });

  it("tick - ticks any content", () => {
    const platformOccpier = { ticks: 0, tick: function () { } } as any;
    platform.contents.push(platformOccpier);

    platform.tick(game);

    expect(platformOccpier.ticks).toBe(1);
  });

  it("tick - doesn't crash if a platform occupier isn't tickable", () => {
    const platformOccpier = { ticks: 0 } as any;
    platform.contents.push(platformOccpier);

    platform.tick(game);

    expect(platformOccpier.ticks).toBe(0);
  });

  it("tick - removes any completed buff", () => {
    platform.buffs.push({ completed: true } as any);

    platform.tick(game);

    expect(platform.buffs.length).toBe(0);
  });

  it("tick - removes any completed content", () => {
    platform.contents.push({ completed: true } as any);

    platform.tick(game);

    expect(platform.contents.length).toBe(0);
  });

  it("tick - prevents key stats from becoming invalid", () => {
    platform.hygiene = -100
    platform.capacity = -100;

    platform.tick(game);

    expect(platform.hygiene).toBe(0);
    expect(platform.capacity).toBe(0);
  });

});


class SomethingThatDecreasesHygieneByOne implements IGameEntity {
  public id: string;
  public isDisplayed: boolean;
  public completed: boolean;
  public x: number;
  public y: number;
  public ticks: number;

  public tick(game: Game) {
    console.log("ontick");
    game.platform.hygiene--;
  }
}
