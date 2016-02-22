import should from 'should';
import {translateAnItem}  from '../../src/utils/common';

describe('utils', () => {
    describe('common.js', () => {
        describe('translateAnItem', () => {
            let sample = [[1235, 'hello'], [2352, 'banana']];

            it('should return a function', () => {
                let fn = translateAnItem();
                fn.should.be.type('function');
            });

            it('should accept a function as a first parameter and use it as byCondition', () => {
                let fn = translateAnItem(
                    i => i[0] === 2352 && i[1] === 'banana' && i.length === 2,
                    i => i[1]
                );

                let result = sample.reduce(fn);
                result.should.be.equal('banana');
            });

            it('should accept a function as a second parameter and use it as mapping function', () => {
                let fn = translateAnItem(
                    i => i[0] === 2352,
                    i => i[1]
                );

                let result = sample.reduce(fn);
                result.should.be.equal('banana');
            });
        });
    });
});