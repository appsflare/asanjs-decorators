import { decorate } from './utils';

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

