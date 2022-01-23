export type Position = { x: number; y: number; };

export interface TrainEvent {
    source: string;
    arrived?: boolean;
    departed?: boolean;
    departsInMs?: number;
}

export const nothing = async () => { };

export type TrainEventCallback = (trainEvent: TrainEvent) => void;

