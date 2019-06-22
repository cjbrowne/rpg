// import _ from 'lodash';
import SimplexNoise from 'simplex-noise';

let perlin = (seed, x, y) => {
    let simplex = new SimplexNoise(()=>seed);
    
    return simplex.noise2D(x, y);
}

let randInt = (min = 0, max = Number.MAX_SAFE_INTEGER) => {
    let fl = Math.random();
    return Math.floor(fl * (max - min)) + min;
}

export { 
    perlin,
    randInt
};