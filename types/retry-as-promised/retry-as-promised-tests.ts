import retry = require('retry-as-promised');

interface Product {
    name: string;
}
declare abstract class BaseError extends Error {
    constructor(message?: string);
}
declare class TestError extends BaseError {
    /** The specific error which triggered this one */
    parent: Error;
    original: Error;
    constructor(parent: Error);
}

const log = (...args: any[]): void => {};

retry(() => Promise.resolve(), {});
retry(() => Promise.reject('Error matching values'), {});
retry(() => Promise.reject(new Error('No matching values')), {});
retry(() => Promise.resolve(), {
    max: 100,
    timeout: 60000,
    match: ['Error matching values', new Error('No matching values'), new RegExp(/Deadlock/, 'i'), () => {}, TestError],
    backoffBase: 100,
    backoffExponent: 1.1,
    name: 'Source',
    report: (message, options) => {
        if (options.name === 'Source') {
            log(options.name);
            log('iteration', options.$current);
        }
    },
});
retry<Product>(() => Promise.resolve({ name: 'test' }), {});
retry<Product>(() => Promise.reject(new Error('No matching product')), {});
