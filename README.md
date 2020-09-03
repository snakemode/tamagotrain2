# Tamagotrain!

A love letter to Tamagotchis, and Tube Trains.

Play out your pixelated platform controller fantasies, as you regulate the temperature of your tube station,
clean up after mucky passengers, charm the music loving mice and dance the night (tube) away.

You're the new Tube controller, and you've got to keep your station in fine fettle.
Don't let your station get too hot, don't let your platform fill up with passengers or trash

* Trains raise the temperature of your station
* As passengers arrive, they also raise the temperature of the station
* If it gets too hot, people will start to faint!
* Unconscious passengers can't leave the platforms.
* Passengers also can be messy.
* Too much mess attracts mice!
* Trash and mice all takes up space at the station.
* If your platforms get too full, your station will crumble!

But don't worry!

* You can vent cold air through the station to keep everyone cool
* Passengers departing through the exit will cool the platforms down a little
* Departing trains cool the platforms slightly too.
* You can charm mice with songs! They'll find their way off the platform if musically enticed
* Music will wake up fainting passengers
* Cleaning up will wash away trash

---

# How the game works

The game is split into two parts - the simulation, which runs in `ticks`, and the `ui` which runs at 30 frames per second.

The timer that calls our `tick` function is commonly called `the game loop` in game programming.
The loop that draws to the screen, is frequently referred to as the `render loop`.

Having the two things run independently of one another prevents us tying the game logic to our frame rate.

## Game.js

The `Game.js` file is the main control loop for the game, inside the `Game` class, there is a function called `tick()` which is called once per second.

This `tick` steps the simulation forward, `tick`ing any `entities` (`src/entities`) applying any effects (`/src/buffs`) or problems (`src/problems`) forward one tick per second.

An instance of the `Game` object holds all the state - and the UI elements pass messages to the `Game` instance for the simulation to handle.
The only input the user can supply is applying a `Buff` - either `Clean`, `Vent`, or `Music` - and these are wired to the buttons in the UI.

These button presses create small messages (just javascript objects) that are pushed onto an internal array in the `Game` instance, that we use as a queue of actions.

When the game ticks, any unprocessed messages in its queue are picked up, **first in, first out** (FIFO), and the game acts appropriately, creating an *instance of the requested buff* and
applying it to the `Platform`.

The `Game` instance is responsible for three core things

* Handling input and train arrival/departure messages, and routing them to the platform
* Creating instances of `Buffs`
* Checking for *game over*

All the rest of the game logic happens in the `tick` functions found on the `entities`, `problems` and `buffs`.

## entities/Platform.js

By default, when an instance of `Game` is created, a `Platform` is created.
This platform has some basic state (an age measured in `ticks`, a `width`, a `height`) along with the three core stats the game is ranked on - `hygiene`, `temperature` and `capacity`.
Combined with it's `contents` array, all the game is won or lost based on the state of these variables, which the game evaluates each tick.

When the `Platform` ticks, the following things happen -

* Any unprocessed messages are read, FIFO.
* If a message for a train arrival or departure is found a train is created on the platform or removed from it.
* All `tickables` are `tick`ed.
* Any completed contents or buffs are removed - an item is deemed complete if a property `completed` is present, and set to true on the object.

The `tickables` that the platform stores are:

* Any present train
* All of the contents of the platform
* All of the buffs applied to the platform

In that order, each of the items present in the platform has it's `tick` method invoked.

On each tick, the thing that is being `ticked` gets handed the current instance of the platform, and based on the logic in that items `class`, it can mutate the properties of the platform.
For instance - every tick, a `Mouse` could reduce the `hygiene` property of our platform.

If any of our `tickables` are deemed complete, and happen to have a function available on them called `onCompletion`, this will be executed before the item is removed from the platforms `contents` array.

## Entities, Buffs and Problems

Entities, Buffs and Problems are all JavaScript classes that can mutate the state of the `Platform` instance in their `tick` method.

* Both `Entities` and `Problems` have `x` and `y` coordinates that are used to move them around the user interface.
* `Problems` all inherit from a `Base Class` called `Problem` which creates these properties by default for them.

