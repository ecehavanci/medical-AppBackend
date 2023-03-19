let chai = require("chai");
let chaiHTTP = require("chai-http");
const server = require('../App');
const stdController = require("../controllers/stdController");

chai.should();
chai.use(chaiHTTP);


describe('Student APIs', () => {

    // it("adds 2 numbers", done => {
    //     chai
    //         .request(server)
    //         .get("/all")
    //         .end((err, res) => {
    //             expect(res).to.have.status(200);
    //             expect(res.body.status).to.equals("success");
    //             // expect(res.body.result).to.equals(10);
    //             done();
    //         });
    // });

    describe("Test GET route /all", () => {
        it("It should return all students", (done) => {
            chai.request(server)
                .get("/all")
                .end((err, res) => {
                    // expect(res).to.have.status(200);
                    console.log(res.body);
                    // res.should.have.status(200);
                    // res.body.should.be.a('JSON');
                    res.body.length.should.not.be.eq(0);
                    done();

                });
        });
    }
    ).timeout(10000)
}
);