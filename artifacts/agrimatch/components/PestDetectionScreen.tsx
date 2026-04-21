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
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { PESTS } from "@/constants/data";

export default function PestDetectionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [selectedPest, setSelectedPest] = useState<typeof PESTS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const styles = makeStyles(colors);
  const filters = ["All", "High", "Medium", "Critical"];

  const filteredPests = activeFilter === "All"
    ? PESTS
    : PESTS.filter(p => p.severity === activeFilter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "#7A4B2A";
      case "High": return colors.danger;
      case "Medium": return colors.warning;
      default: return colors.textLight;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Pest Detection</Text>
      <Text style={styles.subtitle}>Identify and manage common agricultural pests across Pakistan</Text>

      <View style={styles.alertBanner}>
        <Feather name="alert-triangle" size={16} color={colors.warning} />
        <Text style={styles.alertText}>Early detection prevents up to 80% of crop loss. Check your fields weekly during peak season.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => setActiveFilter(f)} style={[styles.filterChip, activeFilter === f && { backgroundColor: getSeverityColor(f) }]}>
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
              {f === "All" ? "All Pests" : `${f} Risk`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredPests.map((pest) => (
        <TouchableOpacity
          key={pest.id}
          style={[styles.pestCard, selectedPest?.id === pest.id && styles.pestCardSelected]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedPest(selectedPest?.id === pest.id ? null : pest);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.pestHeader}>
            <View style={[styles.pestIconWrap, { backgroundColor: pest.color + "22" }]}>
              <Text style={styles.pestEmoji}>{pest.emoji}</Text>
            </View>
            <View style={styles.pestInfo}>
              <Text style={styles.pestName}>{pest.name}</Text>
              <Text style={styles.pestAffected}>Affects: {pest.affected.join(", ")}</Text>
            </View>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(pest.severity) }]}>
              <Text style={styles.severityText}>{pest.severity}</Text>
            </View>
          </View>

          {selectedPest?.id === pest.id && (
            <View style={styles.pestDetail}>
              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Feather name="eye" size={14} color={colors.primaryMid} />
                  <Text style={styles.detailSectionTitle}>Identification</Text>
                </View>
                <Text style={styles.detailText}>{pest.description}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Feather name="tool" size={14} color={colors.warning} />
                  <Text style={styles.detailSectionTitle}>Treatment</Text>
                </View>
                <Text style={styles.detailText}>{pest.treatment}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Feather name="shield" size={14} color={colors.success} />
                  <Text style={styles.detailSectionTitle}>Prevention</Text>
                </View>
                <Text style={styles.detailText}>{pest.prevention}</Text>
              </View>
            </View>
          )}

          <View style={styles.pestFooter}>
            <Feather name={selectedPest?.id === pest.id ? "chevron-up" : "chevron-down"} size={16} color={colors.textLight} />
            <Text style={styles.tapText}>{selectedPest?.id === pest.id ? "Tap to collapse" : "Tap for details & treatment"}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.reportSection}>
        <Feather name="map-pin" size={20} color={colors.primaryMid} />
        <View style={styles.reportText}>
          <Text style={styles.reportTitle}>Report a Pest Sighting</Text>
          <Text style={styles.reportDesc}>Help other farmers by reporting pest activity in your area through the Submit Data section.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 6, paddingTop: 16 },
    subtitle: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", marginBottom: 16, lineHeight: 19 },
    alertBanner: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#FFF8F0", borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: colors.warning },
    alertText: { flex: 1, fontSize: 13, color: colors.soilMid, fontFamily: "Inter_400Regular", lineHeight: 18 },
    filterScroll: { marginBottom: 16 },
    filterChip: { backgroundColor: colors.primaryGhost, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1.5, borderColor: "transparent" },
    filterChipText: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_500Medium" },
    filterChipTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
    pestCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1.5, borderColor: "transparent" },
    pestCardSelected: { borderColor: colors.primaryLight },
    pestHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
    pestIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    pestEmoji: { fontSize: 22 },
    pestInfo: { flex: 1 },
    pestName: { fontSize: 15, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold" },
    pestAffected: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular", marginTop: 2 },
    severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    severityText: { fontSize: 11, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    pestDetail: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
    detailSection: { marginBottom: 12 },
    detailSectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
    detailSectionTitle: { fontSize: 13, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold" },
    detailText: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", lineHeight: 19 },
    divider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
    pestFooter: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
    tapText: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular" },
    reportSection: { flexDirection: "row", alignItems: "flex-start", gap: 14, backgroundColor: colors.primaryGhost, borderRadius: 16, padding: 20, marginTop: 8, marginBottom: 20 },
    reportText: { flex: 1 },
    reportTitle: { fontSize: 15, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 4 },
    reportDesc: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", lineHeight: 19 },
  });
}
