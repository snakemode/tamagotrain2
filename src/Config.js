module.exports = {
  game: {
    ticksPerSecond: 1,
    fps: 30,
    actionQueueCap: 3,
    failureConditions: {
      tooHot: 60,
      tooCold: -20,
      tooDirty: 0,
    }
  },
  
  
  buffs: {
    
    clean: {
      buffLengthInTicks: 5,
      hygieneChangePerTick: 2.5,
    },
    
    music: {
      buffLengthInTicks: 4
    },
    
    vent: {    
      buffLengthInTicks: 5,
      temperatureChangePerTick: -1,
      hygieneChangePerTick: 0.2
    }
  },
  
  
  entities: {
    
    platform: {
      startValues: {
        capacity: 60,
        temperature: 15,
        hygiene: 100
      },
      hygieneCap: 100,
      hygieneFloor: 0
    },
    
    train: {
      temperatureChangePerTick: 0.25,
      doorsCloseAtTick: 8,
      spawnPassengersFromTick: 2,
      spawnPassengersPerTick: 1
    },
    
    traveller: {
      startValues: {
        ticksFromExit: 14
      },
      temperatureChangePerTick: 0.1,
      temperatureChangeOnCompletion: -1,
      stepSize: 15,
      dropTrashPercentageChance: 5,
      chanceOfPassingOutWhenHygieneLessThan: 30,
      passOutPercentageChance: 10
    }
    
  },
  
  
  problems: {
    
    mouse: {
      stepSize: 10,
      leavesWhenHygieneIsAbove: 80,
      leavesWhenTemperatureIsBelow: 0,
      hygieneChangeWhenMouseLeaves: 5
    },
        
    trash: {
      hygieneChangePerTick: -0.25,
      chanceOfMouseWhenLessThanHygiene: 80,
      chanceOfMousePercent: 10
    },
        
    heat: {
      heatOverlayDisplaysAt: 35
    }
    
  }
};