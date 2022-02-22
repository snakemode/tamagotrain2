import { IGameEntity, Position } from "../entities/IGameEntity";
import { rand } from "../utils";

export function inTargetZone(location: Position, target: Position, tolerance: number) {
  tolerance = tolerance || 0;
  if (location.x < target.x - tolerance) return false;
  if (location.x > target.x + tolerance) return false;
  if (location.y < target.y - tolerance) return false;
  if (location.y > target.y + tolerance) return false;
  return true;
}

export function walkNaturally(walker: IGameEntity, target: Position, unitSize: number) {
  if (!walker.isDisplayed) { // Has not yet been rendered
    return;
  }

  const manhattenDistance = (p1: Position, p2: Position) => Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
  const stepSize = 1 * unitSize;

  const possibleSteps = [
    { x: walker.x - stepSize, y: walker.y - stepSize },
    { x: walker.x - stepSize, y: walker.y },
    { x: walker.x - stepSize, y: walker.y + stepSize },
    { x: walker.x, y: walker.y - stepSize },
    { x: walker.x, y: walker.y + stepSize },
    { x: walker.x + stepSize, y: walker.y - stepSize },
    { x: walker.x + stepSize, y: walker.y },
    { x: walker.x + stepSize, y: walker.y + stepSize },
  ];

  const currentManhattenDistance = manhattenDistance({ x: walker.x, y: walker.y }, target);
  const closerSteps = possibleSteps.filter(s => manhattenDistance(s, target) < currentManhattenDistance);

  if (closerSteps.length > 0) {
    const stepChoice = rand(0, closerSteps.length);
    const selectedStep = closerSteps[stepChoice];
    walker.x = selectedStep.x;
    walker.y = selectedStep.y;
  }
}

export default {
  inTargetZone,
  walkNaturally
}