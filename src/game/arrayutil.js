import _ from 'lodash';

let generate2d = (width, height, generator) => {
    return _.map(_.range(width), (x) => {
        return _.map(_.range(height), (y) => {
            return generator(x, y);
        });
    });
}

let crop = (array, originX, originY, width = 16, height = 16) => {
    let newArr = [];
    for(let x = originX, newX=0; x < originX + width; x++,newX++) {
        newArr[newX] = [];
        for(let y = originY, newY=0; y < originY + width; y++, newY++) {
            newArr[newX][newY] = (array[x] && array[x][y]) || undefined;
        }
    }
    return newArr;
}

export {
    generate2d,
    crop
};