const AblyTrainArrivalsClient = require("./AblyTrainArrivalsClient");

describe("AblyTrainArrivalsClient", async () => {

    let sut, ably, ablyChannel;
    beforeEach(() => {
        ablyChannel = {
            attach: () => { },
            subscribe: () => { },
            history: (_) => fullAblyResponse()
        };
        
        ably = {};
        ably.channels = {};
        ably.channels.get = async () => ablyChannel;

        sut = new AblyTrainArrivalsClient(ably);
    });

    it("listenForEvents raises a message when a train passes its TimeToStation time", async () => {
        let returnedMessages = [];

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep(1200);
        
        expect(returnedMessages[0].arrived).toBe(true);
        expect(returnedMessages[0].sourceMessage.Towards).toBe("Kennington via CX");
    });
    
    it("listenForEvents raises a departed message half way to the arrival of the next train", async () => {
        let returnedMessages = [];

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep(2100);
        
        expect(returnedMessages[0].departsInMs).toBe(1000);
        expect(returnedMessages[1].departed).toBe(true);
        expect(returnedMessages[1].sourceMessage.Towards).toBe("Kennington via CX");
    });

    it("listenForEvents still sends train departure notifications when timetable is replaced", async () => {
        let returnedMessages = [];

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep(1100);
        
        sut.timetableUpdated(pushedAblyUpdate().items[0]);
        await sleep(1100);
        
        expect(returnedMessages[1].departed).toBe(true);
        expect(returnedMessages[1].sourceMessage.Towards).toBe("Kennington via CX");
    });

    it("listenForEvents respects new timetable when timetable replaced", async () => {
        let returnedMessages = [];
        const updatedTimetable = pushedAblyUpdate();

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep(1100);
        
        sut.timetableUpdated(updatedTimetable.items[0]);
        await sleep(3000);
        
        expect(returnedMessages[2].sourceMessage.Towards).toBe("Edgware via CX - replaced");
    });
  
    it("something something merge a response", () => {
      const resp = fakeResponseCorrectShape;
      
      const allLines = Object.getOwnPropertyNames(resp.data);
      const allTrains = [];
      for (let arrayOfTrains of allLines) {
        //console.log(arrayOfTrains);
        allTrains.concat(arrayOfTrains);
      }

      console.log(allTrains);
      
    });
  
});

const fullAblyResponse = () => {

    const trains = [{
        "Id": "-1711142636",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUEUS",
        "StationName": "Euston Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Southbound - Platform 2",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUKNG",
        "DestinationName": "Kennington Underground Station",
        "Timestamp": "2020-03-31T13:24:31.0891267Z",
        "TimeToStation": 1,
        "CurrentLocation": "At Camden Town",
        "Towards": "Kennington via CX",
        "ExpectedArrival": "2020-03-31T13:27:22Z",
        "TimeToLive": "2020-03-31T13:27:22Z",
        "ModeName": "tube",
        "Timing": {
            "CountdownServerAdjustment": "00:00:00",
            "Source": "0001-01-01T00:00:00",
            "Insert": "0001-01-01T00:00:00",
            "Read": "2020-03-31T13:24:31.091Z",
            "Sent": "2020-03-31T13:24:31Z",
            "Received": "0001-01-01T00:00:00"
        }
    }, 
    {
        "Id": "-1711142636",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUEUS",
        "StationName": "Euston Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Northbound - Platform 1",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUEGW",
        "DestinationName": "Edgware Underground Station",
        "Timestamp": "2020-03-31T13:24:31.0891267Z",
        "TimeToStation": 2,
        "CurrentLocation": "Between Embankment and Charing Cross",
        "Towards": "Edgware via CX",
        "ExpectedArrival": "2020-03-31T13:31:22Z",
        "TimeToLive": "2020-03-31T13:31:22Z",
        "ModeName": "tube",
        "Timing": {
            "CountdownServerAdjustment": "00:00:00",
            "Source": "0001-01-01T00:00:00",
            "Insert": "0001-01-01T00:00:00",
            "Read": "2020-03-31T13:24:31.091Z",
            "Sent": "2020-03-31T13:24:31Z",
            "Received": "0001-01-01T00:00:00"
        }
    }];

    return {
        items: [
            {
                "name": "data",
                "id": "7ARFsAk7ld:0:0",
                "encoding": null,
                "data": trains
            }
        ]
    };
}


