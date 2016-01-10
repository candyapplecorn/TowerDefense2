
class Tile {
    constructor(row, col, maph = 0, mapw = 0) {
        this._row = row, this._col = col;
        this._next = null, this._prev = null;
        this._bits = 0, this._pathValue = 0;
        this._position = new Position();
        this._checked = false;
        this._tower = null;
        if (mapw && maph) this.calcCenter(maph, mapw);
    };
    get position(){ return this._position; };
    get checked(){ return this._checked; };
    set checked(r = true){ this._checked = r; };
    get row(){ return this._row; };
    set row(r){ this._row = r; };
    get tower(){ return this._tower; }; 
    set tower(r){ this._tower = r; }; // might want to actually write some code here
    get col(){ return this._col; };
    set col(r){ this._col = r; };
    get next(){ return this._next; };
    set next(r){ this._next = r; };
    get prev(){ return this._prev; };
    set prev(r){ this._prev = r; };
    get bits(){ return this._bits; };
    set bits(r){ this._bits = r; };
    get pathValue(){ return this._pathValue; };
    set pathValue(r){ this._pathValue = r; };
    calcCenter(pixelh, pixelw) { // expects mapwidth / cols
        this._position.x = this._col * pixelw + pixelw / 2;
        this._position.y = this._row * pixelh + pixelh / 2;
    };
}
class Map {
    constructor(rows = 10, cols = 10, maph = 400, mapw = 400, begin = null, end = null) {
        this._tiles = [];
        this._rows = rows, this._cols = cols, this._maph = maph, this._mapw = mapw;
        this.UP = 8, this.RIGHT = 4, this.DOWN = 2, this.LEFT = 1, 
                  this.ALL = 15, this.NONE = 0;
        for (var r = 0; r < rows; r++) {
            this._tiles[r] = new Array(cols);
            for (var c = 0; c < cols; c++)
                this._tiles[r][c] = new Tile(r, c, maph / rows, mapw / cols);
        }
        if (begin)  this._begin = this._tiles[begin.row][begin.col];
        else        this._begin = this._tiles[0][0];
        if (end)    this._end = this._tiles[end.row][end.col];
        else        this._end = this._tiles[rows - 1][cols - 1];
    };
    get tiles(){ return this._tiles; };
    set begin(b){ this._begin = b; };
    get begin(){ return this._begin; };
    set cols(b){ this._cols = b; };
    get cols(){ return this._cols; };
    set rows(b){ this._rows = b; };
    get rows(){ return this._rows; };
    set end(b){ this._end = b; };
    get end(){ return this._end; };
    get towers() { 
        return this._tiles.reduce((a, b)=>{return a.concat(b);}).filter(x=>x.tower).map(x=>x.tower); 
    };
    insertTower(row, col, tower) {
        this._tiles[row][col].tower = tower;
        if (!this.calculatePathing()){
            this._tiles[row][col].tower = null;
            return false;
        }
        return true;
    }
    calcdirections(){
       for (var r = 0; r < this._rows; r++)
       for (var c = 0; c < this._cols; c++) {
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
       }
    };
    calcpathcosts(begin = this._begin, end = this._end, tiles = this._tiles) {
        for (var tile of this._tiles.reduce((a, b) => { return a.concat(b); }))
            tile._pathValue = 9999, tile.checked = false;
        tiles[end.row][end.col]._pathValue = 0;
        var queue = [tiles[end.row][end.col]], diag = Math.sqrt(2);
        var enqueue = (curr, testing, queue, cost) => {
            if (!testing.tower) 
                testing.pathValue = testing.pathValue < curr.pathValue + cost ? 
                testing.pathValue : curr.pathValue + cost;
            if (!testing.checked && !testing.tower) queue.push(testing);
        };
        while (queue.length) {
            var curr = queue.pop();
            curr.checked = true;
            if (curr.bits & this.RIGHT)
                enqueue(curr, this._tiles[curr._row][curr._col + 1], queue, 1);
            if (curr.bits & this.LEFT) 
                enqueue(curr, this._tiles[curr._row][curr._col - 1], queue, 1);
            if (curr.bits & this.UP)
                enqueue(curr, this._tiles[curr._row - 1][curr._col], queue, 1);
            if (curr.bits & this.DOWN)
                enqueue(curr, this._tiles[curr._row + 1][curr._col], queue, 1);
            // Now, calculate diagonal costs
            if (curr.bits & this.UP && curr.bits & this.LEFT)
                enqueue(curr, this._tiles[curr._row - 1][curr._col - 1], queue, diag);
            if (curr.bits & this.UP && curr.bits & this.RIGHT)
                enqueue(curr, this._tiles[curr._row - 1][curr._col + 1], queue, diag);
            if (curr.bits & this.DOWN && curr.bits & this.RIGHT)
                enqueue(curr, this._tiles[curr._row + 1][curr._col + 1], queue, diag);
            if (curr.bits & this.DOWN && curr.bits & this.LEFT)
                enqueue(curr, this._tiles[curr._row + 1][curr._col - 1], queue, diag);
        }
    };
    link() {
        for (var tile of this._tiles.reduce((a, b) => { return a.concat(b); })) {
            var lowestPV = 9999, coords = {row: 0, col: 0};
            // Find the coordinates with the lowest path value 
            for (var r = -1; r <= 1; r++)
                for (var c = -1; c <= 1; c++) {
                    if (!r && !c) continue; // Don't check self against self
                    var rowindex = tile._row + r, colindex = tile._col + c, currPV;
                    if (rowindex >= 0 && rowindex < this._rows &&
                        colindex >= 0 && colindex < this._cols)
                        currPV = this._tiles[rowindex][colindex]._pathValue;
                    else continue; // don't reference a null value
                    if ((r == c || r + c == 0) && 
                        this._tiles[tile._row][tile._col + c].tower != null || 
                        this._tiles[tile._row + r][tile._col].tower != null)
                            continue; //skip if diagonal and would cut corners
                    if (currPV < lowestPV)
                        lowestPV = currPV,
                        coords = {row: rowindex, col: colindex};
                }
            tile._prev = this._tiles[coords.row][coords.col]; // works.
            this._tiles[coords.row][coords.col]._next = tile; // broken?
        }
    };
    /*
        calculatePathing:
        Step one - assign bitmap values to each tile
        Step two - calculate the distance costs for each tile
        Step three - for each tile, assign prev and next
        End result - every tile (Except last one?) has a previous pointer,
        which will point to another tile. These previous pointers
        lead to the end.
     */
    calculatePathing() {
        this.calcdirections();
        this.calcpathcosts();
        this.link();
        if (this.begin.prev.pathValue == 9999)
            return false;
        return true;
    };
}
