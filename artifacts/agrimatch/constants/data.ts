export const PAKISTAN_LOCATIONS = [
  "Faisalabad",
  "Gujranwala",
  "Sahiwal",
  "Multan",
  "Sukkur",
  "Hyderabad",
  "Nawabshah",
  "Mirpurkhas",
  "Potohar Plateau",
  "Chakwal",
  "Swat",
  "Gilgit",
  "Thatta",
  "Badin",
  "Lahore",
  "Rawalpindi",
  "Bahawalpur",
  "Peshawar",
  "Quetta",
  "Larkana",
];

export const SOIL_COLORS = [
  "Dark Brown",
  "Medium Brown",
  "Reddish Brown",
  "Sandy/Light",
  "Greyish",
  "Black Cotton",
];

export const SOIL_TEXTURES = [
  "Loamy",
  "Silty Loam",
  "Sandy Loam",
  "Clay Loam",
  "Clay",
  "Alluvial",
  "Calcareous",
  "Sandy",
  "Silty",
];

export const NITROGEN_LEVELS = ["Low", "Medium", "High"];

export interface CropRecommendation {
  name: string;
  emoji: string;
  compatibility: number;
  yield: string;
  income: string;
  season: string;
}

export interface SoilResult {
  soilName: string;
  soilType: string;
  texture: string;
  ph: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  healthScore: number;
  composition: { loam: number; clay: number; sand: number };
  pesticideImpact: string[];
  tips: string[];
  crops: CropRecommendation[];
}

