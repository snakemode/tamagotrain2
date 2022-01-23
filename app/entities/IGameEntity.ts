import { ITickable } from "../traits/ITickable";

export type Position = { x: number; y: number; };

export interface IGameEntity extends Position, ITickable {
    id: string;
    isDisplayed: boolean;
    completed: boolean;
}
