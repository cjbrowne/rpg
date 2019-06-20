import _ from 'lodash';

let generate2d = (width, height, generator) => {
    return _.map(_.range(width), (x) => {
        return _.map(_.range(height), (y) => {
            return generator(x, y);
        });
    });
}

export {
    generate2d
};