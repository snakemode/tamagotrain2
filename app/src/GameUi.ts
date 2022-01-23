import Game from "./Game";
import { game as _game, problems } from "./Config";
import { rand } from "./utils";

const fps = _game.fps;
const hot = problems.heat.heatOverlayDisplaysAt;

class GameUi {
  public track: HTMLElement;
  public platform: HTMLElement;
  public playfield: HTMLElement;

  private _lastState: string;
  private _renderingFunctions: ((currentGameState: any, previousGameState: any) => void)[];

  constructor(game: Game) {
    this.playfield = document.getElementById("playfield");
    this.track = document.getElementById("track");
    this.platform = document.getElementById("platform");

    this._lastState = JSON.stringify(game);
    this._renderingFunctions = [
      renderLabels,
      renderGameStatus,
      renderTemperature,
      renderPlatform,
      renderContents,
      renderBuffs
    ];
  }

  public bindControls(game: Game) {
    const buttons = document.querySelectorAll("[data-action]");
    buttons.forEach(element => {
      const buff = element.getAttribute("data-action");
      const button = element as HTMLButtonElement;
      button.onclick = () => game.queueAction(buff, 'platformId1');
    });
  }

  public startRendering(game, dataSource) {
    setInterval(() => this.draw(game, dataSource), 1000 / fps);
  }

  private draw(g, dataSource) {
    if (JSON.stringify(g) === this._lastState) {
      return; // No state has changed, do we need to re-render?
    }

    if (g.ticks === 0 && this.platform) {
      this.resetUi();
    }

    const lastStateSnapshot = JSON.parse(this._lastState);
    for (let renderer of this._renderingFunctions) {

      const ret = renderer.call(this, g, lastStateSnapshot, dataSource);
      if (ret === -1) { // Renderer caused an early exit
        break;
      }
    }

    this._lastState = JSON.stringify(g);
  }

  private resetUi() {
    this.platform.innerHTML = "";
  }
}


function renderLabels(currentGameState, previousGameState) {
  const viewModel = {
    "game": currentGameState,
    "ticks": currentGameState.ticks,
    "gameovermsg": currentGameState.gameovermsg
  };

  let props = Object.getOwnPropertyNames(viewModel);
  for (let prop of props) {
    const selector = "[data-bind-" + prop + "]";
    const elements = [...document.querySelectorAll(selector)];
    for (let ele of elements) {
      ele.innerHTML = viewModel[prop];
    }
  }

  props = Object.getOwnPropertyNames(currentGameState.platform);
  for (let prop of props) {
    const selector = "[data-bind-platform-0-" + prop + "]";
    const elements = [...document.querySelectorAll(selector)];
    for (let ele of elements) {
      ele.innerHTML = currentGameState.platform[prop];
    }
  }
}

function renderBuffs(currentGameState, previousGameState) {
  const buffTing = document.getElementById("buffs");
  buffTing.innerHTML = "";

  for (let buff of currentGameState.platform.buffs) {
    const ele = document.createElement("div");
    ele.setAttribute("data-ticks", buff.ticks);
    ele.classList.add("buff");
    ele.classList.add(buff.constructor.name);
    buffTing.appendChild(ele);

  }
}

function renderGameStatus(currentGameState, previousGameState) {
  const gameOverScreen = document.getElementById("game-over-message");

  if (currentGameState.status !== "ended") {
    gameOverScreen.classList.add("hide");
    return;
  }

  gameOverScreen.classList.remove("hide");
  gameOverScreen.classList.add(currentGameState.status);
  gameOverScreen.classList.add("game-over-failure-" + currentGameState.gameover.conditionId);
  return -1;
}

function renderTemperature(currentGameState, previousGameState) {
  const overlay = document.getElementById("temperatureOverlay");
  if (currentGameState.platform.temperature > hot) {
    overlay.classList.remove("hide");
    overlay.style.opacity = (currentGameState.platform.temperature - 10).toString();
  } else {
    overlay.classList.add("hide");
  }
}

function renderPlatform(currentGameState, previousGameState) {
  const platformAsOfLastTick = previousGameState.platform;
  const trainImage = document.getElementById("trainSVG");

  if (!platformAsOfLastTick.hasTrain && currentGameState.platform.hasTrain) {
    trainImage.classList.remove("train", "close", "arrival", "slideOut");
    trainImage.classList.add("train", "arrival");
    this.track.appendChild(trainImage);
  }

  if (platformAsOfLastTick.hasTrain && platformAsOfLastTick.train.closeDoorsAtTick === platformAsOfLastTick.train.ticks) {
    trainImage.classList.add("close");
  }

  if (platformAsOfLastTick.hasTrain && !currentGameState.platform.hasTrain) {
    trainImage.classList.add("slideOut");
  }
}

function renderContents(currentGameState, previousGameState) {
  const platform = currentGameState.platform;

  const previousPlatform = previousGameState.platform;
  const previousContentIds = previousPlatform.contents.map(state => state.id);
  const currentContentIds = platform.contents.map(state => state.id);
  const removedItems = previousContentIds.filter(cid => currentContentIds.indexOf(cid) == -1);

  for (const removedEntityId of removedItems) {
    document.getElementById(removedEntityId).remove();
  }

  for (let [index, entity] of platform.contents.entries()) {

    let gfxTarget = document.getElementById(entity.id);

    if (!gfxTarget) {
      gfxTarget = document.createElement("div");

      gfxTarget.setAttribute('id', entity.id);
      gfxTarget.classList.add("entity");
      gfxTarget.classList.add(entity.constructor.name.toLowerCase());
      gfxTarget.classList.add(entity.constructor.name.toLowerCase() + Math.floor(Math.random() * 4));
      gfxTarget.setAttribute(`data-${entity.constructor.name.toLowerCase()}-id`, entity.id);

      const spawnPoint = rand(0, platform.spawnPoints.length);
      const spawnPointLocation = platform.spawnPoints[spawnPoint];
      const spawnX = spawnPointLocation.x;

      gfxTarget.style.position = "absolute";

      if (!entity.x) {
        entity.x = spawnX;
      }

      if (!entity.y) {
        entity.y = spawnPointLocation.y;
      }

      entity.isDisplayed = true;

      this.platform.appendChild(gfxTarget);
    }

    const props = Object.getOwnPropertyNames(entity);
    for (let prop of props) {
      gfxTarget.setAttribute("data-" + prop.toLowerCase(), entity[prop]);
    }

    gfxTarget.setAttribute("data-x", entity.x);
    gfxTarget.setAttribute("data-y", entity.y);

    gfxTarget.style.left = entity.x + "px";
    gfxTarget.style.top = entity.y + "px";
    gfxTarget.style.zIndex = 1000 + entity.y;
    gfxTarget.style.position = "absolute";

    if (entity.constructor.name == "Trash") {
      gfxTarget.style.zIndex = (20).toString();
    }
  }

}

export default GameUi;