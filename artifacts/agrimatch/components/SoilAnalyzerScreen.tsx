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
 Keyboard,
 RefreshControl
} from "react-native";
import { CROPS_DATABASE } from "@/constants/data";
import { Feather } from "@expo/vector-icons";
import "../i18n";
import { useTranslation } from "react-i18next";
import colors from "@/constants/colors";

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

  ph_min: number;
  ph_max: number;

  temp_min: number;
  temp_max: number;

  rain_min: number;
  rain_max: number;

  soil_type?: string;
};
type InsightItemProps = {
  title: string;
  description: string;
  isUrdu: boolean;
};

const InsightItem = ({
  title,
  description,
  isUrdu,
}: InsightItemProps) => {
  return (
    <View
      style={[
        styles.insightItem,
        isUrdu && styles.insightItemUrdu,
      ]}
    >
      <View style={styles.insightCheckCircle}>
        <Text style={styles.insightCheckText}>✓</Text>
      </View>

      <Text
        style={[
          styles.insightLineText,
          isUrdu && styles.insightLineTextUrdu,
        ]}
      >
        <Text style={styles.insightLineTitle}>{title}: </Text>
        {description}
      </Text>
    </View>
  );
};

export default function SoilAnalyzerScreen() {

  const { t, i18n } = useTranslation();

  const BASE_URL = "https://agrimatch-backend-9sx8.onrender.com";

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [soilTypes, setSoilTypes] = useState<SoilTypeItem[]>([]);

  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [fieldArea, setFieldArea] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

if (!location && !soilType && !fieldArea) {
  alert(t("alertAll"));
  return;
}

if (!location && !soilType) {
  alert(t("alertLocationSoil"));
  return;
}

if (!location && !fieldArea) {
  alert(t("alertLocationArea"));
  return;
}

if (!soilType && !fieldArea) {
  alert(t("alertSoilArea"));
  return;
}

if (!location) {
  alert(t("alertLocation"));
  return;
}

if (!soilType) {
  alert(t("alertSoil"));
  return;
}

if (!fieldArea) {
  alert(t("alertArea"));
  return;
}

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

      setResult(data);

      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: 650,
          animated: true,
        });
      }, 300);

      setLoading(false);

    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
};
  const onRefresh = () => {
    
    Keyboard.dismiss();
    setRefreshing(true);

    setLocation("");
    setSoilType("");
    setResult([]);
    setSoilTypes([]);      
    setFieldArea("");

    fetch(`${BASE_URL}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data));

    fetch(`${BASE_URL}/soiltypes`)
      .then((res) => res.json())
      .then((data) => setSoilTypes(data));

    setRefreshing(false);

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
      onScrollBeginDrag={() => Keyboard.dismiss()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["green"]}
        />
      }
    >
      <Text
        style={[
          styles.title,
          i18n.language === "ur" && styles.rtlText,
        ]}
      >
        {t("title")}
      </Text>

      <Text
        style={[
          styles.subtitle,
          i18n.language === "ur" && styles.rtlText,
        ]}
      >
        {t("subtitle")}
      </Text>
      <View style={styles.card}>
      <Text
        style={[
          styles.heading,
          i18n.language === "ur" && styles.rtlText,
        ]}
      >
        {t("location")}
      </Text>

        <View
          style={[
            styles.wrap,
            i18n.language === "ur" && styles.wrapUrdu,
          ]}
        >
          {locations.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                location === item.sub_zone_name && styles.activeChip,
              ]}
              onPress={() => {

                setLocation(item.sub_zone_name);

                fetch(`${BASE_URL}/soiltypes/${item.sub_zone_name}`)
                  .then((res) => res.json())
                  .then((data) => {

                    setSoilTypes(data);

                    // previous selected soil clear
                    setSoilType("");

                  })
                  .catch((err) => console.log(err));

              }}
            >
              <Text
                style={[
                  styles.chipText,
                  location === item.sub_zone_name && styles.activeText,
                ]}
              >
                {i18n.language === "ur"
                  ? t(item.sub_zone_name, {
                    defaultValue: item.sub_zone_name,
                  })
                : item.sub_zone_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.heading,
            i18n.language === "ur" && styles.rtlText,
          ]}
        >
          {t("soil")}
        </Text>

        <View
          style={[
            styles.wrap,
            i18n.language === "ur" && styles.wrapUrdu,
          ]}
        >
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
                {i18n.language === "ur"
                  ? t(item.soil_type, {
                      defaultValue: item.soil_type,
                    })
                  : item.soil_type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={[
            styles.heading,
            i18n.language === "ur" && styles.rtlText,
          ]}
        >
          {t("area")}
        </Text>

        <TextInput
  style={[
      styles.input,
      i18n.language === "ur" && styles.inputUrdu,
    ]}
    value={fieldArea}
    onChangeText={(text) => setFieldArea(text.replace(/[^0-9.]/g, ""))}
    keyboardType="decimal-pad"
    placeholder={t("areaPlaceholder")}
    placeholderTextColor="#999"
  />
        <TouchableOpacity style={styles.button} onPress={analyze}>
          <Text style={styles.buttonText}>{t("analyze")}</Text>
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
  result.map((item, index) => {
    const area = Number(fieldArea || 1);

    const profitPerAcre =
      Number(item.yield_maund) * Number(item.price) -
      Number(item.cost);

    const totalProfit = profitPerAcre * area;

    return (
      <View key={index} style={styles.resultCard}>
        {/* Rank Badge */}
        <View
          style={[
            styles.rankBadge,
            index === 0
              ? styles.firstBadge
              : index === 1
              ? styles.secondBadge
              : styles.thirdBadge,
        
            i18n.language === "ur" && styles.rankBadgeUrdu,
          ]}
        >
          <Text
            style={[
              styles.rankText,
              i18n.language === "ur" && styles.rankTextUrdu,
            ]}
          >
            {index === 0
              ? `🏆 ${t("bestChoice")}`
              : index === 1
              ? t("alternative")
              : `#${index + 1} ${t("recommended")}`}
          </Text>
        </View>

        {/* Crop Header */}
        <View
          style={[
            styles.cropHeader,
            i18n.language === "ur" && styles.cropHeaderUrdu,
          ]}
        >
          <Text style={styles.mainCropEmoji}>
            {getCropEmoji(item.recommended_crop)}
          </Text>

          <View
            style={[
              styles.cropHeaderText,
              i18n.language === "ur" && styles.cropHeaderTextUrdu,
            ]}
          >
            <Text
              style={[
                styles.mainCropName,
                i18n.language === "ur" && styles.mainCropNameUrdu,
              ]}
            >
              {i18n.language === "ur"
                ? t(item.recommended_crop, {
                    defaultValue: item.recommended_crop,
                  })
                : item.recommended_crop}
            </Text>

            <Text
              style={[
                styles.cropSuitableText,
                i18n.language === "ur" && styles.rtlText,
              ]}
            >
              {t("suitableForSelectedSoilLocation")}
            </Text>
          </View>
        </View>

        {/* Total Profit */}
        <View
          style={[
            styles.totalProfitCard,
            i18n.language === "ur" && styles.totalProfitCardUrdu,
          ]}
        >
          <View style={styles.profitIconCircle}>
            <Text style={styles.profitIcon}>💰</Text>
          </View>

          <View
            style={[
              styles.totalProfitTextWrap,
              i18n.language === "ur" && styles.totalProfitTextWrapUrdu,
            ]}
          >
            <Text
              style={[
                styles.totalProfitLabel,
                i18n.language === "ur" && styles.rtlText,
              ]}
            >
              {t("totalProfit")}
            </Text>

            <Text
              style={[
                styles.totalProfitValue,
                i18n.language === "ur" && styles.totalProfitValueUrdu,
              ]}
            >
              Rs {totalProfit.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Financial Details */}
        <View
  style={[
    styles.financialGrid,
    i18n.language === "ur" && styles.financialGridUrdu,
  ]}
>
  {/* Yield */}
  <View
    style={[
      styles.financialItem,
      i18n.language === "ur" && styles.financialItemUrdu,
    ]}
  >
    <View style={styles.financialIconGreen}>
      <Text style={styles.financialIconText}>🌱</Text>
    </View>

    <View
      style={[
        styles.financialTextWrap,
        i18n.language === "ur" && styles.financialTextWrapUrdu,
      ]}
    >
      <Text
        style={[
          styles.financialLabel,
          i18n.language === "ur" && styles.financialLabelUrdu,
        ]}
      >
        {t("yield")}
      </Text>

      <Text
        style={[
          styles.financialValue,
          i18n.language === "ur" && styles.financialValueUrdu,
        ]}
      >
        {item.yield_maund} {t("maund")}
      </Text>
    </View>
  </View>

  {/* Price */}
  <View
    style={[
      styles.financialItem,
      i18n.language === "ur" && styles.financialItemUrdu,
    ]}
  >
    <View style={styles.financialIconBlue}>
      <Text style={styles.financialIconText}>🏷️</Text>
    </View>

    <View
      style={[
        styles.financialTextWrap,
        i18n.language === "ur" && styles.financialTextWrapUrdu,
      ]}
    >
      <Text
        style={[
          styles.financialLabel,
          i18n.language === "ur" && styles.financialLabelUrdu,
        ]}
      >
        {t("price")}
      </Text>

      <Text
        style={[
          styles.financialValue,
          i18n.language === "ur" && styles.financialValueUrdu,
        ]}
      >
        Rs {Number(item.price).toLocaleString()} / {t("maund")}
      </Text>
    </View>
  </View>

  {/* Cost */}
  <View
    style={[
      styles.financialItem,
      i18n.language === "ur" && styles.financialItemUrdu,
    ]}
  >
    <View style={styles.financialIconOrange}>
      <Text style={styles.financialIconText}>👛</Text>
    </View>

    <View
      style={[
        styles.financialTextWrap,
        i18n.language === "ur" && styles.financialTextWrapUrdu,
      ]}
    >
      <Text
        style={[
          styles.financialLabel,
          i18n.language === "ur" && styles.financialLabelUrdu,
        ]}
      >
        {t("cost")}
      </Text>

      <Text
        style={[
          styles.financialValue,
          i18n.language === "ur" && styles.financialValueUrdu,
        ]}
      >
        Rs {Number(item.cost).toLocaleString()}
      </Text>
    </View>
  </View>

  {/* Profit Per Acre */}
  <View
    style={[
      styles.financialItem,
      i18n.language === "ur" && styles.financialItemUrdu,
    ]}
  >
    <View style={styles.financialIconGreen}>
      <Text style={styles.financialIconText}>📈</Text>
    </View>

    <View
      style={[
        styles.financialTextWrap,
        i18n.language === "ur" && styles.financialTextWrapUrdu,
      ]}
    >
      <Text
        style={[
          styles.financialLabel,
          i18n.language === "ur" && styles.financialLabelUrdu,
        ]}
      >
        {t("profitPerAcre")}
      </Text>

      <Text
        style={[
          styles.financialValue,
          i18n.language === "ur" && styles.financialValueUrdu,
        ]}
      >
        Rs {profitPerAcre.toLocaleString()}
      </Text>
    </View>
  </View>
</View>

        <View style={styles.mainDivider} />

        {/* Growing Conditions Heading */}
        <View
          style={[
            styles.sectionHeadingRow,
            i18n.language === "ur" && styles.sectionHeadingRowUrdu,
          ]}
        >
          <Text style={styles.sectionHeadingIcon}>🌿</Text>

          <Text
            style={[
              styles.greenSectionTitle,
              i18n.language === "ur" && styles.rtlText,
            ]}
          >
            {t("growingConditions")}
          </Text>
        </View>

        {/* Growing Conditions Cards */}
        <View
          style={[
            styles.growingConditionsCard,
            i18n.language === "ur" && styles.growingConditionsCardUrdu,
          ]}
        >
          {/* Temperature */}
          <View style={styles.conditionColumn}>
            <Text style={styles.conditionIcon}>🌡️</Text>

            <Text
              style={[
                styles.conditionLabel,
                i18n.language === "ur" && styles.rtlText,
              ]}
            >
              {t("temperature")}
            </Text>

            <Text style={styles.conditionValue}>
              {item.temp_min}°C - {item.temp_max}°C
            </Text>

            <Text
              style={[
                styles.conditionDescription,
                i18n.language === "ur" && styles.conditionDescriptionUrdu,
              ]}
            >
              {t("temperatureShortDescription")}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          {/* Rainfall */}
          <View style={styles.conditionColumn}>
            <Text style={styles.conditionIcon}>🌧️</Text>

            <Text
              style={[
                styles.conditionLabel,
                i18n.language === "ur" && styles.rtlText,
              ]}
            >
              {t("rainfall")}
            </Text>

            <Text style={styles.conditionValue}>
              {item.rain_min}mm - {item.rain_max}mm
            </Text>

            <Text
              style={[
                styles.conditionDescription,
                i18n.language === "ur" && styles.conditionDescriptionUrdu,
              ]}
            >
              {t("rainfallShortDescription")}
            </Text>
          </View>

          <View style={styles.verticalDivider} />

          {/* Soil pH */}
          <View style={styles.conditionColumn}>
            <Text style={styles.conditionIcon}>🧪</Text>

            <Text
              style={[
                styles.conditionLabel,
                i18n.language === "ur" && styles.rtlText,
              ]}
            >
              {t("soilPh")}
            </Text>

            <Text style={styles.conditionValue}>
              {item.ph_min} - {item.ph_max}
            </Text>

            <Text
              style={[
                styles.conditionDescription,
                i18n.language === "ur" && styles.conditionDescriptionUrdu,
              ]}
            >
              {t("phShortDescription")}
            </Text>
          </View>
        </View>

        {/* Crop Insights Heading */}
        <View
          style={[
            styles.sectionHeadingRow,
            styles.cropInsightHeading,
            i18n.language === "ur" && styles.sectionHeadingRowUrdu,
          ]}
        >
          <Text style={styles.sectionHeadingIcon}>💡</Text>

          <Text
            style={[
              styles.greenSectionTitle,
              i18n.language === "ur" && styles.rtlText,
            ]}
          >
            {t("cropInsights")}
          </Text>
        </View>

        {/* Crop Insights Box */}
        <View
          style={[
            styles.cropInsightsBox,
            i18n.language === "ur" && styles.cropInsightsBoxUrdu,
          ]}
        >
          <View style={styles.insightsContent}>
            <InsightItem
              title={t("bestInSoil")}
              description={t("bestSoilInsight", {
                crop: t(item.recommended_crop, {
                  defaultValue: item.recommended_crop,
                }),
                soil: t(soilType, {
                  defaultValue: soilType,
                }),
              })}
              isUrdu={i18n.language === "ur"}
            />

            <InsightItem
              title={t("soilPh")}
              description={t("soilPhInsight", {
                min: item.ph_min,
                max: item.ph_max,
              })}
              isUrdu={i18n.language === "ur"}
            />

            <InsightItem
              title={t("temperature")}
              description={t("temperatureInsight", {
                min: item.temp_min,
                max: item.temp_max,
              })}
              isUrdu={i18n.language === "ur"}
            />

            <InsightItem
              title={t("rainfall")}
              description={t("rainfallInsight", {
                min: item.rain_min,
                max: item.rain_max,
              })}
              isUrdu={i18n.language === "ur"}
            />

            <InsightItem
              title={t("profitPotential")}
              description={t("profitPotentialInsight", {
                crop: t(item.recommended_crop, {
                  defaultValue: item.recommended_crop,
                }),
              })}
              isUrdu={i18n.language === "ur"}
            />
          </View>

          <Text style={styles.insightCropEmoji}>
            {getCropEmoji(item.recommended_crop)}
          </Text>
        </View>

        {/* Note */}
        <View
          style={[
            styles.resultNote,
            i18n.language === "ur" && styles.resultNoteUrdu,
          ]}
        >
          <View style={styles.noteIconCircle}>
            <Text style={styles.noteIcon}>★</Text>
          </View>

          <Text
            style={[
              styles.noteText,
              i18n.language === "ur" && styles.noteTextUrdu,
            ]}
          >
            <Text style={styles.noteBold}>{t("note")}: </Text>
            {t("resultNote")}
          </Text>
        </View>
      </View>
    );
  })}
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

