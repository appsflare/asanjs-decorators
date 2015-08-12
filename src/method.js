
import { decorate } from './utils';

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
