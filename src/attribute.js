(function () {
    var attributeHandler = function (target, key, descriptor, options) {
        //descriptor.writable = false;

        let interceptors = {};
        interceptors['get'] = function () {
            return descriptor['get'].apply(this.controller, arguments);
        };
        interceptors['set'] = function (val) {
            descriptor['set'].apply(this.controller, arguments);
        };

        let val = {...descriptor, ...interceptors
        };



        target.___metadata = target.___metadata || {};
        target.___metadata[key] = {
            type: 'accessors',
            value: {
                ...interceptors,
                attribute: options
            }
        };

        return val;
    };

    export function attribute(options) {
        return function () {
            return attributeHandler(...arguments, options);
        };
    }
})();
