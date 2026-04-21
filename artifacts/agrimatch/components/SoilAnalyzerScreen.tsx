import React, { useEffect, useRef, useState } from "react";
import {
 View,
 Text,
 StyleSheet,
 ScrollView,
 TouchableOpacity,
 TextInput,
 ActivityIndicator,
 KeyboardAvoidingView,
 Platform,
 TouchableWithoutFeedback,
 Keyboard
} from "react-native";
import { CROPS_DATABASE } from "@/constants/data";
import { Feather } from "@expo/vector-icons";

type LocationItem = {
  sub_zone_name: string;
};

type SoilTypeItem = {
  soil_type: string;
};

type ResultItem = {
  recommended_crop: string;
  yield_maund: number;
  price: number;
  cost: number;
  profit: number;
  n_min: number;
  p_min: number;
  k_min: number;
  Temp_Min: number;
  Temp_Max: number;
  Humidity_Min: number;
  Humidity_Max: number;
  Rain_Min: number;
  Rain_Max: number;
};

export default function SoilAnalyzerScreen() {
  const BASE_URL = "http://192.168.1.106:5000";

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [soilTypes, setSoilTypes] = useState<SoilTypeItem[]>([]);

  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [fieldArea, setFieldArea] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultItem[]>([]);

  const getCropEmoji = (cropName: string) => {
  const found = CROPS_DATABASE.find(
    (crop) =>
      crop.name.trim().toLowerCase() ===
      cropName.trim().toLowerCase()
  );

  return found ? found.emoji : "🌱";
};

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.log(err));

    fetch(`${BASE_URL}/soiltypes`)
      .then((res) => res.json())
      .then((data) => setSoilTypes(data))
      .catch((err) => console.log(err));
  }, []);

  const analyze = () => {
    Keyboard.dismiss();
    if (!location || !soilType) return;

    setLoading(true);

    fetch(`${BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location,
        soilType,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          if (data.message) {
            alert("No data found for selected location and soil type.\nPlease try different options.");
            setResult([]);
          } else {
            setResult(data);
            setTimeout(() => {
              scrollRef.current?.scrollTo({ y: 650, animated: true });
            }, 300);
          }

          setLoading(false);
        })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const totalProfit = null;

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Soil Type Analyzer</Text>
      <Text style={styles.subtitle}>
        AI Powered Smart Crop Recommendation
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Select Location</Text>

        <View style={styles.wrap}>
          {locations.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                location === item.sub_zone_name && styles.activeChip,
              ]}
              onPress={() => setLocation(item.sub_zone_name)}
            >
              <Text
                style={[
                  styles.chipText,
                  location === item.sub_zone_name && styles.activeText,
                ]}
              >
                {item.sub_zone_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.heading}>Select Soil Type</Text>

        <View style={styles.wrap}>
          {soilTypes.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                soilType === item.soil_type && styles.activeChip,
              ]}
              onPress={() => setSoilType(item.soil_type)}
            >
              <Text
                style={[
                  styles.chipText,
                  soilType === item.soil_type && styles.activeText,
                ]}
              >
                {item.soil_type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.heading}>Field Area (Acres)</Text>

        <TextInput
         style={styles.input}
         value={fieldArea}
         onChangeText={(text) => setFieldArea(text.replace(/[^0-9.]/g, ""))}
         keyboardType="decimal-pad"
         placeholder="e.g. 2"
         placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.button} onPress={analyze}>
          <Text style={styles.buttonText}>Analyze Soil</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="green"
          style={{ marginTop: 20 }}
        />
      )}

{result.length > 0 &&
  result.map((item, index) => (
    <View key={index} style={styles.resultCard}>

      <View
        style={[
          styles.rankBadge,
          index === 0
            ? styles.firstBadge
            : index === 1
            ? styles.secondBadge
            : styles.thirdBadge,
        ]}
      >
        <Text style={styles.rankText}>
          {index === 0
            ? "#1 Best Choice"
            : index === 1
            ? "#2 Alternative"
            : `#${index + 1} Recommended`}
        </Text>
      </View>

      <Text style={styles.cropName}>
        {getCropEmoji(item.recommended_crop)} {item.recommended_crop}
      </Text>

      <View style={styles.profitBox}>
        <Text style={styles.profitLabel}>Total Profit</Text>
        <Text style={styles.profitValue}>
          Rs {(
            Number(item.profit) * Number(fieldArea)
          ).toLocaleString()}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Yield: {item.yield_maund} Maund
        </Text>

        <Text style={styles.infoText}>
          Price: Rs {item.price}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          Cost: Rs {item.cost}
        </Text>

        <Text style={styles.infoText}>
          Per Acre: Rs {item.profit}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Nutrients
      </Text>

      <View style={styles.npkRow}>
        <View style={styles.npkChip}>
          <Text style={styles.npkText}>
            N {item.n_min}
          </Text>
        </View>

        <View style={styles.npkChip}>
          <Text style={styles.npkText}>
            P {item.p_min}
          </Text>
        </View>

        <View style={styles.npkChip}>
          <Text style={styles.npkText}>
            K {item.k_min}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Climate Requirements
      </Text>

      <Text style={styles.resultText}>
        🌡 Temprature: {item.Temp_Min}°C - {item.Temp_Max}°C
      </Text>

      <Text style={styles.resultText}>
        💧 Humidity: {item.Humidity_Min}% - {item.Humidity_Max}%
      </Text>

      <Text style={styles.resultText}>
        🌧 Rainfall: {item.Rain_Min}mm - {item.Rain_Max}mm
      </Text>

      <View style={styles.insightBox}>
        
        <View style={styles.tipWrap}>
    <Feather
      name="info"
      size={18}
      color="#2d6a4f"
      style={styles.tipIcon}
    />

    <Text style={styles.insightText}>
      {Number(item.n_min) >= 40
        ? "Leaf growth can be very good. "
        : Number(item.n_min) >= 30
        ? "Leaf growth can be normal. "
        : "Leaf growth may stay weak. "}

      {Number(item.p_min) >= 15
        ? "Roots can become strong. "
        : Number(item.p_min) >= 10
        ? "Roots growth can be normal. "
        : "Roots may stay weak. "}

      {Number(item.k_min) >= 120
        ? "Plant strength can be very good."
        : Number(item.k_min) >= 100
        ? "Plant strength can be normal."
        : "Plant strength may be low."}
    </Text>

  </View>
  </View>
</View>
))}
{result.length > 0 && (
  <View style={styles.npkInfoCard}>
    <Text style={styles.npkInfoTitle}>
       Help!
    </Text>

    <Text style={styles.npkInfoText}>
      N = Nitrogen → Helps leaf growth and green color.
    </Text>

    <Text style={styles.npkInfoText}>
      P = Phosphorus → Supports root development and flowering.
    </Text>

    <Text style={styles.npkInfoText}>
      K = Potassium → Improves strength, fruit quality and disease resistance.
    </Text>

    <Text style={styles.npkInfoText}>
      Balanced NPK values can increase yield, improve plant health and produce stronger crops.
    </Text>
  </View>
)}
    </ScrollView>
</KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f4f7f8",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0b7a36",
    marginTop: 35,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#222",
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#e7ecef",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 25,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: "#0b7a36",
  },

  chipText: {
    color: "#333",
    fontSize: 13,
  },

  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
  },

  button: {
    backgroundColor: "#0b7a36",
    padding: 15,
    borderRadius: 14,
    marginTop: 22,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0b7a36",
    marginBottom: 12,
  },

  resultText: {
    fontSize: 15,
    marginBottom: 8,
    color: "#222",
  },

  rankBadge: {
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 10,
  marginBottom: 14,
},

firstBadge: {
  backgroundColor: "#198754",
},

secondBadge: {
  backgroundColor: "#f39c12",
},

thirdBadge: {
  backgroundColor: "#3498db",
},

rankText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
},

cropName: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#14532d",
  marginBottom: 15,
},

profitBox: {
  backgroundColor: "#fff7d6",
  padding: 15,
  borderRadius: 14,
  marginBottom: 15,
},

profitLabel: {
  fontSize: 14,
  color: "#555",
},

profitValue: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#1b5e20",
  marginTop: 4,
},

infoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 10,
},

infoText: {
  fontSize: 15,
  color: "#333",
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 14,
  marginBottom: 10,
  color: "#222",
},

npkRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12,
},

npkChip: {
  backgroundColor: "#e8f5e9",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 10,
},

npkText: {
  fontWeight: "bold",
  fontSize: 16,
  color: "#1b5e20",
},

npkInfoCard: {
  backgroundColor: "#eef7ee",
  padding: 18,
  borderRadius: 16,
  marginTop: 15,
  marginBottom: 25,
},

npkInfoTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#14532d",
  marginBottom: 10,
},

npkInfoText: {
  fontSize: 14,
  color: "#333",
  lineHeight: 22,
  marginBottom: 6,
},

insightBox: {
  backgroundColor: "#eef8ee",
  borderLeftWidth: 5,
  borderLeftColor: "#16a34a",
  paddingTop: 14,
  paddingBottom: 16,
  paddingHorizontal: 14,
  borderRadius: 14,
  marginTop: 14,
  overflow: "visible",
},

insightTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#14532d",
  marginBottom: 8,
},

tipWrap: {
  position: "relative",
  paddingLeft: 34,
  width: "100%",
},

tipIcon: {
  position: "absolute",
  left: 0,
  top: 2,

},

insightText: {
  fontSize: 14,
  color: "#333",
  lineHeight: 28,
  flexShrink: 1,
},
});