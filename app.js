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
    let studentId;

    if (params.length > 0) {
      studentId = Number(params[0]);
    } else {
      const match = query.match(/student_id\s*=\s*(\d+)/i);
      studentId = match ? Number(match[1]) : NaN;
    }

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

  const studentId = req.params.studentId;

  const query = "SELECT id, student_id, amount, payment_date, receipt_url FROM payments WHERE student_id = " + studentId;

  const result = await db.query(query);

  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("AulaPay vulnerable ejecutándose en http://127.0.0.1:3000");
});