firstBadge: {
  backgroundColor: "#198754",
},

secondBadge: {
  backgroundColor: "#f39c12",
},

thirdBadge: {
  backgroundColor: "#3498db",
},

cropName: {
  fontSize: 26,
  fontWeight: "bold",
  color: "#14532d",
  // marginBottom: 15,
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
insightBoxUrdu: {
  borderLeftWidth: 0,
  borderRightWidth: 5,
  borderRightColor: "#16a34a",
},

tipWrapUrdu: {
  paddingLeft: 0,
  paddingRight: 34,
},

tipIconUrdu: {
  left: undefined,
  right: 0,
},

insightTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
  width: "100%",
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
resultRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},

resultLabel: {
  fontSize: 16,
  color: "#333",
},

resultValue: {
 fontSize: 18,
  fontWeight: "700",
  marginTop: 4,
},
climateSectionUrdu: {
  alignItems: "flex-end",
},
climateItem: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 24,
},
climateInfo: {
  marginHorizontal: 10,
},
climateRow: {
  flexDirection: "row",
  alignItems: "baseline",
  marginBottom: 20,
},

climateIcon: {
  fontSize: 28,
  width: 36,
  textAlign: "center",
},
urduText: {
  textAlign: "right",
},

rtlText: {
  textAlign: "right",
  writingDirection: "rtl",
},