export const SOIL_RESULTS: Record<string, SoilResult> = {
  Loamy: {
    soilName: "LOAMY SOIL",
    soilType: "Balanced Textured",
    texture: "Balanced mix of sand, silt, and clay",
    ph: "7.2",
    nitrogen: 45,
    phosphorus: 15,
    potassium: 130,
    healthScore: 88,
    composition: { loam: 45, clay: 30, sand: 25 },
    pesticideImpact: [
      "Retains moderate pesticides — good crop protection",
      "Less leaching — reduced frequency of applications needed",
      "Balanced soil microbiota — minimal negative effects on crops",
    ],
    tips: [
      "Maintain organic matter through crop rotation for sustained fertility",
      "Monitor pH annually to keep it between 6.0–7.5",
      "Use cover crops between seasons to prevent erosion",
    ],
    crops: [
      { name: "Wheat", emoji: "🌾", compatibility: 94, yield: "2.5–3.5 tons/acre", income: "PKR 120,000", season: "Rabi" },
      { name: "Maize", emoji: "🌽", compatibility: 88, yield: "3–4 tons/acre", income: "PKR 100,000", season: "Kharif" },
      { name: "Vegetables", emoji: "🥬", compatibility: 83, yield: "8–12 tons/acre", income: "PKR 110,000", season: "Annual" },
    ],
  },
  "Silty Loam": {
    soilName: "SILTY LOAM",
    soilType: "Fine-Particle Textured",
    texture: "Smooth, fine particles",
    ph: "7.5",
    nitrogen: 50,
    phosphorus: 18,
    potassium: 120,
    healthScore: 85,
    composition: { loam: 40, clay: 25, sand: 35 },
    pesticideImpact: [
      "Fertile and moisture-retentive — pesticides stay longer and remain effective",
      "Lower runoff risk — efficient use of chemicals with less waste",
      "High crop tolerance — minimal damage if applied correctly",
    ],
    tips: [
      "Excellent fertility — maintain with balanced NPK fertilization",
      "Protect from erosion using contour farming on slopes",
      "Rotate legumes to naturally replenish nitrogen",
    ],
    crops: [
      { name: "Wheat", emoji: "🌾", compatibility: 92, yield: "2.5–3.5 tons/acre", income: "PKR 120,000", season: "Rabi" },
      { name: "Barley", emoji: "🌾", compatibility: 87, yield: "1.5–2 tons/acre", income: "PKR 80,000", season: "Rabi" },
      { name: "Maize", emoji: "🌽", compatibility: 85, yield: "3–4 tons/acre", income: "PKR 100,000", season: "Kharif" },
    ],
  },
  "Sandy Loam": {
    soilName: "SANDY LOAM",
    soilType: "Coarse-Light Textured",
    texture: "Coarse sand with some silt and clay",
    ph: "7.0",
    nitrogen: 40,
    phosphorus: 12,
    potassium: 100,
    healthScore: 72,
    composition: { loam: 30, clay: 15, sand: 55 },
    pesticideImpact: [
      "Leaches quickly — may need more frequent pesticide application",
      "High drainage — reduces chemical residue accumulation on crops",
      "Sensitive crops may require targeted spot application",
    ],
    tips: [
      "Good drainage — needs regular irrigation during dry periods",
      "Add organic compost annually to improve water and nutrient retention",
      "Use slow-release fertilizers for better nutrient availability",
    ],
    crops: [
      { name: "Cotton", emoji: "🌿", compatibility: 90, yield: "30–40 maunds/acre", income: "PKR 150,000", season: "Kharif" },
      { name: "Maize", emoji: "🌽", compatibility: 85, yield: "3–4 tons/acre", income: "PKR 100,000", season: "Kharif" },
      { name: "Millet", emoji: "🌾", compatibility: 78, yield: "0.8–1.2 tons/acre", income: "PKR 55,000", season: "Kharif" },
    ],
  },
  "Clay Loam": {
    soilName: "CLAY LOAM",
    soilType: "Medium-Heavy Textured",
    texture: "Heavy, sticky, fine particles",
    ph: "7.8",
    nitrogen: 48,
    phosphorus: 20,
    potassium: 140,
    healthScore: 78,
    composition: { loam: 35, clay: 40, sand: 25 },
    pesticideImpact: [
      "Strong pesticide binding — slower degradation, longer lasting effect",
      "Risk of accumulation — avoid over-application or repeated doses",
      "Waterlogging may reduce absorption — manage irrigation carefully",
    ],
    tips: [
      "Improve drainage with raised beds or proper field channeling",
      "Avoid using heavy machinery on wet soil to prevent compaction",
      "Use deep-rooted cover crops to break up compaction layers",
    ],
    crops: [
      { name: "Rice", emoji: "🌾", compatibility: 91, yield: "2–3 tons/acre", income: "PKR 95,000", season: "Kharif" },
      { name: "Sugarcane", emoji: "🎋", compatibility: 86, yield: "45–55 tons/acre", income: "PKR 190,000", season: "Annual" },
      { name: "Wheat", emoji: "🌾", compatibility: 82, yield: "2.5–3 tons/acre", income: "PKR 115,000", season: "Rabi" },
    ],
  },
  Clay: {
    soilName: "CLAY SOIL",
    soilType: "Heavy Dense Textured",
    texture: "Very fine, dense, retains water well",
    ph: "7.5",
    nitrogen: 50,
    phosphorus: 20,
    potassium: 140,
    healthScore: 70,
    composition: { loam: 10, clay: 70, sand: 20 },
    pesticideImpact: [
      "High retention — pesticides remain effective but monitor for soil toxicity",
      "Best suited for water-intensive crops with standing water",
      "Avoid repeated pesticide use to protect soil microbiota health",
    ],
    tips: [
      "Add gypsum to break up clay structure and improve drainage",
      "Avoid working soil when wet to prevent compaction and cracking",
      "Plant cover crops in off-season to improve structure",
    ],
    crops: [
      { name: "Rice", emoji: "🌾", compatibility: 93, yield: "2–3 tons/acre", income: "PKR 95,000", season: "Kharif" },
      { name: "Sugarcane", emoji: "🎋", compatibility: 84, yield: "40–50 tons/acre", income: "PKR 185,000", season: "Annual" },
      { name: "Cotton", emoji: "🌿", compatibility: 78, yield: "25–35 maunds/acre", income: "PKR 130,000", season: "Kharif" },
    ],
  },
  Alluvial: {
    soilName: "ALLUVIAL SOIL",
    soilType: "River-Deposited Fertile",
    texture: "Fertile, fine-textured, river-deposited layers",
    ph: "7.2",
    nitrogen: 48,
    phosphorus: 18,
    potassium: 135,
    healthScore: 92,
    composition: { loam: 50, clay: 25, sand: 25 },
    pesticideImpact: [
      "Fertile soils — crops tolerate pesticides well with minimal damage",
      "Moderate leaching — chemical effectiveness is maintained",
      "Optimal for almost all crops with standard pest control protocols",
    ],
    tips: [
      "Extremely fertile — minimal inputs needed for first few crops",
      "Maintain fertility with organic matter and balanced fertilization",
      "Monitor water table as river-proximity may cause seasonal flooding",
    ],
    crops: [
      { name: "Wheat", emoji: "🌾", compatibility: 95, yield: "3–4 tons/acre", income: "PKR 130,000", season: "Rabi" },
      { name: "Rice", emoji: "🌾", compatibility: 90, yield: "2.5–3.5 tons/acre", income: "PKR 105,000", season: "Kharif" },
      { name: "Maize", emoji: "🌽", compatibility: 88, yield: "3–5 tons/acre", income: "PKR 110,000", season: "Kharif" },
    ],
  },
  Calcareous: {
    soilName: "CALCAREOUS SOIL",
    soilType: "Alkaline Chalky Textured",
    texture: "Chalky, contains calcium carbonate deposits",
    ph: "7.8",
    nitrogen: 38,
    phosphorus: 13,
    potassium: 115,
    healthScore: 68,
    composition: { loam: 35, clay: 30, sand: 35 },
    pesticideImpact: [
      "High pH may reduce some pesticide activity — select pH-compatible formulations",
      "Crops tolerant to slightly alkaline soils perform best here",
      "Slow pesticide degradation — reduces the number of applications needed",
    ],
    tips: [
      "Add sulfur or iron sulfate to reduce pH for sensitive crops",
      "Select alkaline-tolerant crop varieties for best performance",
      "Apply micronutrients (iron, zinc) as deficiency is common in high-pH soils",
    ],
    crops: [
      { name: "Cotton", emoji: "🌿", compatibility: 87, yield: "30–40 maunds/acre", income: "PKR 150,000", season: "Kharif" },
      { name: "Wheat", emoji: "🌾", compatibility: 84, yield: "2–3 tons/acre", income: "PKR 110,000", season: "Rabi" },
      { name: "Sugarcane", emoji: "🎋", compatibility: 80, yield: "40–50 tons/acre", income: "PKR 180,000", season: "Annual" },
    ],
  },
  Sandy: {
    soilName: "SANDY SOIL",
    soilType: "Coarse Fast-Draining",
    texture: "Coarse, fast-draining, low water retention",
    ph: "7.5",
    nitrogen: 30,
    phosphorus: 10,
    potassium: 90,
    healthScore: 52,
    composition: { loam: 10, clay: 10, sand: 80 },
    pesticideImpact: [
      "Rapid leaching — chemicals may not last long after application",
      "Frequent or targeted spot applications are recommended",
      "Less risk of pesticide accumulation in soil",
    ],
    tips: [
      "Add large amounts of organic matter (compost) to improve water retention",
      "Use drip irrigation for efficient water delivery to roots",
      "Apply mulch around crops to reduce moisture evaporation",
    ],
    crops: [
      { name: "Millet", emoji: "🌾", compatibility: 88, yield: "0.8–1.2 tons/acre", income: "PKR 55,000", season: "Kharif" },
      { name: "Castor", emoji: "🌿", compatibility: 82, yield: "0.6–1 tons/acre", income: "PKR 60,000", season: "Kharif" },
      { name: "Guar", emoji: "🌱", compatibility: 77, yield: "0.5–0.8 tons/acre", income: "PKR 45,000", season: "Kharif" },
    ],
  },
  Silty: {
    soilName: "SILTY SOIL",
    soilType: "Fine Smooth Textured",
    texture: "Fine, smooth, moisture-retaining particles",
    ph: "7.2",
    nitrogen: 48,
    phosphorus: 18,
    potassium: 125,
    healthScore: 82,
    composition: { loam: 20, clay: 25, sand: 55 },
    pesticideImpact: [
      "Fertile and retains moisture — pesticides are more effective and longer-lasting",
      "Low runoff risk — safer for crops and nearby water sources",
      "Good for high-yield crops with moderate pesticide use",
    ],
    tips: [
      "Very fertile and moisture-retentive — ideal for high-demand crops",
      "Protect topsoil from wind and water erosion with cover crops",
      "Avoid overwatering — moisture retention can lead to waterlogging",
    ],
    crops: [
      { name: "Rice", emoji: "🌾", compatibility: 91, yield: "2–3 tons/acre", income: "PKR 95,000", season: "Kharif" },
      { name: "Wheat", emoji: "🌾", compatibility: 88, yield: "2.5–3.5 tons/acre", income: "PKR 120,000", season: "Rabi" },
      { name: "Vegetables", emoji: "🥬", compatibility: 84, yield: "10–15 tons/acre", income: "PKR 115,000", season: "Annual" },
    ],
  },
};

