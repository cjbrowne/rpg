# RPG

A simple browser-based role-playing game with a twist:
The player cannot control their character directly.  They
can only write JavaScript code in order to play the game.

# API

The expression the user types must evaluate to a function, which
will be executed every "turn".  The function takes two arguments:
game - an API that allows you to control the game
timestamp - a high-resolution timestamp

## Game object
game.movePlayer(x, y): move the player by the delta x, y (e.g -1, 1 will move one tile left and one tile down).

