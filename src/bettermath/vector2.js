// import _ from 'lodash';

export default class Vector2 {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        let { x, y } = this;
        return Math.sqrt((x * x) + (y * y));
    }

    // normalize should return a vector2 of magnitude 1 in the same direction
    // as this vector2
    normalize() {
        let inv = 1 / this.magnitude;
        if(this.magnitude === 0 || this.magnitude === 1) {
            return this;
        }
        return new Vector2(this.x * inv, this.y * inv);
    }

    // makes this vector @scale times longer
    magnify(scale) {
        return new Vector2(this.x * scale, this.y * scale);
    }

    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }
}