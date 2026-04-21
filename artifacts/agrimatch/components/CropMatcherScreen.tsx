import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CROPS_DATABASE } from "@/constants/data";

export default function CropMatcherScreen() {
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
      <Text style={styles.title}>Crop Compatibility Matcher</Text>
      <Text style={styles.subtitle}>Select a crop to see which soil types are best suited for its cultivation in Pakistan</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {seasons.map(s => (
          <TouchableOpacity key={s} onPress={() => setFilterSeason(s)} style={[styles.filterChip, filterSeason === s && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, filterSeason === s && styles.filterChipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cropGrid}>
        {filteredCrops.map((crop) => (
          <TouchableOpacity
            key={crop.name}
            style={[styles.cropCard, selectedCrop?.name === crop.name && styles.cropCardSelected]}
            onPress={() => setSelectedCrop(selectedCrop?.name === crop.name ? null : crop)}
            activeOpacity={0.8}
          >
            <Text style={styles.cropEmoji}>{crop.emoji}</Text>
            <Text style={styles.cropName}>{crop.name}</Text>
            <View style={[styles.seasonBadge, { backgroundColor: getSeasonColor(crop.season, colors) + "22" }]}>
              <Text style={[styles.seasonText, { color: getSeasonColor(crop.season, colors) }]}>{crop.season}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCrop && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailEmoji}>{selectedCrop.emoji}</Text>
            <View style={styles.detailTitle}>
              <Text style={styles.detailName}>{selectedCrop.name}</Text>
              <Text style={styles.detailSeason}>{selectedCrop.season} Crop</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedCrop(null)}>
              <Feather name="x" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailGrid}>
            <DetailItem icon="layers" label="Best Soils" value={selectedCrop.soils.join(", ")} colors={colors} />
            <DetailItem icon="droplet" label="Optimal pH" value={selectedCrop.ph} colors={colors} />
            <DetailItem icon="cloud-rain" label="Water Need" value={selectedCrop.water} colors={colors} />
            <DetailItem icon="dollar-sign" label="Est. Income" value={selectedCrop.income} colors={colors} isHighlight />
          </View>

          <Text style={styles.detailSectionLabel}>Compatible Soil Types</Text>
          {selectedCrop.soils.map((soil, i) => (
            <View key={i} style={styles.soilRow}>
              <View style={[styles.soilIndicator, { backgroundColor: getSoilColor(soil, colors) }]} />
              <Text style={styles.soilName}>{soil}</Text>
              <View style={styles.soilBarTrack}>
                <View style={[styles.soilBarFill, { width: `${90 - i * 8}%`, backgroundColor: getSoilColor(soil, colors) }]} />
              </View>
              <Text style={[styles.soilPct, { color: getSoilColor(soil, colors) }]}>{90 - i * 8}%</Text>
            </View>
          ))}

          <View style={styles.tipBox}>
            <Feather name="info" size={14} color={colors.primaryMid} style={{ marginTop: 2 }} />
            <Text style={styles.tipText}>
              {selectedCrop.name} performs best in {selectedCrop.soils[0]} soil with a pH of {selectedCrop.ph}. Ensure adequate water availability ({selectedCrop.water}) for optimal yield.
            </Text>
          </View>
        </View>
      )}

      {!selectedCrop && (
        <View style={styles.placeholder}>
          <Feather name="git-merge" size={36} color={colors.primaryPale} />
          <Text style={styles.placeholderText}>Tap any crop above to see detailed soil compatibility and cultivation requirements</Text>
        </View>
      )}
    </ScrollView>
  );
}

function DetailItem({ icon, label, value, colors, isHighlight }: any) {
  return (
    <View style={{ backgroundColor: isHighlight ? colors.primaryGhost : colors.muted, borderRadius: 10, padding: 12, gap: 4, minWidth: "47%" }}>
      <Feather name={icon} size={14} color={isHighlight ? colors.primaryMid : colors.textLight} />
      <Text style={{ fontSize: 11, color: colors.textLight, fontFamily: "Inter_400Regular" }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "600", color: isHighlight ? colors.primaryMid : colors.text, fontFamily: "Inter_600SemiBold" }}>{value}</Text>
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
    filterChip: { backgroundColor: colors.primaryGhost, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1.5, borderColor: "transparent" },
    filterChipActive: { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
    filterChipText: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_500Medium" },
    filterChipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
    cropGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    cropCard: { width: "30%", backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: "center", gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 2, borderColor: "transparent" },
    cropCardSelected: { borderColor: colors.primaryMid, backgroundColor: colors.primaryGhost },
    cropEmoji: { fontSize: 30 },
    cropName: { fontSize: 13, fontWeight: "600", color: colors.text, fontFamily: "Inter_600SemiBold", textAlign: "center" },
    seasonBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    seasonText: { fontSize: 10, fontFamily: "Inter_600SemiBold", fontWeight: "600" },
    detailCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4, marginBottom: 20 },
    detailHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 14 },
    detailEmoji: { fontSize: 42 },
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
  });
}
