import {Registry} from 'asanjs-registry';

export function isDescriptor(desc) {
  if (!desc || !desc.hasOwnProperty) {
    return false;
  }

  const keys = ['value', 'get', 'set'];

  for (const key of keys) {
    if (desc.hasOwnProperty(key)) {
      return true;
    }
  }

  return false;
}

export function decorate(handleDescriptor, entryArgs) {
  if (isDescriptor(entryArgs[entryArgs.length - 1])) {
    return handleDescriptor(...entryArgs, []);
  } else {
    return function () {
      return handleDescriptor(...arguments, entryArgs);
    };
  }
}

(function () {
    var accessorHandler = function (target, key, descriptor, options) {
        return {...descriptor,
            value: function () {

            }
        };
    };

    export function accessor(options) {
        return accessorHandler(...arguments, options);
    }
})();

(function () {
    var attributeHandler = function (target, key, descriptor, options) {
        //descriptor.writable = false;

        let interceptors = {};
        interceptors['get'] = function () {
            if(!this.controller) return options.defaultValue;
            return descriptor['get'].apply(this.controller, arguments);
        };
        interceptors['set'] = function (val) {
            if(!this.controller) return;
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

        if (!target.prototype.___metadata) return;



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
        return Registry.register(tagName, target, options);
    };



    export function customElement() {
        return decorate(handleCustomElementDescriptor, arguments);
    };
})();

(function(){
const DEFAULT_MSG = 'This function will be removed in future versions.';

function handleDepricateDescriptor(target, key, descriptor, [msg = DEFAULT_MSG, options = {}]) {
    if (typeof descriptor.value !== 'function') {
        throw new SyntaxError('Only functions can be marked as deprecated');
    }

    const methodSignature = `${target.constructor.name}#${key}`;

    if (options.url) {
        msg += `\n\n    See ${options.url} for more details.\n\n`;
    }

    return {
        ...descriptor,
        value: function deprecationWrapper() {
            console.warn(`DEPRECATION ${methodSignature}: ${msg}`);
            return descriptor.value.apply(this, arguments);
        }
    };
}

export function deprecate() {
    return decorate(handleDepricateDescriptor, arguments);
}
})();

(function(){
    let handleDescriptor = function(target, key, descriptor, [event]) {

    function valueHandler(e){
      let controller = this.controller;

      if(e && e.currentTarget && event.indexOf('delegate(')>-1)
      controller = e.currentTarget.controller;

       if(!controller) return;
      return descriptor.value.apply(controller, arguments);
    };

      target.___metadata = target.___metadata || {};
      target.___metadata[event] = { type: 'events', value: valueHandler};

      return {...descriptor,
        value:  valueHandler
      };
    };

    export function eventHandler() {
        return decorate(handleDescriptor, arguments);
    }
})();

(function () {

    let handleDescriptor = function (target, key, descriptor, [event]) {

        function valueHandler() {
            if (!this.controller) return;
            return descriptor.value.apply(this.controller, arguments);
        };

        target.___metadata = target.___metadata || {};
        target.___metadata[event] = {
            type: 'lifecycle',
            value: valueHandler
        };

        return {...descriptor,
            value: valueHandler
        };
    };

    export function lifeCycleEventHandler() {
        return decorate(handleDescriptor, arguments);
    }

})();


(function(){
    let handleDescriptor = function(target,key, descriptor) {

    function valueHandler(){
      if(!this.controller)return;
      return descriptor.value.apply(this.controller, arguments);
    };

      target.___metadata = target.___metadata || {};
      target.___metadata[key] = { type: 'methods', value: valueHandler};

      return {...descriptor,
        value:  valueHandler
      };
    };

    export function method() {
        return decorate(handleDescriptor, arguments);
    }
})();
