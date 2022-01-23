export interface TrainEvent {
    source: string;
    arrived?: boolean;
    departed?: boolean;
    departsInMs?: number;
}

export type TrainEventCallback = (trainEvent: TrainEvent) => void;