const pushedAblyUpdate = () => {
    return {
        items: [
            {
                "name": "data",
                "id": "7ARFsAk7ld:0:0",
                "encoding": null,
                "data":  [{
                    "Id": "-1711142636",
                    "OperationType": 1,
                    "VehicleId": "000",
                    "NaptanId": "940GZZLUEUS",
                    "StationName": "Euston Underground Station",
                    "LineId": "northern",
                    "LineName": "Northern",
                    "PlatformName": "Northbound - Platform 1",
                    "Direction": "outbound",
                    "Bearing": "",
                    "DestinationNaptanId": "940GZZLUEGW",
                    "DestinationName": "Edgware Underground Station",
                    "Timestamp": "2020-03-31T13:24:31.0891267Z",
                    "TimeToStation": 2,
                    "CurrentLocation": "Between Embankment and Charing Cross",
                    "Towards": "Edgware via CX - replaced",
                    "ExpectedArrival": "2020-03-31T13:31:22Z",
                    "TimeToLive": "2020-03-31T13:31:22Z",
                    "ModeName": "tube",
                    "Timing": {
                        "CountdownServerAdjustment": "00:00:00",
                        "Source": "0001-01-01T00:00:00",
                        "Insert": "0001-01-01T00:00:00",
                        "Read": "2020-03-31T13:24:31.091Z",
                        "Sent": "2020-03-31T13:24:31Z",
                        "Received": "0001-01-01T00:00:00"
                    }
                }]
            }
        ]
    };
}


const sleep = (timeout) => new Promise(r => setTimeout(r, timeout));

// Sorry mum

