(function () {
    var attributeHandler = function (target, key, descriptor, options) {
        descriptor.writable = false;
        let val = {...descriptor,
            'get': function () {
                if (!this.controller)
                    return;
                return descriptor['get'].apply(this.controller, arguments);
            },
            'set': function (val) {
                if (!this.controller)
                    return;
                 descriptor['set'].apply(this.controller, arguments);
            }
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
