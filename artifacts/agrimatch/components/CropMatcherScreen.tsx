import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import "../i18n";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CROPS_DATABASE } from "@/constants/data";

export default function CropMatcherScreen() {
  const { t, i18n } = useTranslation();
  const filterScrollRef = useRef<ScrollView>(null);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [selectedCrop, setSelectedCrop] = useState<typeof CROPS_DATABASE[0] | null>(null);
  const [filterSeason, setFilterSeason] = useState("All");

  const styles = makeStyles(colors);
  const seasons = ["All", "Rabi", "Kharif", "Summer", "Annual"];

  const filteredCrops = filterSeason === "All"
    ? CROPS_DATABASE
    : CROPS_DATABASE.filter(c => c.season === filterSeason);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text 
        style={[
          styles.title,
          i18n.language === "ur" && styles.titleUrdu,
          ]}
      >
            {t("cropCompatibilityMatcher")}
      </Text>
      <Text 
        style={[
          styles.subtitle,
          i18n.language === "ur" && styles.subtitleUrdu,
          ]}>
        {t("cropCompatibilitySubtitle")}
      </Text>

      <ScrollView
        ref={filterScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={[
          styles.filterContent,
          i18n.language === "ur" && styles.filterContentUrdu,
        ]}
        onContentSizeChange={() => {
          if (i18n.language === "ur") {
            filterScrollRef.current?.scrollToEnd({
              animated: false,
            });
          }
        }}
      >
        {seasons.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setFilterSeason(s)}
            style={[
              styles.filterChip,
              i18n.language === "ur" && styles.filterChipUrdu,
              filterSeason === s && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                i18n.language === "ur" && styles.filterChipTextUrdu,
                filterSeason === s && styles.filterChipTextActive,
              ]}
            >
              {t(s)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View 
        style={[
          styles.cropGrid,
          i18n.language === "ur" && styles.cropGridUrdu
          ]}>
        {filteredCrops.map((crop) => (
          <TouchableOpacity
            key={crop.name}
            style={[styles.cropCard, selectedCrop?.name === crop.name && styles.cropCardSelected]}
            onPress={() => setSelectedCrop(selectedCrop?.name === crop.name ? null : crop)}
            activeOpacity={0.8}
          >
            <Image
              source={crop.icon}
              style={styles.cropImage}
              resizeMode="contain"
            />
            <Text style={styles.cropName}>
              {i18n.language === "ur"
                ? t(crop.name, { defaultValue: crop.name })
                : crop.name}
            </Text>
            <View style={[styles.seasonBadge, { backgroundColor: getSeasonColor(crop.season, colors) + "22" }]}>
              <Text style={[styles.seasonText, { color: getSeasonColor(crop.season, colors) }]}>{t(crop.season)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCrop && (
        <View style={styles.detailCard}>
          <View
            style={[
              styles.detailHeader,
              i18n.language === "ur" && styles.detailHeaderUrdu,
            ]}
          >
            <Image
              source={selectedCrop.icon}
              style={styles.detailImage}
              resizeMode="contain"
            />
            <View
              style={[
                styles.detailTitle,
                i18n.language === "ur" && styles.detailTitleUrdu,
              ]}
            >
              <Text
                style={[
                  styles.detailName,
                  i18n.language === "ur" && styles.detailTextUrdu,
                ]}
              >
                {i18n.language === "ur"
                ? t(selectedCrop.name, {
                    defaultValue: selectedCrop.name,
                  })
                : selectedCrop.name}
              </Text>
              <Text
                style={[
                  styles.detailSeason,
                  i18n.language === "ur" && styles.detailTextUrdu,
                ]}
              >
                {t(selectedCrop.season)} {t("crop")}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedCrop(null)}>
              <Feather name="x" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View 
            style={[
              styles.detailGrid,
              i18n.language === "ur" && styles.detailGridUrdu
              ]}>
            <DetailItem
              icon="layers"
              label={t("bestSoils")}
              value={selectedCrop.soils
                .map((soil) => t(soil, { defaultValue: soil }))
                .join(i18n.language === "ur" ? "، " : ", ")}
              colors={colors}
              isUrdu={i18n.language === "ur"}
            />
          
            <DetailItem
              icon="droplet"
              label={t("optimalPh")}
              value={selectedCrop.ph}
              colors={colors}
              isUrdu={i18n.language === "ur"}
            />
          
            <DetailItem
              icon="cloud-rain"
              label={t("waterNeed")}
              value={t(selectedCrop.water, {
                defaultValue: selectedCrop.water,
              })}
              colors={colors}
              isUrdu={i18n.language === "ur"}
            />
          
            <DetailItem
              icon="dollar-sign"
              label={t("estimatedIncome")}
              value={
                i18n.language === "ur"
                  ? selectedCrop.income.ur
                  : selectedCrop.income.en
              }
              colors={colors}
              isHighlight
              isUrdu={i18n.language === "ur"}
            />
          </View>

          <Text
            style={[
              styles.detailSectionLabel,
              i18n.language === "ur" && styles.detailTextUrdu,
            ]}
          >
            {t("compatibleSoilTypes")}</Text>
            {selectedCrop.soils.map((soil, i) => (
            <View
              key={i}
              style={[
                styles.soilRow,
                i18n.language === "ur" && styles.soilRowUrdu,
              ]}
            >
              <View style={[styles.soilIndicator, { backgroundColor: getSoilColor(soil, colors) }]} />
              <Text
                style={[
                  styles.soilName,
                  i18n.language === "ur" && styles.soilNameUrdu,
                ]}
              >
                {i18n.language === "ur"
                  ? t(soil, { defaultValue: soil })
                  : soil}
              </Text>
              <View style={styles.soilBarTrack}>
                <View style={[styles.soilBarFill, { width: `${90 - i * 8}%`, backgroundColor: getSoilColor(soil, colors) }]} />
              </View>
              <Text
                style={[
                  styles.soilPct,
                  { color: getSoilColor(soil, colors) },
                  i18n.language === "ur" && styles.soilPctUrdu,
                ]}
              >
                {90 - i * 8}%</Text>
            </View>
          ))}

          <View
            style={[
              styles.tipBox,
              i18n.language === "ur" && styles.tipBoxUrdu,
            ]}
          >
            <Feather name="info" size={14} color={colors.primaryMid} style={{ marginTop: 2 }} />
            <Text
              style={[
                styles.tipText,
                i18n.language === "ur" && styles.tipTextUrdu,
              ]}
            >
              {t("cropMatcherTip", {
                crop: t(selectedCrop.name, {
                  defaultValue: selectedCrop.name,
                }),
            
                soil: t(selectedCrop.soils[0], {
                  defaultValue: selectedCrop.soils[0],
                }),
            
                ph: selectedCrop.ph,
            
                water: t(selectedCrop.water, {
                  defaultValue: selectedCrop.water,
                }),
              })}
            </Text>
          </View>
        </View>
      )}

      {!selectedCrop && (
        <View style={styles.placeholder}>
          <Feather name="git-merge" size={36} color={colors.primaryPale} />
          <Text style={styles.placeholderText}>{t("cropMatcherPlaceholder")}</Text>
        </View>
      )}
    </ScrollView>
  );
}

function DetailItem({
  icon,
  label,
  value,
  colors,
  isHighlight,
  isUrdu,
}: any) {
  return (
    <View
      style={{
        backgroundColor: isHighlight
          ? colors.primaryGhost
          : colors.muted,
        borderRadius: 10,
        padding: 12,
        gap: 4,
        minWidth: "47%",
        alignItems: isUrdu ? "flex-end" : "flex-start",
      }}
    >
      <Feather
        name={icon}
        size={14}
        color={isHighlight ? colors.primaryMid : colors.textLight}
      />

      <Text
        style={{
          fontSize: 11,
          color: colors.textLight,
          fontFamily: "Inter_400Regular",
          textAlign: isUrdu ? "right" : "left",
          writingDirection: isUrdu ? "rtl" : "ltr",
          width: "100%",
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: isHighlight ? colors.primaryMid : colors.text,
          fontFamily: "Inter_600SemiBold",
          textAlign: isUrdu ? "right" : "left",
          writingDirection: isUrdu ? "rtl" : "ltr",
          width: "100%",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function getSeasonColor(season: string, colors: any) {
  switch (season) {
    case "Rabi": return colors.primaryMid;
    case "Kharif": return colors.warning;
    case "Summer": return colors.danger;
    case "Annual": return colors.gold;
    default: return colors.textMid;
  }
}

function getSoilColor(soil: string, colors: any) {
  switch (soil) {
    case "Sandy": return colors.soilLight;
    case "Loamy": return colors.primaryLight;
    case "Clay": return colors.soilMid;
    case "Silt Loam": return colors.primaryMid;
    case "Sandy Loam": return colors.soilLight;
    case "Clay Loam": return colors.soilDark;
    default: return colors.primaryLight;
  }
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 6, paddingTop: 16 },
    subtitle: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", marginBottom: 16, lineHeight: 19 },
    filterScroll: { marginBottom: 16 },
    filterChip: {
      backgroundColor: colors.primaryGhost,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 75,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "transparent",
    },  
    filterChipActive: { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
    filterChipText: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_500Medium" },
    filterChipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
    cropGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    cropCard: { width: "30%", backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: "center", gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 2, borderColor: "transparent" },
    cropCardSelected: { borderColor: colors.primaryMid, backgroundColor: colors.primaryGhost },
    cropImage: { 
      width: 55,
      height: 55, },
    cropName: { fontSize: 13, fontWeight: "600", color: colors.text, fontFamily: "Inter_600SemiBold", textAlign: "center" },
    seasonBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    seasonText: { fontSize: 10, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
    detailCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4, marginBottom: 20 },
    detailHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 14 },
    detailImage: {
      width: 70,
      height: 70,
    },
    detailTitle: { flex: 1 },
    detailName: { fontSize: 20, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold" },
    detailSeason: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular" },
    detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    detailSectionLabel: { fontSize: 14, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold", marginBottom: 12 },
    soilRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
    soilIndicator: { width: 10, height: 10, borderRadius: 5 },
    soilName: { width: 80, fontSize: 13, color: colors.text, fontFamily: "Inter_400Regular" },
    soilBarTrack: { flex: 1, height: 6, backgroundColor: colors.primaryGhost, borderRadius: 3, overflow: "hidden" },
    soilBarFill: { height: 6, borderRadius: 3 },
    soilPct: { width: 35, fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "right" },
    tipBox: { flexDirection: "row", gap: 10, backgroundColor: colors.primaryGhost, borderRadius: 12, padding: 14 },
    tipText: { flex: 1, fontSize: 13, color: colors.text, fontFamily: "Inter_400Regular", lineHeight: 19 },
    placeholder: { backgroundColor: colors.card, borderRadius: 16, padding: 40, alignItems: "center", borderWidth: 2, borderStyle: "dashed", borderColor: colors.primaryPale, gap: 16 },
    placeholderText: { fontSize: 14, color: colors.textLight, textAlign: "center", lineHeight: 20, fontFamily: "Inter_400Regular" },
    titleUrdu: {
      textAlign: "right",
      writingDirection: "rtl",
      lineHeight: 42,
    },
    
    subtitleUrdu: {
      textAlign: "right",
      writingDirection: "rtl",
      lineHeight: 28,
    },
    
    filterContent: {
      flexDirection: "row",
      paddingRight: 10,
    },
    
    filterContentUrdu: {
      flexDirection: "row-reverse",
      paddingLeft: 10,
      paddingRight: 0,
    },
    filterChipUrdu: {
      minWidth: 85,
    },
    
    filterChipTextUrdu: {
      textAlign: "center",
      writingDirection: "rtl",
    },
    cropGridUrdu: {
      flexDirection: "row-reverse",
    },
    detailHeaderUrdu: {
  flexDirection: "row-reverse",
},

detailTitleUrdu: {
  alignItems: "flex-end",
},

detailTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

soilRowUrdu: {
  flexDirection: "row-reverse",
},

soilNameUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

soilPctUrdu: {
  textAlign: "left",
},

tipBoxUrdu: {
  flexDirection: "row-reverse",
},

tipTextUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},
detailGridUrdu: {
  flexDirection: "row-reverse",
},
  });
}