export interface ZoneData {
  zone: string;
  subZone: string;
  soilType: string;
  phMin: number;
  phMax: number;
  nMin: number;
  pMin: number;
  kMin: number;
  recommendedCrops: string[];
}

export const ZONE_DATA: ZoneData[] = [
  { zone: "Upper Indus Plain", subZone: "Faisalabad", soilType: "Loamy", phMin: 6.8, phMax: 7.5, nMin: 40, pMin: 12, kMin: 120, recommendedCrops: ["Wheat", "Maize", "Vegetables"] },
  { zone: "Upper Indus Plain", subZone: "Gujranwala", soilType: "Silty Loam", phMin: 7.0, phMax: 7.8, nMin: 45, pMin: 15, kMin: 115, recommendedCrops: ["Wheat", "Barley"] },
  { zone: "Upper Indus Plain", subZone: "Sahiwal", soilType: "Sandy Loam", phMin: 6.8, phMax: 7.3, nMin: 38, pMin: 10, kMin: 95, recommendedCrops: ["Cotton"] },
  { zone: "Upper Indus Plain", subZone: "Multan", soilType: "Clay Loam", phMin: 7.2, phMax: 8.0, nMin: 45, pMin: 18, kMin: 135, recommendedCrops: ["Sugarcane", "Rice"] },
  { zone: "Lower Indus Plain", subZone: "Sukkur", soilType: "Clay", phMin: 7.0, phMax: 7.8, nMin: 45, pMin: 18, kMin: 130, recommendedCrops: ["Rice", "Sugarcane"] },
  { zone: "Lower Indus Plain", subZone: "Hyderabad", soilType: "Alluvial", phMin: 6.8, phMax: 7.5, nMin: 42, pMin: 15, kMin: 125, recommendedCrops: ["Wheat", "Maize"] },
  { zone: "Southern Irrigated Plains", subZone: "Nawabshah", soilType: "Calcareous", phMin: 7.5, phMax: 8.2, nMin: 35, pMin: 12, kMin: 110, recommendedCrops: ["Cotton", "Sugarcane"] },
  { zone: "Southern Irrigated Plains", subZone: "Mirpurkhas", soilType: "Loamy", phMin: 7.0, phMax: 7.6, nMin: 40, pMin: 15, kMin: 125, recommendedCrops: ["Wheat", "Maize"] },
  { zone: "Barani (Rainfed)", subZone: "Potohar Plateau", soilType: "Silty Loam", phMin: 6.7, phMax: 7.3, nMin: 38, pMin: 12, kMin: 115, recommendedCrops: ["Wheat", "Pulses"] },
  { zone: "Barani (Rainfed)", subZone: "Chakwal", soilType: "Clay Loam", phMin: 7.0, phMax: 7.5, nMin: 40, pMin: 15, kMin: 120, recommendedCrops: ["Chickpea"] },
  { zone: "Northern Valleys", subZone: "Swat", soilType: "Silty Loam", phMin: 6.5, phMax: 7.2, nMin: 42, pMin: 14, kMin: 125, recommendedCrops: ["Maize", "Apples"] },
  { zone: "Northern Valleys", subZone: "Gilgit", soilType: "Clay Loam", phMin: 6.8, phMax: 7.5, nMin: 45, pMin: 16, kMin: 135, recommendedCrops: ["Wheat"] },
  { zone: "Indus Delta", subZone: "Thatta", soilType: "Clay", phMin: 7.0, phMax: 7.8, nMin: 40, pMin: 14, kMin: 125, recommendedCrops: ["Rice", "Banana"] },
  { zone: "Indus Delta", subZone: "Badin", soilType: "Silty", phMin: 6.8, phMax: 7.4, nMin: 45, pMin: 16, kMin: 120, recommendedCrops: ["Vegetables"] },
  { zone: "Arid / Desert", subZone: "Thar Desert", soilType: "Sandy", phMin: 7.5, phMax: 8.0, nMin: 30, pMin: 10, kMin: 90, recommendedCrops: ["Millet", "Castor", "Guar"] },
  { zone: "Western Plateau", subZone: "Balochistan Plateau", soilType: "Calcareous", phMin: 7.5, phMax: 8.2, nMin: 35, pMin: 12, kMin: 110, recommendedCrops: ["Wheat", "Barley"] },
  { zone: "Western Dry Mountains", subZone: "Hindu Kush", soilType: "Calcareous", phMin: 7.5, phMax: 8.0, nMin: 35, pMin: 12, kMin: 110, recommendedCrops: ["Wheat", "Barley", "Apples"] },
  { zone: "Sulaiman Piedmont", subZone: "D.I. Khan", soilType: "Loamy", phMin: 7.2, phMax: 7.8, nMin: 40, pMin: 15, kMin: 120, recommendedCrops: ["Wheat", "Millet", "Gram"] },
];