rtlRow: {
  flexDirection: "row-reverse",
},

rtlAlign: {
  alignItems: "flex-end",
},

cropNameUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

profitBoxUrdu: {
  alignItems: "flex-end",
},

infoTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

sectionTitleUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

npkInfoCardUrdu: {
  alignItems: "flex-end",
},

npkInfoTitleUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},

npkInfoTextUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},

cropRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginBottom: 15,
},

cropEmoji: {
  fontSize: 34,
},

cropRowUrdu: {
  justifyContent: "flex-end",
},
wrapUrdu: {
  flexDirection: "row-reverse",
  justifyContent: "flex-start",
},
inputUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},
rankTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},
profitLabelUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

profitValueUrdu: {
  textAlign: "right",
},
npkRowUrdu: {
  flexDirection: "row-reverse",
},
climateSection: {
  width: "100%",
  marginTop: 8,
},

climateRowEnglish: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 22,
},

climateIconEnglish: {
  width: 38,
  fontSize: 20,
  textAlign: "center",
  marginTop: 1,
},

climateTextEnglish: {
  flex: 1,
  alignItems: "flex-start",
},

climateLabelEnglish: {
  fontSize: 17,
  color: "#222",
  marginBottom: 4,
},

climateValueEnglish: {
  fontSize: 17,
  fontWeight: "700",
  color: colors.light.text,
},

