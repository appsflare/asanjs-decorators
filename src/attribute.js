(function () {
    var attributeHandler = function (target, key, descriptor, options) {
        //descriptor.writable = false;

        options['get'] = function () {
            return descriptor['get'].apply(this.controller, arguments);
        };
        options['set'] = function (val) {
            descriptor['set'].apply(this.controller, arguments);
        };

        let val = {...descriptor, ...options
        };



        target.___metadata = target.___metadata || {};
        target.___metadata[key] = {
            type: 'accessors',
            value: {
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
