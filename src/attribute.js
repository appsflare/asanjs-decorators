(function () {
    var attributeHandler = function (target, key, descriptor, options) {
        descriptor.writable = false;
        let val = {...descriptor,
            value: {
                attribute: options
            }
        };

        if (target._class) {
            target._class.accessors[key] = val.value;
        }

        target.___metadata = target.___metadata || {};
        target.___metadata[key] = {
            type: 'accessors',
            value: val.value
        };

        return val;
    };

    export function attribute(options) {
        return function () {
            return attributeHandler(...arguments, options);
        };
    }
})();
