# TowerDefense2
My second attempt at a tower defense game.

## Play the game: [https://candyapplecorn.github.io/TowerDefense2/](https://candyapplecorn.github.io/TowerDefense2/)

![td3-compressed.gif](td3-compressed.gif)

## Pathing

Each tile keeps four bits representing cardinal directions. The bits are set according to whether the adjacent tile in the bit's direction is pathable.

```js
var curr = this._tiles[r][c];
curr.bits &= this.NONE;
if (c != this._cols - 1) // check right
    if (this._tiles[r][c + 1].tower == null)
        curr.bits ^= this.RIGHT;
if (c != 0)             // check left
    if (this._tiles[r][c - 1].tower == null)
        curr.bits ^= this.LEFT;
if (r != 0)             // check top
    if (this._tiles[r - 1][c].tower == null)
        curr.bits ^= this.UP;
if (r != this._rows - 1) // check bottom
    if (this._tiles[r + 1][c].tower == null)
        curr.bits ^= this.DOWN;
```

Tile pathing costs are calculated with a flood fill algorithm that only enqueues tiles in directions of flipped bits. 

## Miscellaneous Notes

~~Hosted at: [http://joeburger.ax.lt/TowerDefense2/]~~

Instead of using TypeScript, I decided to try es6 using Babel: [https://babeljs.io/].   
~~For now I'm using PHP to serve the application~~
*Thanks, GitHub Pages!*

Babel transpiles es6+ javascripts/*js to es5 in lib/.  
Babel is run with "npm run build", and is configured as described in .presets and package.json.
