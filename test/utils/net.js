import should from 'should';
import {query}  from '../../src/utils/net';

describe('utils', () => {
    describe('net.js', () => {
        describe('query', () => {
            let sample = [['count', 10], ['portion', 5], ['hello', 'lol']];

            it('should combine query params', () => {
                let params = query(sample);
                params.should.be.equal('count=10&portion=5&hello=lol');
            });

            it('should return string', () => {
                let params = query(sample);

                params.should.be.type('string');
            });
        });
    });
});