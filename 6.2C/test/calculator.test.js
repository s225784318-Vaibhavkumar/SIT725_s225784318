const app = require("../sever");
const { calculateSum } = require("../calculator");

let expect;
let server;
let baseUrl;

before(async () => {
  expect = (await import("chai")).expect;

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after((done) => {
  server.close(done);
});

describe("Calculation Test", () => {
  it("should calculate the sum correctly for valid numbers", () => {
    const result = calculateSum(10, 20);

    expect(result).to.equal(30);
  });

  it("should reject invalid number input", () => {
    expect(() => calculateSum("abc", 20)).to.throw(TypeError);
  });

  it("should handle zero as an edge case", () => {
    const result = calculateSum(0, 0);

    expect(result).to.equal(0);
  });
});

describe("REST API Test", () => {
  it("should return the sum from GET /api/add", async () => {
    const response = await fetch(`${baseUrl}/api/add?a=5&b=7`);
    const body = await response.json();

    expect(response.status).to.equal(200);
    expect(body.result).to.equal(12);
  });
});
