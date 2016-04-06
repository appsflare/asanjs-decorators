import { decorate } from './utils';

let handleEventHandlerDescriptor = function(target, key, descriptor, [event]) {

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
    return decorate(handleEventHandlerDescriptor, arguments);
}

