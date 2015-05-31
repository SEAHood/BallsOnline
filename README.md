# BallsOnline

###The #1 Massively Multiplayer Online Ball-related game of Q2 2015

####Current Issues:
- Ball clips through terrain at places - sometimes falls right through
  - Something to do with the heightmap resolution + vertex count + perhaps a smoothing algorithm?
- Shadows are a problem, need shadow camera to be orthographic(?); shadowmap doesn't cover whole scene
- ~~Clients leaving under certain conditions will not remove ball from other clients screen - not sure the reason~~
- ~~Clients will sometimes remove the wrong ball on another clients disconnect - not sure the reason~~


####To Do:
- Overhaul code
  - Standardise IO communications
  - Modularise code
  - Create proper RequireJS hierarchy
- Make suggestion site
- Get some DB integration on the go (MongoDB?)
  - Create account?
  - Launcher page?
  - etc.
- Add fruit (slippable bananananas)
- Add cactuses's
- Class architecture and flow need to be ironed out
- ~~Create large terrain to navigate~~
- Usernames - move away from guid as much as possible (implemented temporary workaround)
- ~~Persistence model needs a bit of an overhaul~~
- ~~Integrate with Physijs (http://chandlerprall.github.io/Physijs/)~~
  - ~~Collision detection (Physijs)~~
  - ~~Gravity (Physijs)~~
  - ~~Friction (Physijs)~~
- ~~Add jumping~~
- ~~Implement TypeScript version for modularity~~
