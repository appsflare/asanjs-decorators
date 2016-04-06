'use strict';

System.register(['asanjs-registry'], function (_export, _context) {
    var Registry, _extends, accessorHandler, attributeHandler, queues, addToExecQ, handleCustomElementDescriptor, DEFAULT_MSG, handleEventHandlerDescriptor, handleLifeCycleEventHandlerDescriptor, handleMethodDescriptor;

    function handleDepricateDescriptor(target, key, descriptor, _ref3) {
        var _ref3$ = _ref3[0];
        var msg = _ref3$ === undefined ? DEFAULT_MSG : _ref3$;
        var _ref3$2 = _ref3[1];
        var options = _ref3$2 === undefined ? {} : _ref3$2;

        if (typeof descriptor.value !== 'function') {
            throw new SyntaxError('Only functions can be marked as deprecated');
        }

        var methodSignature = target.constructor.name + '#' + key;

        if (options.url) {
            msg += '\n\n    See ' + options.url + ' for more details.\n\n';
        }

        return _extends({}, descriptor, {
            value: function deprecationWrapper() {
                console.warn('DEPRECATION ' + methodSignature + ': ' + msg);
                return descriptor.value.apply(this, arguments);
            }
        });
    }

    return {
        setters: [function (_asanjsRegistry) {
            Registry = _asanjsRegistry.Registry;
        }],
        execute: function () {
            _extends = Object.assign || function (target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];

                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }

                return target;
            };

            function isDescriptor(desc) {
                if (!desc || !desc.hasOwnProperty) {
                    return false;
                }

                var keys = ['value', 'get', 'set'];

                for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var key = _ref;

                    if (desc.hasOwnProperty(key)) {
                        return true;
                    }
                }

                return false;
            }

            _export('isDescriptor', isDescriptor);

            function decorate(handleDescriptor, entryArgs) {
                if (isDescriptor(entryArgs[entryArgs.length - 1])) {
                    return handleDescriptor.apply(undefined, entryArgs.concat([[]]));
                } else {
                    return function () {
                        return handleDescriptor.apply(undefined, Array.prototype.slice.call(arguments).concat([entryArgs]));
                    };
                }
            }

            _export('decorate', decorate);

            accessorHandler = function accessorHandler(target, key, descriptor, options) {
                return _extends({}, descriptor, {
                    value: function value() {}
                });
            };

            function accessor(options) {
                return accessorHandler.apply(undefined, Array.prototype.slice.call(arguments).concat([options]));
            }

            _export('accessor', accessor);

            attributeHandler = function attributeHandler(target, key, descriptor, options) {

                var interceptors = {};

                options = Object.assign({
                    key: key
                }, options || {});

                interceptors['get'] = function () {
                    if (!this.controller) return options && options.defaultValue;
                    return descriptor['get'].apply(this.controller, arguments);
                };
                interceptors['set'] = function (val) {
                    if (!this.controller) return;
                    descriptor['set'].apply(this.controller, arguments);
                };

                var val = _extends({}, descriptor, interceptors);

                target.___metadata = target.___metadata || {};
                target.___metadata[key] = {
                    type: 'accessors',
                    value: _extends({}, interceptors, {
                        attribute: options
                    })
                };

                return val;
            };

            function attribute(options) {
                return function () {
                    return attributeHandler.apply(undefined, Array.prototype.slice.call(arguments).concat([options]));
                };
            }

            _export('attribute', attribute);

            queues = {};

            addToExecQ = function addToExecQ(key, method) {
                if (!queues.hasOwnProperty(key)) {
                    queues[key] = [];
                }
                queues[key].push(method);
            };

            handleCustomElementDescriptor = function handleCustomElementDescriptor(target, _ref2) {
                var tagName = _ref2[0];
                var _ref2$ = _ref2[1];
                var opts = _ref2$ === undefined ? {} : _ref2$;


                var options = {
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

                    delete target.prototype.___metadata;
                }
                return Registry.register(tagName, target, options);
            };

            function customElement() {
                return decorate(handleCustomElementDescriptor, arguments);
            }
            _export('customElement', customElement);

            ;

            DEFAULT_MSG = 'This function will be removed in future versions.';
            function deprecate() {
                return decorate(handleDepricateDescriptor, arguments);
            }

            _export('deprecate', deprecate);

            handleEventHandlerDescriptor = function handleEventHandlerDescriptor(target, key, descriptor, _ref4) {
                var event = _ref4[0];


                function valueHandler(e) {
                    var controller = this.controller;

                    if (e && e.currentTarget && event.indexOf('delegate(') > -1) controller = e.currentTarget.controller;

                    if (!controller) return;
                    return descriptor.value.apply(controller, arguments);
                };

                target.___metadata = target.___metadata || {};
                target.___metadata[event] = { type: 'events', value: valueHandler };

                return _extends({}, descriptor, {
                    value: valueHandler
                });
            };

            function eventHandler() {
                return decorate(handleEventHandlerDescriptor, arguments);
            }

            _export('eventHandler', eventHandler);

            handleLifeCycleEventHandlerDescriptor = function handleLifeCycleEventHandlerDescriptor(target, key, descriptor, _ref5) {
                var event = _ref5[0];


                function valueHandler() {
                    if (!this.controller) return;
                    return descriptor.value.apply(this.controller, arguments);
                };

                target.___metadata = target.___metadata || {};
                target.___metadata[event] = {
                    type: 'lifecycle',
                    value: valueHandler
                };

                return _extends({}, descriptor, {
                    value: valueHandler
                });
            };

            function lifeCycleEventHandler() {
                return decorate(handleLifeCycleEventHandlerDescriptor, arguments);
            }

            _export('lifeCycleEventHandler', lifeCycleEventHandler);

            handleMethodDescriptor = function handleMethodDescriptor(target, key, descriptor) {

                function valueHandler() {
                    if (!this.controller) return;
                    return descriptor.value.apply(this.controller, arguments);
                };

                target.___metadata = target.___metadata || {};
                target.___metadata[key] = { type: 'methods', value: valueHandler };

                return _extends({}, descriptor, {
                    value: valueHandler
                });
            };

            function method() {
                return decorate(handleMethodDescriptor, arguments);
            }

            _export('method', method);
        }
    };
});