A problem looks like this:

```js
class MyRandomProblem extends Problem {
  constructor(x, y) {
    super(x, y);
  }
  
  tick(platform) {   
    // Do something    
    this.ticks++;
  }  

  onCompletion(platform) {
  }
}

module.exports = MyRandomProblem;
```

You can add more problems and logic to spawn them if you like.

There's nothing especially interesting about entities or problems - they just hold state and it is expected they do things during the lifetime of a game.

For example:

* Travellers walk towards the exit by moving 10 pixels closer to the exit each tick
* Travellers have a chance of dropping trash
* Trash has a chance of adding mice to the platform
* Trains add an extra Traveller to the platform every tick

All of this logic exists in the `tick` function of each kind of entity or problem.

## GameUi.js

GameUi is where the rendering happens. It loosely follows an *Observer* pattern.
This is CS jargon for "a piece of code that looks at the state of something else".

30 times a second, we call our GameUI.draw function, passing it a snapshot of the game state.

Internally, the GameUI instance keeps track of the last state it was called with, so it can avoid re-drawing things that haven't changed.

The GameUi class has a collection called `_renderingFunctions` - a list of functions it calls in order, each being passed the current game state.
This is a simple way for us to split out the logic for rendering different kinds of things in the game world.

If any rendering function returns a value of `-1`, we use this as a signal to stop drawing to the screen.
This is used to make sure the game over screen gets displayed and any additional rendering is stopped.

The rendering code isn't too complicated - we have some placeholder *div*s that we're applying some beautiful styling to, and our rendering code adds and removes
elements that are absolutely positioned inside our `Platform` div.

We're doing a few things to make our lives easier here - adding `css classes` and `data attributes` with various properties from our entities and problem objects- this
lets us target those dynamically added divs with CSS to apply animated gif backgrounds, and other styles to the objects.

The `renderContents` function renders most of the entities in the world with the same block of code, just applying their `ids` and `entity-types` as classes and attributes
while our `css` does most of the hard work.

The UI also has special code for making sure trains arrive and leave the platform - where it compares the previous state of the game, and the current state, so if a 
train has arrived or left the platform it can trigger the addition or removal of the appropriate css classes.

## Ending the game

The game failure states are managed in `Game.js` in the function `isGameOver`.

You'll see a collection of objects with functions embedded in them for different failure conditions.
At the start of each tick, each of those functions are run, and if any of them return true, the game is over.

The game then updates it's state to have ended, keeping track of the reason the game has failed.

# Where the train arrival and departure messages come from

- In fake mode, they arrive every 12 seconds, wait 12 seconds, then leave for 12 seconds
- (It's just a timer)

## Ably Realtime TFL data mode

- Real train data!
- We keep track of arrivals to all the platforms at **station name**
- When we detect an arrival we send a train arrived message
- We schedule a departure message for half way to the next train.

# Starting the game

`script.js` is referenced in our HTML, and it takes care of starting our new games.

The `startGame` function does all the work...

```js
async function startGame(useRealData = false) {
  dataSource = useRealData 
                ? new AblyTrainArrivalsClient() 
                : new SimulatedTrainArrivalsClient();
  
  game = new Game();
  ui = new GameUi(game);
  
  game.start({
    onGameStart: async () => await dataSource.listenForEvents("940GZZLUKSX", msg => game.registerEvent(game, msg)),
    onGameEnd: () => dataSource.stopListening()
  });

  ui.startRendering(game);
  
  return game;
}
```

startGame:

* Picks the data source (based on a flag)
* Creates a `game` instance
* Creates an instance of our UI class, passing it a reference to our new `game` instance
* Calls `game.start` passing a configuration object of two actions - one to execute on start, one on end.
** Our start action listens for events on our dataSource - giving us a uniform way to listen to either our fake train arrivals, or Ably's realtime data.
** Our end action disconnects our dataSource to stop us using API calls we don't need.
* The UI `startRendering` function is called that sets up our render loop.

Finally the game is returned so that our UI buttons work in the browser.