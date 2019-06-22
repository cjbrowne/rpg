import _ from 'lodash';
import SimplexNoise from 'simplex-noise';

let perlin = (seed, x, y) => {
    let simplex = new SimplexNoise(()=>seed);
    
    return simplex.noise2D(x, y);
}

let randInt = (min = 0, max = Number.MAX_SAFE_INTEGER) => {
    let fl = Math.random();
    return Math.floor(fl * (max - min)) + min;
}

let generateEnemyName = () => {
    let nameRoots = [
        "Flarg",
        "Blarg",
        "Frag",
        "Blig"
    ];
    let nameSuffixes = [
        "ebly",
        "le",
        ""
    ];
    let surnamePrefixes = [
        "O'",
        "Mc",
        "Mac",
        ""
    ];

    let forename = _.sample(nameRoots) + _.sample(nameSuffixes);
    let surname = _.sample(surnamePrefixes) + _.sample(nameRoots) + _.sample(nameSuffixes);
    return `${forename} ${surname}`;
}

export { 
    perlin,
    randInt,
    generateEnemyName
};