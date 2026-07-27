import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Faisalabad: "Faisalabad",
        Gujranwala: "Gujranwala",
        Sahiwal: "Sahiwal",
        Multan: "Multan",
        Sukkur: "Sukkur",
        Hyderabad: "Hyderabad",
        Nawabshah: "Nawabshah",
        Mirpurkhas: "Mirpurkhas",
        "Thar Desert": "Thar Desert",
        Cholistan: "Cholistan",
        "Potohar Plateau": "Potohar Plateau",
        Chakwal: "Chakwal",
        Swat: "Swat",
        Gilgit: "Gilgit",
        Thatta: "Thatta",
        Badin: "Badin",
        
        Silty: "Silty",
        "Sandy loam": "Sandy loam",
        Alluvial: "Alluvial",
        Sandy: "Sandy",
        "Silt loam": "Silt loam",
        "Silty loam": "Silty loam",
        "Clay loam": "Clay loam",
        Calcareous: "Calcareous",
        Loamy: "Loamy",
        Clayey: "Clayey",
        title: "Soil Type Analyzer",
        subtitle: "AI Powered Smart Crop Recommendation",
        location: "Select Location",
        soil: "Select Soil Type",
        area: "Field Area (Acres)",
        analyze: "Analyze Soil",
        bestChoice: "#1 Best Choice",
        alternative: "#2 Alternative",
        recommended: "Recommended",

        Wheat: "Wheat",
        Maize: "Maize",
        Barley: "Barley",
        Cotton: "Cotton",
        Rice: "Rice",
        Sugarcane: "Sugarcane",
        Millet: "Millet",
        Guar: "Guar",
        Castor: "Castor",
        Pulses: "Pulses",
        Chickpea: "Chickpea",
        Apples: "Apples",
        Banana: "Banana",
        Vegetables: "Vegetables",
        areaPlaceholder: "e.g. 2",
        totalProfit: "Total Profit",
        
        yield: "Yield",
        maund: "Maund",
        price: "Price",
        cost: "Cost",
        perAcre: "Per Acre",
        
        nutrients: "Nutrients",
        N: "N",
        P: "P",
        K: "K",
        
        climate: "Climate Requirements",
        
        temperature: "Temperature",
        humidity: "Humidity",
        rainfall: "Rainfall",
        
        leafVeryGood: "Leaf growth can be very good.",
        leafNormal: "Leaf growth can be normal.",
        leafWeak: "Leaf growth may stay weak.",
        
        rootStrong: "Roots can become strong.",
        rootNormal: "Roots growth can be normal.",
        rootWeak: "Roots may stay weak.",
        
        plantStrong: "Plant strength can be very good.",
        plantNormal: "Plant strength can be normal.",
        plantWeak: "Plant strength may be low.",

        help: "Help!",

        nitrogenInfo: "N = Nitrogen → Helps leaf growth and green color.",
        
        phosphorusInfo: "P = Phosphorus → Supports root development and flowering.",
        
        potassiumInfo: "K = Potassium → Improves strength, fruit quality and disease resistance.",
        
        balancedNpkInfo:
          "Balanced NPK values can increase yield, improve plant health and produce stronger crops.",

        alertTitle: "Alert",

        alertAll: "Please select location, soil type and enter field area.",
        alertLocation: "Please select a location.",
        alertLocationSoil: "Please select location and soil type.",
        alertLocationArea: "Please select a location and enter field area.",
        alertSoilArea: "Please select a soil type and enter field area.",
        alertSoil: "Please select a soil type.",
        alertArea: "Please enter field area.",
        
        noData: "No data found for this location and soil type.",
        serverError: "Something went wrong. Please try again.",
        
        
        //HomePage

        homeWelcome: "Welcome to AgriMatch",

        quickActions: "Quick Actions",
        soilAnalyzer: "Soil Analyzer",
        cropMatcher: "Crop Matcher",
        pestDetection: "Pest Detection",
        incomeCalc: "Income Calculator",
        
        liveStatistics: "Live Statistics",
        registeredFarmers: "Registered Farmers",
        soilSamples: "Soil Samples",
        recommendations: "Recommendations",
        incomeIncrease: "Income Increase",
        
        provinceHighlights: "Province Highlights",
        topCrop: "Top Crop",
        samples: "samples",

        Punjab: "Punjab",
        Sindh: "Sindh",
        Balochistan: "Balochistan",
        KPK: "KPK",

        howAgriMatchWorks: "How AgriMatch Works",
        homeStep1: "Submit soil sample data from your field",
        homeStep2: "AI classifies your soil type and composition",
        homeStep3: "Algorithm matches best-fit crops to your soil",
        homeStep4: "Get income projections and farming tips",
        
        language: "Language: ",
        english: "English",
        urdu: "Urdu",
        suitableForSelectedSoilLocation:
  "Highly suitable for your selected soil and location",