climateRowUrdu: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "flex-start",
  paddingVertical: 12,
},

climateTextUrdu: {
  flex: 1,
  alignItems: "flex-end",
  paddingRight: 10,
},

climateLabelUrdu: {
  width: "100%",
  fontSize: 17,
  color: "#222",
  textAlign: "right",
  writingDirection: "rtl",
  marginBottom: 4,
},

climateValueUrdu: {
  fontSize: 17,
  fontWeight: "700",
  color: colors.light.text,
  textAlign: "right",
  writingDirection: "ltr",
},

climateIconUrdu: {
  width: 38,
  fontSize: 20,
  textAlign: "center",
  marginTop: 1,
},

climateDivider: {
  height: 1,
  backgroundColor: "#e5e7eb",
  width: "100%",
},

cropHeaderUrdu: {
  flexDirection: "row-reverse",
},

cropHeaderTextUrdu: {
  marginLeft: 0,
  marginRight: 14,
  alignItems: "flex-end",
},

mainCropNameUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},

totalProfitCardUrdu: {
  flexDirection: "row-reverse",
},

totalProfitTextWrapUrdu: {
  marginLeft: 0,
  marginRight: 18,
  alignItems: "flex-end",
},

totalProfitValueUrdu: {
  textAlign: "right",
},

financialGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

financialGridUrdu: {
  flexDirection: "row-reverse",
},


mainDivider: {
  width: "100%",
  height: 1,
  backgroundColor: "#d9dee2",
  marginTop: 3,
  marginBottom: 18,
},

sectionHeadingRowUrdu: {
  flexDirection: "row-reverse",
},

growingConditionsCardUrdu: {
  flexDirection: "row-reverse",
},

conditionDescriptionUrdu: {
  writingDirection: "rtl",
  textAlign: "center",
},

verticalDivider: {
  width: 1,
  backgroundColor: "#d2ded3",
  marginVertical: 3,
},

cropInsightsBoxUrdu: {
  flexDirection: "row-reverse",
},

insightsContent: {
  flex: 1,
  zIndex: 2,
},

insightItemUrdu: {
  flexDirection: "row-reverse",
},

insightLineTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
  marginRight: 10,
},

insightLineTitle: {
  fontWeight: "800",
},

resultNoteUrdu: {
  flexDirection: "row-reverse",
},


noteTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
  marginLeft: 0,
  marginRight: 12,
},

noteBold: {
  fontWeight: "800",
},
resultCard: {
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 14,
  marginTop: 20,
  marginBottom: 30,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
},

rankBadge: {
  alignSelf: "flex-start",
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 10,
  marginBottom: 8,
},

