const express = require("express");
const app = express();

app.use(express.json());

const payments = [
  {
    id: 1,
    student_id: 1024,
    amount: 50.00,
    payment_date: "2026-09-01",
    receipt_url: "/receipts/1024.pdf"
  },
  {
    id: 2,
    student_id: 2048,
    amount: 75.00,
    payment_date: "2026-09-02",
    receipt_url: "/receipts/2048.pdf"
  }
];

const db = {
  async query(query, params = []) {

    const studentId = Number(params[0]);

    return {
      rows: payments.filter(p => p.student_id === studentId)
    };
  }
};

function authenticateUser(req, res, next) {

  const studentId = Number(req.header("X-Student-Id"));

  if (!studentId) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  req.user = {
    studentId: studentId
  };

  next();
}

app.get("/api/payments/:studentId", authenticateUser, async (req, res) => {

  const requestedStudentId = Number(req.params.studentId);
  const authenticatedStudentId = Number(req.user.studentId);

  if (!Number.isInteger(requestedStudentId)) {
    return res.status(400).json({
      error: "Invalid studentId"
    });
  }

  if (requestedStudentId !== authenticatedStudentId) {
    return res.status(403).json({
      error: "Forbidden"
    });
  }

  const query =
    "SELECT id, student_id, amount, payment_date, receipt_url " +
    "FROM payments WHERE student_id = $1";

  const result = await db.query(query, [requestedStudentId]);

  res.json(result.rows);
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("AulaPay corregido ejecutándose en http://127.0.0.1:3000");
  });
}

module.exports = app;
