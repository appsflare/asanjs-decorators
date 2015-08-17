(function () {
    var attributeHandler = function (target, key, descriptor, options) {
        let val = {...descriptor,
            value: {
                attribute: options
            }
        };

        if (target._class) {
            target._class.accessors[key] = val.value;
        }

        return val;
    };

    export function attribute(options) {
        return function () {
            return attributeHandler(...arguments, options);
        };
    }
})();