export interface AgriZone {
  zone: string;
  soilType: string;
  ph: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  crops: string[];
}

export const AGRICULTURE_ZONES: AgriZone[] = [
  { zone: "Upper Indus Plain", soilType: "Loamy / Silty Loam", ph: "7.0–7.8", nitrogen: 45, phosphorus: 15, potassium: 125, crops: ["Wheat", "Maize", "Barley", "Vegetables"] },
  { zone: "Lower Indus Plain", soilType: "Clay / Alluvial", ph: "6.8–7.8", nitrogen: 48, phosphorus: 18, potassium: 130, crops: ["Rice", "Sugarcane", "Wheat", "Maize"] },
  { zone: "Southern Irrigated Plains", soilType: "Calcareous / Loamy", ph: "7.0–8.2", nitrogen: 40, phosphorus: 15, potassium: 120, crops: ["Cotton", "Wheat", "Sugarcane", "Millet"] },
  { zone: "Arid / Desert Zone", soilType: "Sandy / Clayey", ph: "7.5–8.0", nitrogen: 32, phosphorus: 11, potassium: 100, crops: ["Millet", "Guar", "Castor"] },
  { zone: "Barani (Rainfed) Zone", soilType: "Silt Loam / Clay Loam", ph: "6.7–7.5", nitrogen: 40, phosphorus: 14, potassium: 118, crops: ["Wheat", "Maize", "Pulses", "Chickpea"] },
  { zone: "Northern Valleys", soilType: "Silty Loam / Clay Loam", ph: "6.5–7.5", nitrogen: 44, phosphorus: 15, potassium: 130, crops: ["Maize", "Rice", "Apples", "Wheat"] },
  { zone: "Sulaiman Piedmont", soilType: "Loamy / Clayey", ph: "7.5–7.8", nitrogen: 41, phosphorus: 17, potassium: 123, crops: ["Wheat", "Millet", "Gram", "Mustard"] },
  { zone: "Western Plateau / Mountains", soilType: "Calcareous Loamy", ph: "7.5–8.2", nitrogen: 35, phosphorus: 12, potassium: 110, crops: ["Wheat", "Barley", "Apples", "Peaches"] },
  { zone: "Indus Delta", soilType: "Clayey / Silty", ph: "6.8–7.8", nitrogen: 47, phosphorus: 17, potassium: 123, crops: ["Rice", "Pulses", "Sugarcane", "Banana"] },
];