rankText: {
  color: "#fff",
  fontWeight: "800",
  fontSize: 14,
},

cropHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
  marginBottom: 14,
},

mainCropEmoji: {
  fontSize: 52,
  width: 82,
  textAlign: "center",
},

cropHeaderText: {
  flex: 1,
  marginLeft: 10,
},

mainCropName: {
  fontSize: 32,
  lineHeight: 38,
  fontWeight: "800",
  color: "#176b2d",
},

cropSuitableText: {
  fontSize: 14,
  lineHeight: 20,
  color: "#246b2d",
  marginTop: 3,
},

totalProfitCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f0f9ef",
  borderWidth: 1,
  borderColor: "#c9e6c7",
  borderRadius: 16,
  padding: 14,
  marginBottom: 18,
},

profitIconCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#dbeed9",
  justifyContent: "center",
  alignItems: "center",
},

profitIcon: {
  fontSize: 24,
},

totalProfitTextWrap: {
  flex: 1,
  marginLeft: 14,
},

totalProfitLabel: {
  fontSize: 15,
  color: "#333",
  marginBottom: 2,
},

totalProfitValue: {
  fontSize: 28,
  fontWeight: "800",
  color: "#176b2d",
},

financialItem: {
  width: "48%",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
},

financialIconGreen: {
  width: 44,
  height: 44,
  borderRadius: 11,
  backgroundColor: "#edf8ec",
  borderWidth: 1,
  borderColor: "#d6ead4",
  justifyContent: "center",
  alignItems: "center",
},

