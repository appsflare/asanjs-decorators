import {Registry} from 'asanjs-registry';
import {decorate} from './utils';


(function () {

    let queues = {};
    let addToExecQ = function (key, method) {
        if (!queues.hasOwnProperty(key)) {
            queues[key] = [];
        }
        queues[key].push(method);
    };

    let handleCustomElementDescriptor = function (target, [tagName, opts = {}]) {

        let options = {
            //content:'',
            accessors: {},
            methods: {},
            lifecycle: {},
            events: {}
        };

        if (opts.extendsFrom !== undefined) {
            options['extends'] = opts.extendsFrom;
        }

        if (opts.template !== undefined) {
            options.template = opts.template;
        }

        if (target.prototype.___metadata) {

            for (var key in target.prototype.___metadata) {
                var metadata = target.prototype.___metadata[key];

                if (!metadata) continue;
                switch (key) {
                case 'lifecycle':
                    options[metadata.type][key] = metadata.value;
                    break;
                default:
                    options[metadata.type][key] = metadata.value;
                    break;
                }

            }

            //delete metadata once the exported options by method decorators are collected
            delete target.prototype.___metadata;
        }
        return Registry.register(tagName, target, options);
    };



    export function customElement() {
        return decorate(handleCustomElementDescriptor, arguments);
    };
})();