export const CROPS_DATABASE = [
  { name: "Wheat", emoji: "🌾", season: "Rabi", soils: ["Loamy", "Alluvial", "Silty Loam", "Clay Loam"], ph: "6.0–7.5", water: "Moderate", income: "PKR 120,000/acre" },
  { name: "Maize", emoji: "🌽", season: "Kharif", soils: ["Loamy", "Sandy Loam", "Silty Loam", "Alluvial"], ph: "5.8–7.0", water: "Moderate", income: "PKR 100,000/acre" },
  { name: "Barley", emoji: "🌾", season: "Rabi", soils: ["Silty Loam", "Loamy", "Calcareous"], ph: "6.0–7.8", water: "Low", income: "PKR 80,000/acre" },
  { name: "Cotton", emoji: "🌿", season: "Kharif", soils: ["Sandy Loam", "Calcareous", "Clay Loam"], ph: "5.8–8.0", water: "Moderate", income: "PKR 150,000/acre" },
  { name: "Rice", emoji: "🍚", season: "Kharif", soils: ["Clay", "Clay Loam", "Alluvial", "Silty"], ph: "5.5–7.5", water: "High", income: "PKR 95,000/acre" },
  { name: "Sugarcane", emoji: "🎋", season: "Annual", soils: ["Clay Loam", "Clay", "Alluvial", "Loamy"], ph: "6.0–7.5", water: "High", income: "PKR 185,000/acre" },
  { name: "Millet", emoji: "🌾", season: "Kharif", soils: ["Sandy", "Sandy Loam"], ph: "5.5–7.5", water: "Low", income: "PKR 55,000/acre" },
  { name: "Guar", emoji: "🌱", season: "Kharif", soils: ["Sandy", "Sandy Loam"], ph: "7.0–8.5", water: "Low", income: "PKR 45,000/acre" },
  { name: "Castor", emoji: "🌿", season: "Kharif", soils: ["Sandy", "Sandy Loam", "Clay Loam"], ph: "6.0–8.0", water: "Low", income: "PKR 60,000/acre" },
  { name: "Pulses", emoji: "🫘", season: "Rabi", soils: ["Silty Loam", "Loamy"], ph: "6.0–7.5", water: "Low-Moderate", income: "PKR 75,000/acre" },
  { name: "Chickpea", emoji: "🫘", season: "Rabi", soils: ["Clay Loam", "Loamy"], ph: "6.0–7.5", water: "Low", income: "PKR 90,000/acre" },
  { name: "Apples", emoji: "🍎", season: "Annual", soils: ["Silty Loam", "Clay Loam"], ph: "5.5–6.5", water: "Moderate", income: "PKR 200,000/acre" },
  { name: "Banana", emoji: "🍌", season: "Annual", soils: ["Clay", "Alluvial"], ph: "5.5–7.0", water: "High", income: "PKR 160,000/acre" },
  { name: "Vegetables", emoji: "🥬", season: "Annual", soils: ["Loamy", "Alluvial", "Silty"], ph: "5.5–7.0", water: "Moderate", income: "PKR 115,000/acre" },
];

