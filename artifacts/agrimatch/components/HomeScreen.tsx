import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { STATS } from "@/constants/data";

const LOGO = require("@/assets/images/Agrimatch-logo.png");

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 52 : Platform.OS === "ios" ? 0 : 30;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const quickActions = [
    { label: "Soil Analyzer", icon: "layers" as const, tab: "soil", color: colors.primaryMid },
    { label: "Crop Matcher", icon: "git-merge" as const, tab: "crops", color: colors.soilMid },
    { label: "Pest Detection", icon: "alert-circle" as const, tab: "pest", color: colors.danger },
    { label: "Income Calc", icon: "trending-up" as const, tab: "more", color: colors.gold },
  ];

  const styles = makeStyles(colors);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoSection}>
        <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.welcomeText}>Welcome to AgriMatch</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[styles.quickCard, { borderLeftColor: action.color }]}
            onPress={() => router.push(`/(tabs)/${action.tab}` as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.quickIcon, { backgroundColor: action.color + "22" }]}>
              <Feather name={action.icon} size={20} color={action.color} />
            </View>
            <Text style={styles.quickLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Live Statistics</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Registered Farmers" value={STATS.totalFarmers.toLocaleString()} icon="users" color={colors.primaryLight} colors={colors} />
        <StatCard label="Soil Samples" value={STATS.soilSamples.toLocaleString()} icon="database" color={colors.primaryMid} colors={colors} />
        <StatCard label="Recommendations" value={STATS.cropRecommendations.toLocaleString()} icon="check-circle" color={colors.success} colors={colors} />
        <StatCard label="Income Increase" value={`+${STATS.avgIncomeIncrease}%`} icon="trending-up" color={colors.gold} colors={colors} />
      </View>

      <Text style={styles.sectionTitle}>Province Highlights</Text>
      {STATS.provinceStats.map((p) => (
        <View key={p.province} style={styles.provinceRow}>
          <View style={[styles.provinceDot, { backgroundColor: p.color }]} />
          <View style={styles.provinceInfo}>
            <Text style={styles.provinceName}>{p.province}</Text>
            <Text style={styles.provinceDetail}>Top Crop: {p.topCrop}</Text>
          </View>
          <View style={styles.provinceSamples}>
            <Text style={styles.provinceCount}>{p.samples.toLocaleString()}</Text>
            <Text style={styles.provinceLabel}>samples</Text>
          </View>
        </View>
      ))}

      <View style={styles.howItWorks}>
        <Text style={styles.howTitle}>How AgriMatch Works</Text>
        {[
          { step: "1", text: "Submit soil sample data from your field", icon: "upload" as const },
          { step: "2", text: "AI classifies your soil type and composition", icon: "cpu" as const },
          { step: "3", text: "Algorithm matches best-fit crops to your soil", icon: "git-merge" as const },
          { step: "4", text: "Get income projections and farming tips", icon: "bar-chart-2" as const },
        ].map((item) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
            <Feather name={item.icon} size={16} color={colors.primaryLight} style={styles.stepIcon} />
            <Text style={styles.stepText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, icon, color, colors }: any) {
  return (
    <View style={[makeStyles(colors).statCard, { borderTopColor: color }]}>
      <Feather name={icon} size={18} color={color} />
      <Text style={[makeStyles(colors).statValue, { color }]}>{value}</Text>
      <Text style={makeStyles(colors).statLabel}>{label}</Text>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20 },
    logoSection: { alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 16 },
    logoImage: { width: 220, height: 110 },
    welcomeText: { marginTop: 4, fontSize: 24, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", textAlign: "center" },
    badge: { backgroundColor: colors.primaryGhost, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 6 },
    badgeText: { fontSize: 11, color: colors.primaryMid, fontFamily: "Inter_600SemiBold" },
    taglineRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20 },
    taglineDot: { fontSize: 12, fontWeight: "700", color: colors.primaryMid, fontFamily: "Inter_700Bold", letterSpacing: 1 },
    taglineSep: { fontSize: 14, color: colors.primaryPale, fontFamily: "Inter_400Regular" },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold", marginBottom: 14, marginTop: 4 },
    quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
    quickCard: { width: "47%", backgroundColor: colors.card, borderRadius: 14, padding: 16, borderLeftWidth: 4, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
    quickIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    quickLabel: { fontSize: 14, fontWeight: "600", color: colors.text, fontFamily: "Inter_600SemiBold" },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
    statCard: { width: "47%", backgroundColor: colors.card, borderRadius: 14, padding: 16, alignItems: "center", borderTopWidth: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, gap: 6 },
    statValue: { fontSize: 20, fontWeight: "700", fontFamily: "Inter_700Bold" },
    statLabel: { fontSize: 11, color: colors.textLight, fontFamily: "Inter_400Regular", textAlign: "center" },
    provinceRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    provinceDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
    provinceInfo: { flex: 1 },
    provinceName: { fontSize: 15, fontWeight: "600", color: colors.text, fontFamily: "Inter_600SemiBold" },
    provinceDetail: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular", marginTop: 2 },
    provinceSamples: { alignItems: "flex-end" },
    provinceCount: { fontSize: 15, fontWeight: "700", color: colors.primaryMid, fontFamily: "Inter_700Bold" },
    provinceLabel: { fontSize: 11, color: colors.textLight, fontFamily: "Inter_400Regular" },
    howItWorks: { backgroundColor: colors.primaryGhost, borderRadius: 16, padding: 20, marginBottom: 24, marginTop: 8 },
    howTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 16 },
    stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginRight: 10 },
    stepNumText: { fontSize: 13, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    stepIcon: { marginRight: 10 },
    stepText: { flex: 1, fontSize: 13, color: colors.text, fontFamily: "Inter_400Regular", lineHeight: 19 },
  });
}