profitPerAcre: "Profit Per Acre",
growingConditions: "Growing Conditions",
soilPh: "Soil pH",
cropInsights: "Crop Insights",

temperatureShortDescription:
  "Cool to moderate weather is best",

rainfallShortDescription:
  "Moderate rainfall supports good yield",

phShortDescription:
  "Slightly acidic to neutral soil is ideal",

bestInSoil: "Best in Selected Soil",

bestSoilInsight:
  "{{crop}} grows best in well-drained {{soil}} soil.",

soilPhInsight:
  "Slightly acidic to neutral soil (pH {{min}} - {{max}}) helps the plant absorb nutrients efficiently and grow healthy.",

temperatureInsight:
  "Cool to moderate temperature ({{min}}°C - {{max}}°C) is ideal for crop growth.",

rainfallInsight:
  "Moderate rainfall ({{min}}mm - {{max}}mm) is suitable for healthy crop development.",

profitPotential: "Profit Potential",

profitPotentialInsight:
  "{{crop}} has good market demand and offers good profit potential.",

note: "Note",

resultNote:
  "Results are based on average data. Actual results may vary based on field management and local conditions.",
      }
    },

    ur: {
      translation: {
        Faisalabad: "فیصل آباد",
        Gujranwala: "گوجرانوالہ",
        Sahiwal: "ساہیوال",
        Multan: "ملتان",
        Sukkur: "سکھر",
        Hyderabad: "حیدرآباد",
        Nawabshah: "نواب شاہ",
        Mirpurkhas: "میرپورخاص",
        "Thar Desert": "صحرائے تھر",
        Cholistan: "چولستان",
        "Potohar Plateau": "پوٹھوہار",
        Chakwal: "چکوال",
        Swat: "سوات",
        Gilgit: "گلگت",
        Thatta: "ٹھٹھہ",
        Badin: "بدین",
        
        Silty: "سلٹی",
        "Sandy loam": "ریتلی دوامی",
        Alluvial: "دریائی",
        Sandy: "ریتلی",
        "Silt loam": "سلٹ دوامی",
        "Silty loam": "سلٹی دوامی",
        "Clay loam": "چکنی دوامی",
        Calcareous: "چونے والی",
        Loamy: "دوامی",
        Clayey: "چکنی",
        Wheat: "گندم",
        Maize: "مکئی",
        Barley: "جو",
        Cotton: "کپاس",
        Rice: "چاول",
        Sugarcane: "گنا",
        Millet: "باجرا",
        Guar: "گوار",
        Castor: "ارنڈی",
        Pulses: "دالیں",
        Chickpea: "چنا",
        Apples: "سیب",
        Banana: "کیلا",
        Vegetables: "سبزیاں",
        areaPlaceholder: "مثلاً 2",
        title: "مٹی کی جانچ کا نظام",
        subtitle: "مصنوعی ذہانت پر مبنی فصل کی سفارش",
        location: "مقام منتخب کریں",
        soil: "مٹی کی قسم منتخب کریں",
        area: "زمین کا رقبہ (ایکڑ)",
        analyze: "تجزیہ کریں",
        bestChoice: "#1 بہترین انتخاب",
        alternative: "#2 متبادل",
        recommended: "تجویز کردہ",
        
        totalProfit: "کل منافع",
        
        yield: "پیداوار",
        maund: "من",
        price: "قیمت",
        cost: "لاگت",
        perAcre: "فی ایکڑ",
        
        nutrients: "غذائی اجزاء",
        N: "این",
        P: "پی",
        K: "کے",
        
        climate: "موسمی ضروریات",
        
        temperature: "درجہ حرارت",
        humidity: "نمی",
        rainfall: "بارش",
        
        leafVeryGood: "پتوں کی بڑھوتری بہت اچھی ہو سکتی ہے۔",
        leafNormal: "پتوں کی بڑھوتری معمول کے مطابق ہو سکتی ہے۔",
        leafWeak: "پتوں کی بڑھوتری کمزور رہ سکتی ہے۔",
        
        rootStrong: "جڑیں مضبوط ہو سکتی ہیں۔",
        rootNormal: "جڑوں کی بڑھوتری معمول کے مطابق ہو سکتی ہے۔",
        rootWeak: "جڑیں کمزور رہ سکتی ہیں۔",
        
        plantStrong: "پودے کی مضبوطی بہت اچھی ہو سکتی ہے۔",
        plantNormal: "پودے کی مضبوطی معمول کے مطابق ہو سکتی ہے۔",
        plantWeak: "پودے کی مضبوطی کم ہو سکتی ہے۔",

        help: "مدد!",

        nitrogenInfo:
          "این = نائٹروجن → پتوں کی بڑھوتری اور سبز رنگ میں مدد دیتی ہے۔",
        
        phosphorusInfo:
          "پی = فاسفورس → جڑوں کی نشوونما اور پھولوں کی افزائش میں مدد دیتا ہے۔",
        
        potassiumInfo:
          "کے = پوٹاشیم → پودے کی مضبوطی، پھل کے معیار اور بیماریوں سے بچاؤ کو بہتر بناتا ہے۔",
        
        balancedNpkInfo:
          "متوازن این پی کے مقدار پیداوار بڑھانے، پودے کی صحت بہتر بنانے اور مضبوط فصل حاصل کرنے میں مددگار ثابت ہو سکتی ہے۔",

        alertTitle: "اطلاع",

        alertAll: "براہ کرم مقام، مٹی کی قسم منتخب کریں اور زمین کا رقبہ درج کریں۔",
        alertLocationSoil: "براہ کرم مقام اور مٹی کی قسم منتخب کریں۔",
        alertLocationArea: "براہ کرم مقام منتخب کریں اور زمین کا رقبہ درج کریں۔",
        alertSoilArea: "براہ کرم مٹی کی قسم منتخب کریں اور زمین کا رقبہ درج کریں۔",
        alertLocation: "براہ کرم مقام منتخب کریں۔",
        alertSoil: "براہ کرم مٹی کی قسم منتخب کریں۔",
        alertArea: "براہ کرم زمین کا رقبہ درج کریں۔",
        
        noData: "اس مقام اور مٹی کی قسم کے لیے کوئی معلومات موجود نہیں۔",
        serverError: "کچھ خرابی پیش آگئی ہے، دوبارہ کوشش کریں۔",

        //HomePage

        homeWelcome: "ایگری میچ میں خوش آمدید",

        quickActions: "فوری سہولیات",
        soilAnalyzer: "مٹی کی جانچ",
        cropMatcher: "فصل کا انتخاب",
        pestDetection: "کیڑوں کی شناخت",
        incomeCalc: "آمدنی کا حساب",
        
        liveStatistics: "موجودہ اعداد و شمار",
        registeredFarmers: "رجسٹرڈ کسان",
        soilSamples: "مٹی کے نمونے",
        recommendations: "فصل کی سفارشات",
        incomeIncrease: "آمدنی میں اضافہ",
        
        provinceHighlights: "صوبائی معلومات",
        topCrop: "اہم فصل",
        samples: "نمونے",
        
        Punjab: "پنجاب",
        Sindh: "سندھ",
        Balochistan: "بلوچستان",
        KPK: "خیبر پختونخوا",

        howAgriMatchWorks: "ایگری میچ کیسے کام کرتا ہے",
        homeStep1: "اپنے کھیت کی مٹی کے نمونے کی معلومات درج کریں",
        homeStep2: "مصنوعی ذہانت مٹی کی قسم اور ساخت کی شناخت کرتی ہے",
        homeStep3: "نظام آپ کی مٹی کے لیے موزوں فصلیں منتخب کرتا ہے",
        homeStep4: "متوقع آمدنی اور کاشتکاری کی تجاویز حاصل کریں",
        
        language: "زبان",
        english: "انگریزی",
        urdu: "اردو",
        suitableForSelectedSoilLocation:
  "آپ کی منتخب کردہ مٹی اور مقام کے لیے انتہائی موزوں",

profitPerAcre: "فی ایکڑ منافع",
growingConditions: "کاشت کے لیے موزوں حالات",
soilPh: "مٹی کا پی ایچ",
cropInsights: "فصل کی اہم معلومات",

temperatureShortDescription:
  "ٹھنڈا سے معتدل موسم بہترین ہے",

rainfallShortDescription:
  "مناسب بارش بہتر پیداوار میں مدد دیتی ہے",

phShortDescription:
  "قدرے تیزابی سے غیر جانبدار مٹی موزوں ہے",

bestInSoil: "منتخب مٹی کے لیے بہترین",

bestSoilInsight:
  "{{crop}} نکاسی والی {{soil}} مٹی میں بہتر اگتی ہے۔",

soilPhInsight:
  "{{min}} سے {{max}} پی ایچ والی مٹی پودے کو غذائی اجزاء بہتر جذب کرنے اور صحت مند بڑھوتری میں مدد دیتی ہے۔",

temperatureInsight:
  "{{min}}°C سے {{max}}°C تک معتدل درجہ حرارت فصل کی بڑھوتری کے لیے موزوں ہے۔",

rainfallInsight:
  "{{min}} سے {{max}} ملی میٹر بارش فصل کی صحت مند نشوونما کے لیے موزوں ہے۔",

profitPotential: "منافع کی صلاحیت",

profitPotentialInsight:
  "{{crop}} کی مارکیٹ میں اچھی مانگ ہے اور یہ مناسب منافع دے سکتی ہے۔",

note: "نوٹ",

resultNote:
  "نتائج اوسط اعداد و شمار پر مبنی ہیں۔ اصل نتائج کھیت کے انتظام اور مقامی حالات کے مطابق مختلف ہو سکتے ہیں۔",  
      }
    }
  },

  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },  
});

export default i18n;