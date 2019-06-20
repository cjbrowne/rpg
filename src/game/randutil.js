// import _ from 'lodash';
import SimplexNoise from 'simplex-noise';

let simplex = new SimplexNoise(Math.random);

let perlin = simplex.noise2D.bind(simplex);

export { 
    perlin
};