export const PESTS = [
  {
    id: "1",
    name: "Aphids",
    affected: ["Wheat", "Cotton", "Vegetables"],
    severity: "Medium",
    description: "Small soft-bodied insects that suck plant sap. Look for yellowing leaves and sticky residue (honeydew) on leaf surfaces.",
    treatment: "Apply neem oil spray or introduce ladybirds as biological control. Use insecticidal soap for severe infestations.",
    prevention: "Regular field monitoring weekly, avoid excessive nitrogen fertilization which promotes tender growth.",
    emoji: "🐛",
    color: "#F4A261",
  },
  {
    id: "2",
    name: "White Fly",
    affected: ["Cotton", "Tomato", "Chili"],
    severity: "High",
    description: "Tiny white insects on leaf undersides causing yellowing and leaf curl. Major vector of viral diseases in cotton and vegetables.",
    treatment: "Yellow sticky traps, neem-based sprays, systemic insecticides (imidacloprid) in severe cases.",
    prevention: "Remove infected plants promptly, use reflective mulch, avoid over-fertilizing with nitrogen.",
    emoji: "🦟",
    color: "#E63946",
  },
  {
    id: "3",
    name: "Stem Borer",
    affected: ["Rice", "Maize", "Sugarcane"],
    severity: "High",
    description: "Larvae bore into stems causing 'dead heart' in young plants and 'white ear' in older ones. Serious yield loss pest.",
    treatment: "Apply granular insecticides, use pheromone traps for monitoring, biological control with Trichogramma wasps.",
    prevention: "Early planting dates, balanced fertilization, proper crop rotation with non-host crops.",
    emoji: "🐝",
    color: "#E63946",
  },
  {
    id: "4",
    name: "Leaf Rust",
    affected: ["Wheat", "Barley"],
    severity: "Medium",
    description: "Fungal disease causing orange-brown pustules on leaves. Reduces photosynthesis and grain quality significantly.",
    treatment: "Apply fungicides (propiconazole or tebuconazole) at early infection stages for best results.",
    prevention: "Plant rust-resistant varieties, avoid late sowing, ensure good air circulation between plants.",
    emoji: "🍂",
    color: "#F4A261",
  },
  {
    id: "5",
    name: "Cotton Bollworm",
    affected: ["Cotton", "Maize"],
    severity: "High",
    description: "Larvae damage bolls, buds, and fruit. One of the most economically damaging pests in Pakistan's cotton belt.",
    treatment: "Bt-based insecticides, pheromone traps for early monitoring, chemical control when threshold is exceeded.",
    prevention: "Regular field scouting, use Bt cotton varieties, destroy crop residues after harvest.",
    emoji: "🐛",
    color: "#E63946",
  },
  {
    id: "6",
    name: "Locust",
    affected: ["Wheat", "Maize", "Vegetables"],
    severity: "Critical",
    description: "Swarms can devastate entire crops within hours. A major threat to food security across Pakistan.",
    treatment: "Immediate aerial or ground spraying with approved insecticides. Report sightings to agricultural authorities.",
    prevention: "Monitor FAO and Pakistan Locust Control Centre forecasts. Act on early warning reports immediately.",
    emoji: "🦗",
    color: "#7A4B2A",
  },
];

export const STATS = {
  totalFarmers: 42568,
  soilSamples: 128934,
  cropRecommendations: 89421,
  avgIncomeIncrease: 34,
  provinceStats: [
    { province: "Punjab", samples: 68420, topCrop: "Wheat", color: "#52B788" },
    { province: "Sindh", samples: 28314, topCrop: "Rice", color: "#2D6A4F" },
    { province: "KPK", samples: 18230, topCrop: "Maize", color: "#95D5B2" },
    { province: "Balochistan", samples: 13970, topCrop: "Cotton", color: "#1B4332" },
  ],
};
