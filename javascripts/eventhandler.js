/*
 *  Event handling class(es)
 */
class MouseHandler {
    constructor(canvas, listener = null){ 
        this._mouse = {x: 0, y: 0, state: 0}; // state: 0 up 1 down
        this._canvas = canvas;
        this._rect;
        this.init(canvas);
        this._listeners = []; 
        if (listener) this.registerListener(listener);
    };
    registerListener(listener) { this._listeners.push(listener); };
    removeListener(listener) {
        this._listeners = this._listeners.filter(x => x != listener); };
    emit() {
        for (var listener of this._listeners)
            listener.onclick(this.mouseratio);
    };
    _updateMousePosition(e){
        this._rect = this._canvas.getBoundingClientRect(),
        this._mouse.x = (e.clientX-this._rect.left) / 
            (this._rect.right-this._rect.left)*this._canvas.width,
        this._mouse.y = (e.clientY-this._rect.top) / 
            (this._rect.bottom-this._rect.top)*this._canvas.height; };
    get mouse() { 
        return this._mouse; };
    get mouseratio() {
        return {
            x: this._mouse.x / this._canvas.width,
            y: this._mouse.y / this._canvas.width,
            state: this._mouse.state }; };
    init(canvas) {
        $('canvas')
        .on('click',     (e) => { 
            this._mouse.state = 0;
            this._updateMousePosition(e);
            this.emit();
        })
        .on('mousedown', (e) => { 
            this._mouse.state = 1;
            this._updateMousePosition(e);
            this.emit();
        })
        .on('mouseup',   (e) => { 
            this._mouse.state = 0;
            this._updateMousePosition(e);
            this.emit();
        })
        .on('mousemove', (e) => { 
            this._updateMousePosition(e);
            this.emit();
        }); };
}
