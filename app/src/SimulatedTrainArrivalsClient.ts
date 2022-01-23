const twelveSeconds = 1000 * 12;

export default class SimulatedTrainArrivalsClient {
  public interval: any;
  public stopped: boolean;
  private _callback: any;
  private _timeout: any;

  constructor(interval: number = twelveSeconds) {
    this.interval = interval;
    this.stopped = false;
    console.log("SimulatedTrainArrivalsClient created.");
  }

  async listenForEvents(id, callback) {
    console.log("Faking train arrivals for", id);

    this._callback = callback;
    this.simulateSingleTrain();
  }

  stopListening() {
    console.log("Stopping SimulatedTrainArrivalsClient.");

    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this.stopped = true;
  }

  async simulateSingleTrain() {
    this.fakeArrival();
    await sleep(this.interval);

    if (!this.stopped) {
      this.fakeDeparture();
      this._timeout = setTimeout(async () => await this.simulateSingleTrain(), this.interval);
    }
  }

  fakeArrival() {
    console.log("Faking train arrival.");
    this._callback({ line: "platformId1", arrived: true, source: this.constructor.name });
  }

  fakeDeparture() {
    console.log("Faking train departure.");
    this._callback({ line: "platformId1", departed: true, source: this.constructor.name });
  }

}

const sleep = (timeout) => new Promise(r => setTimeout(r, timeout));
