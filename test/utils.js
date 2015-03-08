/**
 * Created by tmshv on 08/03/15.
 */

var should = require("should");

describe("utils", function () {
    describe("net.js", function () {
        describe("query", function () {
            var query = require("../utils/net").query;
            var sample = [["count", 10], ["portion", 5], ["hello", "lol"]];

            it("should combine query params", function () {
                var params = query(sample);
                params.should.be.equal("count=10&portion=5&hello=lol");
            });

            it("should return string", function () {
                var params = query(sample);

                params.should.be.type("string");
            });
        });
    });
});