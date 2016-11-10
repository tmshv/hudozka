import {getPeriod}  from '../../src/models/schedule';

describe('models', () => {
    describe('schedule.js', () => {
        describe('getPeriod', () => {
            it('should accept a string and return an array', () => {
                getPeriod('2016-2017').should.be.Array;
            });

            it('should accept a string "XXXX-YYYY" and return an array [XXXX, YYYY]', () => {
                const sample = '2016-2017';
                const result = getPeriod(sample);
                result.should.be.eql([2016, 2017]);
            });
        });
    });
});