const fakeResponseCorrectShape = {
  "name": "data",
  "id": "hcNh8VMXkP:0:0",
  "encoding": null,
  "data": {
    "line 1": [
      {
        "Id": "825078308",
        "OperationType": 1,
        "VehicleId": "523",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBKG",
        "DestinationName": "Barking Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 100,
        "CurrentLocation": "At Royal Oak Platform 2",
        "Towards": "Barking",
        "ExpectedArrival": "2020-04-15T15:12:06Z",
        "TimeToLive": "2020-04-15T15:12:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-272289981",
        "OperationType": 1,
        "VehicleId": "524",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBKG",
        "DestinationName": "Barking Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 200,
        "CurrentLocation": "At Hammersmith Platform 1",
        "Towards": "Barking",
        "ExpectedArrival": "2020-04-15T15:21:06Z",
        "TimeToLive": "2020-04-15T15:21:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ],
    "line 2": [
      {
        "Id": "825078308",
        "OperationType": 1,
        "VehicleId": "523",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBKG",
        "DestinationName": "Barking Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 150,
        "CurrentLocation": "At Royal Oak Platform 2",
        "Towards": "Barking",
        "ExpectedArrival": "2020-04-15T15:12:06Z",
        "TimeToLive": "2020-04-15T15:12:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-272289981",
        "OperationType": 1,
        "VehicleId": "524",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBKG",
        "DestinationName": "Barking Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 350,
        "CurrentLocation": "At Hammersmith Platform 1",
        "Towards": "Barking",
        "ExpectedArrival": "2020-04-15T15:21:06Z",
        "TimeToLive": "2020-04-15T15:21:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ]
  }
}


const anActualResponse = {
  "name": "data",
  "id": "hcNh8VMXkP:0:0",
  "encoding": null,
  "data": {
    "hammersmith & city": [
      {
        "Id": "825078308",
        "OperationType": 1,
        "VehicleId": "523",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBKG",
        "DestinationName": "Barking Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 773,
        "CurrentLocation": "At Royal Oak Platform 2",
        "Towards": "Barking",
        "ExpectedArrival": "2020-04-15T15:12:06Z",
        "TimeToLive": "2020-04-15T15:12:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-272289981",
        "OperationType": 1,
        "VehicleId": "524",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBKG",
        "DestinationName": "Barking Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 1313,
        "CurrentLocation": "At Hammersmith Platform 1",
        "Towards": "Barking",
        "ExpectedArrival": "2020-04-15T15:21:06Z",
        "TimeToLive": "2020-04-15T15:21:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-2016443984",
        "OperationType": 1,
        "VehicleId": "527",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "hammersmith-city",
        "LineName": "Hammersmith & City",
        "PlatformName": "Westbound - Platform 1",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHSC",
        "DestinationName": "Hammersmith (H&C Line) Underground Station",
        "Timestamp": "2020-04-15T14:59:13.0492223Z",
        "TimeToStation": 1313,
        "CurrentLocation": "Between Bromley-by-Bow and Mile End",
        "Towards": "Hammersmith",
        "ExpectedArrival": "2020-04-15T15:21:06Z",
        "TimeToLive": "2020-04-15T15:21:06Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:59:12.713Z",
          "Sent": "2020-04-15T14:59:13Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ],
    "piccadilly": [
      {
        "Id": "-1620390644",
        "OperationType": 1,
        "VehicleId": "502",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "piccadilly",
        "LineName": "Piccadilly",
        "PlatformName": "Westbound - Platform 5",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHR4",
        "DestinationName": "Heathrow Terminal 4 Underground Station",
        "Timestamp": "2020-04-15T14:56:19.563053Z",
        "TimeToStation": 71,
        "CurrentLocation": "Between Caledonian Road and King's Cross",
        "Towards": "Heathrow via T4 Loop",
        "ExpectedArrival": "2020-04-15T14:57:30Z",
        "TimeToLive": "2020-04-15T14:57:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:56:15.372Z",
          "Sent": "2020-04-15T14:56:19Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-455630960",
        "OperationType": 1,
        "VehicleId": "516",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "piccadilly",
        "LineName": "Piccadilly",
        "PlatformName": "Eastbound - Platform 6",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUCKS",
        "DestinationName": "Cockfosters Underground Station",
        "Timestamp": "2020-04-15T14:56:19.563053Z",
        "TimeToStation": 521,
        "CurrentLocation": "Between Green Park and Piccadilly Circus",
        "Towards": "Cockfosters",
        "ExpectedArrival": "2020-04-15T15:05:00Z",
        "TimeToLive": "2020-04-15T15:05:00Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:56:15.372Z",
          "Sent": "2020-04-15T14:56:19Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-1620456180",
        "OperationType": 1,
        "VehicleId": "512",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "piccadilly",
        "LineName": "Piccadilly",
        "PlatformName": "Westbound - Platform 5",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHRC",
        "DestinationName": "Heathrow Terminals 2 & 3 Underground Station",
        "Timestamp": "2020-04-15T14:56:19.563053Z",
        "TimeToStation": 761,
        "CurrentLocation": "Left Turnpike Lane",
        "Towards": "Heathrow T123 + 5",
        "ExpectedArrival": "2020-04-15T15:09:00Z",
        "TimeToLive": "2020-04-15T15:09:00Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:56:15.372Z",
          "Sent": "2020-04-15T14:56:19Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-54511199",
        "OperationType": 1,
        "VehicleId": "513",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "piccadilly",
        "LineName": "Piccadilly",
        "PlatformName": "Westbound - Platform 5",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHR4",
        "DestinationName": "Heathrow Terminal 4 Underground Station",
        "Timestamp": "2020-04-15T14:56:19.563053Z",
        "TimeToStation": 1361,
        "CurrentLocation": "Between Southgate and Arnos Grove",
        "Towards": "Heathrow via T4 Loop",
        "ExpectedArrival": "2020-04-15T15:19:00Z",
        "TimeToLive": "2020-04-15T15:19:00Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:56:15.372Z",
          "Sent": "2020-04-15T14:56:19Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "572040390",
        "OperationType": 1,
        "VehicleId": "514",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "piccadilly",
        "LineName": "Piccadilly",
        "PlatformName": "Eastbound - Platform 6",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUCKS",
        "DestinationName": "Cockfosters Underground Station",
        "Timestamp": "2020-04-15T14:56:19.563053Z",
        "TimeToStation": 1421,
        "CurrentLocation": "At Barons Court Platform 3",
        "Towards": "Cockfosters",
        "ExpectedArrival": "2020-04-15T15:20:00Z",
        "TimeToLive": "2020-04-15T15:20:00Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:56:15.372Z",
          "Sent": "2020-04-15T14:56:19Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "572105926",
        "OperationType": 1,
        "VehicleId": "504",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "piccadilly",
        "LineName": "Piccadilly",
        "PlatformName": "Westbound - Platform 5",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHRC",
        "DestinationName": "Heathrow Terminals 2 & 3 Underground Station",
        "Timestamp": "2020-04-15T14:56:19.563053Z",
        "TimeToStation": 1721,
        "CurrentLocation": "Between Cockfosters and Oakwood",
        "Towards": "Heathrow T123 + 5",
        "ExpectedArrival": "2020-04-15T15:25:00Z",
        "TimeToLive": "2020-04-15T15:25:00Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:56:15.372Z",
          "Sent": "2020-04-15T14:56:19Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ],
    "victoria": [
      {
        "Id": "-907744380",
        "OperationType": 1,
        "VehicleId": "012",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "victoria",
        "LineName": "Victoria",
        "PlatformName": "Southbound - Platform 4",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBXN",
        "DestinationName": "Brixton Underground Station",
        "Timestamp": "2020-04-15T14:35:48.2189476Z",
        "TimeToStation": 141,
        "CurrentLocation": "At Highbury & Islington",
        "Towards": "Brixton",
        "ExpectedArrival": "2020-04-15T14:38:09Z",
        "TimeToLive": "2020-04-15T14:38:09Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:35:47.653Z",
          "Sent": "2020-04-15T14:35:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-907547772",
        "OperationType": 1,
        "VehicleId": "002",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "victoria",
        "LineName": "Victoria",
        "PlatformName": "Northbound - Platform 3",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUWWL",
        "DestinationName": "Walthamstow Central Underground Station",
        "Timestamp": "2020-04-15T14:35:48.2189476Z",
        "TimeToStation": 231,
        "CurrentLocation": "Between Warren Street and Oxford Circus",
        "Towards": "Walthamstow Central",
        "ExpectedArrival": "2020-04-15T14:39:39Z",
        "TimeToLive": "2020-04-15T14:39:39Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:35:47.653Z",
          "Sent": "2020-04-15T14:35:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "1822187553",
        "OperationType": 1,
        "VehicleId": "011",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "victoria",
        "LineName": "Victoria",
        "PlatformName": "Southbound - Platform 4",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUBXN",
        "DestinationName": "Brixton Underground Station",
        "Timestamp": "2020-04-15T14:35:48.2189476Z",
        "TimeToStation": 471,
        "CurrentLocation": "At Seven Sisters Platform 5",
        "Towards": "Brixton",
        "ExpectedArrival": "2020-04-15T14:43:39Z",
        "TimeToLive": "2020-04-15T14:43:39Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:35:47.653Z",
          "Sent": "2020-04-15T14:35:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-771934763",
        "OperationType": 1,
        "VehicleId": "005",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "victoria",
        "LineName": "Victoria",
        "PlatformName": "Northbound - Platform 3",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUWWL",
        "DestinationName": "Walthamstow Central Underground Station",
        "Timestamp": "2020-04-15T14:35:48.2189476Z",
        "TimeToStation": 711,
        "CurrentLocation": "At Pimlico",
        "Towards": "Walthamstow Central",
        "ExpectedArrival": "2020-04-15T14:47:39Z",
        "TimeToLive": "2020-04-15T14:47:39Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T14:35:47.653Z",
          "Sent": "2020-04-15T14:35:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ],
    "northern": [
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Northbound - Platform 7",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHBT",
        "DestinationName": "High Barnet Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 336,
        "CurrentLocation": "Between Moorgate and Old Street",
        "Towards": "High Barnet via Bank",
        "ExpectedArrival": "2020-04-15T15:07:30Z",
        "TimeToLive": "2020-04-15T15:07:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Southbound - Platform 8",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUMDN",
        "DestinationName": "Morden Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 396,
        "CurrentLocation": "At Kentish Town Platform 2",
        "Towards": "Morden via Bank",
        "ExpectedArrival": "2020-04-15T15:08:30Z",
        "TimeToLive": "2020-04-15T15:08:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Northbound - Platform 7",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHBT",
        "DestinationName": "High Barnet Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 756,
        "CurrentLocation": "At Borough Platform 1",
        "Towards": "High Barnet via Bank",
        "ExpectedArrival": "2020-04-15T15:14:30Z",
        "TimeToLive": "2020-04-15T15:14:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Southbound - Platform 8",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUMDN",
        "DestinationName": "Morden Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 756,
        "CurrentLocation": "Approaching Highgate Platform 2",
        "Towards": "Morden via Bank",
        "ExpectedArrival": "2020-04-15T15:14:30Z",
        "TimeToLive": "2020-04-15T15:14:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Southbound - Platform 8",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUMDN",
        "DestinationName": "Morden Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 936,
        "CurrentLocation": "Finchley Central Platform 3",
        "Towards": "Morden via Bank",
        "ExpectedArrival": "2020-04-15T15:17:30Z",
        "TimeToLive": "2020-04-15T15:17:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Northbound - Platform 7",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHBT",
        "DestinationName": "High Barnet Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 1056,
        "CurrentLocation": "At Oval Platform 1",
        "Towards": "High Barnet via Bank",
        "ExpectedArrival": "2020-04-15T15:19:30Z",
        "TimeToLive": "2020-04-15T15:19:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Southbound - Platform 8",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUMDN",
        "DestinationName": "Morden Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 1356,
        "CurrentLocation": "Between High Barnet and Totteridge & Whetstone",
        "Towards": "Morden via Bank",
        "ExpectedArrival": "2020-04-15T15:24:30Z",
        "TimeToLive": "2020-04-15T15:24:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Northbound - Platform 7",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHBT",
        "DestinationName": "High Barnet Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 1476,
        "CurrentLocation": "Approaching Clapham Common",
        "Towards": "High Barnet via Bank",
        "ExpectedArrival": "2020-04-15T15:26:30Z",
        "TimeToLive": "2020-04-15T15:26:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "-925908963",
        "OperationType": 1,
        "VehicleId": "000",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "northern",
        "LineName": "Northern",
        "PlatformName": "Northbound - Platform 7",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUHBT",
        "DestinationName": "High Barnet Underground Station",
        "Timestamp": "2020-04-15T15:01:54.5353049Z",
        "TimeToStation": 1776,
        "CurrentLocation": "Between Tooting Bec and Balham",
        "Towards": "High Barnet via Bank",
        "ExpectedArrival": "2020-04-15T15:31:30Z",
        "TimeToLive": "2020-04-15T15:31:30Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:01:48.18Z",
          "Sent": "2020-04-15T15:01:54Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ],
    "metropolitan": [
      {
        "Id": "-2139207054",
        "OperationType": 1,
        "VehicleId": "724",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "metropolitan",
        "LineName": "Metropolitan",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUALD",
        "DestinationName": "Aldgate Underground Station",
        "Timestamp": "2020-04-15T15:02:48.9264804Z",
        "TimeToStation": 466,
        "CurrentLocation": "Between Finchley Road and Baker Street",
        "Towards": "Aldgate",
        "ExpectedArrival": "2020-04-15T15:10:34Z",
        "TimeToLive": "2020-04-15T15:10:34Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:02:44.828Z",
          "Sent": "2020-04-15T15:02:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "1026630564",
        "OperationType": 1,
        "VehicleId": "722",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "metropolitan",
        "LineName": "Metropolitan",
        "PlatformName": "Westbound - Platform 1",
        "Direction": "inbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUUXB",
        "DestinationName": "Uxbridge Underground Station",
        "Timestamp": "2020-04-15T15:02:48.9264804Z",
        "TimeToStation": 526,
        "CurrentLocation": "At Liverpool Street",
        "Towards": "Uxbridge",
        "ExpectedArrival": "2020-04-15T15:11:34Z",
        "TimeToLive": "2020-04-15T15:11:34Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:02:44.828Z",
          "Sent": "2020-04-15T15:02:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      },
      {
        "Id": "623377879",
        "OperationType": 1,
        "VehicleId": "725",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "metropolitan",
        "LineName": "Metropolitan",
        "PlatformName": "Eastbound - Platform 2",
        "Direction": "outbound",
        "Bearing": "",
        "DestinationNaptanId": "940GZZLUALD",
        "DestinationName": "Aldgate Underground Station",
        "Timestamp": "2020-04-15T15:02:48.9264804Z",
        "TimeToStation": 1666,
        "CurrentLocation": "Between Northwick Park and  Preston Road",
        "Towards": "Aldgate",
        "ExpectedArrival": "2020-04-15T15:30:34Z",
        "TimeToLive": "2020-04-15T15:30:34Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T15:02:44.828Z",
          "Sent": "2020-04-15T15:02:48Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ],
    "circle": [
      {
        "Id": "1014721593",
        "OperationType": 1,
        "VehicleId": "776",
        "NaptanId": "940GZZLUKSX",
        "StationName": "King's Cross St. Pancras Underground Station",
        "LineId": "circle",
        "LineName": "Circle",
        "PlatformName": "Westbound - Platform 1",
        "Direction": null,
        "Bearing": "",
        "DestinationNaptanId": null,
        "DestinationName": null,
        "Timestamp": "2020-04-15T09:34:34.5583809Z",
        "TimeToStation": 759,
        "CurrentLocation": "Left Tower Hill",
        "Towards": "Circle Line",
        "ExpectedArrival": "2020-04-15T09:47:13Z",
        "TimeToLive": "2020-04-15T09:47:13Z",
        "ModeName": "tube",
        "Timing": {
          "CountdownServerAdjustment": "00:00:00",
          "Source": "0001-01-01T00:00:00",
          "Insert": "0001-01-01T00:00:00",
          "Read": "2020-04-15T09:34:27.302Z",
          "Sent": "2020-04-15T09:34:34Z",
          "Received": "0001-01-01T00:00:00"
        }
      }
    ]
  }
}