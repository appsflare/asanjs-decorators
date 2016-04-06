import { decorate } from './utils';

let handleLifeCycleEventHandlerDescriptor = function (target, key, descriptor, [event]) {

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
    return decorate(handleLifeCycleEventHandlerDescriptor, arguments);
}


