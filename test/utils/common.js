import should from 'should';
import {select}  from '../../src/utils/common';

describe('utils', () => {
    describe('common.js', () => {
        describe('selectItem', () => {
            it('should return a function', () => {
                let fn = select();
                fn.should.be.type('function');
            });

            it('should accept a function as a first parameter and use it as byCondition', () => {
                let sample = [[1235, 'hello'], [2352, 'banana']];

                let fn = select(
                    i => i[0] === 2352 && i[1] === 'banana' && i.length === 2,
                    i => i[1]
                );

                let result = sample.reduce(fn);
                result.should.be.equal('banana');
            });

            it('should accept a function as a second parameter and use it as mapping function', () => {
                let sample = [[1235, 'hello'], [2352, 'banana']];

                let fn = select(
                    i => i[0] === 2352,
                    i => i[1]
                );

                let result = sample.reduce(fn);
                result.should.be.equal('banana');
            });

            it('should pass with one parameter', () => {
                let sample = ['hello', 'lol', 'banana'];

                let result = sample.reduce(select(i => i === 'banana'));
                result.should.be.equal('banana');
            });

            it('should get a null in reduce result if reduce calls with second parameter that is null', () => {
                let sample = ['hello', 'lol', 'banana'];

                let result = sample.reduce(select(i => i === 'apple'), null);
                should.not.exist(result);
            });
        });
    });
});