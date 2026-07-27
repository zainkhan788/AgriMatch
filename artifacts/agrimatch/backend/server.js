const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres.gprbwejmbavnhqzjfswf:Skippers12%40%40%21%21@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

app.get("/provinces", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT zone_id, zone_name
      FROM zones
      ORDER BY zone_name ASC
    `);

    return res.json(result.rows);
  } catch (err) {
    console.error("Provinces Error:", err);

    return res.status(500).json({
      message: "Failed to fetch provinces",
      error: err.message,
    });
  }
});

app.get("/locations", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT sub_zone_name FROM sub_zones"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/soiltypes", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT soil_type FROM soil_crop_rules"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/soiltypes/:location", async (req, res) => {

  const location = req.params.location;

  try {

    const result = await db.query(
      `
      SELECT DISTINCT s.soil_type
      FROM soil_crop_rules s
      JOIN sub_zones z
      ON s.sub_zone_id = z.sub_zone_id
      WHERE z.sub_zone_name = $1
      `,
      [location]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json(err);

  }

});

app.post("/analyze", async (req, res) => {
  const { location, soilType } = req.body;

  const sql = `
    SELECT 
      s.recommended_crop,
      s.ph_min,
      s.ph_max,
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
    WHERE z.sub_zone_name = $1
    AND s.soil_type = $2
    ORDER BY profit DESC
  `;

    try { 
      const result = await db.query(sql, [location, soilType]); 
      
      if (result.rows.length === 0) { 
        res.json({ message: "No data found", 
        }); 
      } 
      else { 
        res.json(result.rows); 
      } 
    } 
    catch (err) { 
      console.error(err); 
      res.status(500).json(err);
    } 
  });

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000 🚀");
});