// import _ from 'lodash';
import SimplexNoise from 'simplex-noise';

let perlin = (seed, x, y) => {
    let simplex = new SimplexNoise(()=>seed);
    
    return simplex.noise2D(x, y);
}

export { 
    perlin
};