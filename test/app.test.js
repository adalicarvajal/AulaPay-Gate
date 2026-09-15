const assert = require("node:assert/strict");
const test = require("node:test");
const http = require("node:http");
const app = require("../app");

let server;
let baseUrl;

test.before(() => {
  server = http.createServer(app);
  return new Promise(resolve => {
    server.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(() => new Promise((resolve, reject) => {
  server.close(error => error ? reject(error) : resolve());
}));

async function request(path, studentId) {
  const headers = studentId ? { "X-Student-Id": String(studentId) } : {};
  const response = await fetch(`${baseUrl}${path}`, { headers });
  return { status: response.status, body: await response.json() };
}

test("rechaza solicitudes sin autenticacion", async () => {
  const response = await request("/api/payments/1024");

  assert.equal(response.status, 401);
  assert.equal(response.body.error, "Unauthorized");
});

test("impide consultar pagos de otro estudiante", async () => {
  const response = await request("/api/payments/2048", 1024);

  assert.equal(response.status, 403);
  assert.equal(response.body.error, "Forbidden");
});

test("permite consultar los pagos propios", async () => {
  const response = await request("/api/payments/1024", 1024);

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, [{
    id: 1,
    student_id: 1024,
    amount: 50,
    payment_date: "2026-09-01",
    receipt_url: "/receipts/1024.pdf"
  }]);
});