financialIconBlue: {
  width: 44,
  height: 44,
  borderRadius: 11,
  backgroundColor: "#e7f5ff",
  borderWidth: 1,
  borderColor: "#b7dcf7",
  justifyContent: "center",
  alignItems: "center",
},

financialIconOrange: {
  width: 44,
  height: 44,
  borderRadius: 11,
  backgroundColor: "#fff1e5",
  borderWidth: 1,
  borderColor: "#f3d1ad",
  justifyContent: "center",
  alignItems: "center",
},

financialIconText: {
  fontSize: 21,
},

financialTextWrap: {
  flex: 1,
  marginLeft: 9,
},

financialLabel: {
  fontSize: 13,
  color: "#222",
  marginBottom: 2,
},

financialValue: {
  fontSize: 15,
  fontWeight: "700",
  color: "#111",
},

sectionHeadingRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

sectionHeadingIcon: {
  fontSize: 22,
  marginRight: 8,
},

greenSectionTitle: {
  fontSize: 20,
  fontWeight: "800",
  color: "#176b2d",
},

growingConditionsCard: {
  flexDirection: "row",
  alignItems: "stretch",
  backgroundColor: "#f2f9f1",
  borderRadius: 16,
  paddingVertical: 14,
  paddingHorizontal: 4,
},

conditionColumn: {
  flex: 1,
  alignItems: "center",
  paddingHorizontal: 3,
},

conditionIcon: {
  fontSize: 27,
  marginBottom: 7,
},

conditionLabel: {
  fontSize: 13,
  color: "#222",
  textAlign: "center",
  marginBottom: 5,
},

conditionValue: {
  fontSize: 15,
  fontWeight: "800",
  color: "#111827",
  textAlign: "center",
  marginBottom: 6,
},

conditionDescription: {
  fontSize: 11,
  lineHeight: 15,
  color: "#333",
  textAlign: "center",
},

cropInsightHeading: {
  marginTop: 18,
},

cropInsightsBox: {
  flexDirection: "row",
  backgroundColor: "#fff9e9",
  borderWidth: 1,
  borderColor: "#f3dfab",
  borderRadius: 16,
  padding: 13,
},

insightItem: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 10,
},

insightCheckCircle: {
  width: 19,
  height: 19,
  borderRadius: 10,
  backgroundColor: "#20813b",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 1,
  marginRight: 8,
},

insightCheckText: {
  color: "#fff",
  fontSize: 11,
  fontWeight: "800",
},

insightLineText: {
  flex: 1,
  fontSize: 12,
  lineHeight: 18,
  color: "#222",
},

insightCropEmoji: {
  width: 70,
  alignSelf: "flex-end",
  fontSize: 55,
  textAlign: "center",
  marginLeft: 3,
  marginBottom: 8,
},

resultNote: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#e9f6e7",
  borderRadius: 14,
  padding: 10,
  marginTop: 9,
},

noteIconCircle: {
  width: 34,
  height: 34,
  borderRadius: 17,
  backgroundColor: "#218238",
  justifyContent: "center",
  alignItems: "center",
},

noteIcon: {
  color: "#fff",
  fontSize: 16,
},

noteText: {
  flex: 1,
  fontSize: 11,
  lineHeight: 16,
  color: "#222",
  marginLeft: 9,
},

rankBadgeUrdu: {
  alignSelf: "flex-end",
},
financialItemUrdu: {
  flexDirection: "row-reverse",
  justifyContent: "space-between",
},
financialTextWrapUrdu: {
  flex: 1,
  alignItems: "flex-end",
  paddingRight: 5,  
},
financialLabelUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},
financialValueUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},
});