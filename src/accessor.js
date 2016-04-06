
var accessorHandler = function (target, key, descriptor, options) {
    return {...descriptor,
        value: function () {

        }
    };
};

export function accessor(options) {
    return accessorHandler(...arguments, options);
}

