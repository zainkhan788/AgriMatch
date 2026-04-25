const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "mysql.railway.internal",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "vFrhVoQRBXgxzfTjxOsgxESqzwCxSpmV",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

app.get("/locations", (req, res) => {
  db.query("SELECT sub_zone_name FROM sub_zones", (err, result) => {
    if (err) res.status(500).json(err);
    else res.json(result);
  });
});

app.get("/soiltypes", (req, res) => {
  db.query(
    "SELECT DISTINCT soil_type FROM soil_crop_rules",
    (err, result) => {
      if (err) res.status(500).json(err);
      else res.json(result);
    }
  );
});

app.post("/analyze", (req, res) => {
  const { location, soilType } = req.body;

  const sql = `
    SELECT 
      s.recommended_crop,
      s.n_min,
      s.p_min,
      s.k_min,
      s.temp_min,
      s.temp_max,
      s.humidity_min,
      s.humidity_max,
      s.rain_min,
      s.rain_max,
      p.yield_maund,
      p.price,
      p.cost,
      ((p.yield_maund * p.price) - p.cost) AS profit
    FROM soil_crop_rules s
    JOIN sub_zones z ON s.sub_zone_id = z.sub_zone_id
    JOIN production_data p ON s.rule_id = p.rule_id
    WHERE z.sub_zone_name = ?
    AND s.soil_type = ?
    ORDER BY profit DESC
  `;

    db.query(sql, [location, soilType], (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else if (result.length === 0) {
      res.json({ message: "No data found" });
    } else {
      res.json(result);
    }
  });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000 🚀");
});