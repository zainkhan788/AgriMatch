import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { CROPS_DATABASE, PAKISTAN_LOCATIONS } from "@/constants/data";
import { useAuth } from "@/contexts/AuthContext";

type Section = "calculator" | "submit" | "database" | null;

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const { user, logout } = useAuth();

  const [activeSection, setActiveSection] = useState<Section>(null);
  const styles = makeStyles(colors);

  const menuItems = [
    { id: "calculator" as Section, label: "Income Calculator", icon: "trending-up" as const, desc: "Estimate your crop income based on area and yield", color: colors.gold },
    { id: "submit" as Section, label: "Submit Soil Data", icon: "upload" as const, desc: "Contribute crowdsourced soil data to help farmers", color: colors.primaryMid },
    { id: "database" as Section, label: "Crop Database", icon: "book-open" as const, desc: "Browse all crops with soil and climate requirements", color: colors.soilMid },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout from AgriMatch?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await logout();
          },
        },
      ]
    );
  };

  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* User Profile Card */}
      {user && (
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            {user.location && (
              <View style={styles.profileRow}>
                <Feather name="map-pin" size={12} color={colors.primaryMid} />
                <Text style={styles.profileMeta}>{user.location}</Text>
              </View>
            )}
            {user.phone && (
              <View style={styles.profileRow}>
                <Feather name="phone" size={12} color={colors.primaryMid} />
                <Text style={styles.profileMeta}>{user.phone}</Text>
              </View>
            )}
            <View style={styles.profileRow}>
              <Feather name="calendar" size={12} color={colors.textLight} />
              <Text style={[styles.profileMeta, { color: colors.textLight }]}>Member since {joinedDate}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Feather name="log-out" size={16} color={colors.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.title}>More Tools</Text>
      <Text style={styles.subtitle}>Additional AgriMatch features for comprehensive farm management</Text>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuCard, { borderLeftColor: item.color }]}
          onPress={() => setActiveSection(activeSection === item.id ? null : item.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.menuIcon, { backgroundColor: item.color + "22" }]}>
            <Feather name={item.icon} size={22} color={item.color} />
          </View>
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuDesc}>{item.desc}</Text>
          </View>
          <Feather name={activeSection === item.id ? "chevron-up" : "chevron-right"} size={18} color={colors.textLight} />
        </TouchableOpacity>
      ))}

      {activeSection === "calculator" && <IncomeCalculator colors={colors} />}
      {activeSection === "submit" && <SubmitDataForm colors={colors} />}
      {activeSection === "database" && <CropDatabaseGallery colors={colors} />}
    </ScrollView>
  );
}

function IncomeCalculator({ colors }: { colors: any }) {
  const [cropIdx, setCropIdx] = useState(0);
  const [acres, setAcres] = useState("2");
  const [quality, setQuality] = useState(1);
  const [result, setResult] = useState<any>(null);

  const crop = CROPS_DATABASE[cropIdx];
  const qualities = ["Low", "Average", "Premium"];
  const qualityMultipliers = [0.7, 1.0, 1.3];

  const calculate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const baseIncome = parseInt(crop.income.replace(/[^0-9]/g, "")) * parseFloat(acres || "1");
    const adjustedIncome = baseIncome * qualityMultipliers[quality];
    setResult({
      crop: crop.name,
      acres: parseFloat(acres || "1"),
      grossIncome: adjustedIncome,
      expenses: adjustedIncome * 0.35,
      netIncome: adjustedIncome * 0.65,
    });
  };

  const s = StyleSheet.create({
    container: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 16 },
    label: { fontSize: 13, fontWeight: "600", color: colors.textMid, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
    cropScroll: { marginBottom: 16 },
    cropBtn: { backgroundColor: colors.primaryGhost, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1.5, borderColor: "transparent" },
    cropBtnActive: { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
    cropBtnText: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular" },
    cropBtnTextActive: { color: "#fff", fontFamily: "Inter_600SemiBold" },
    input: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.text, fontFamily: "Inter_400Regular", marginBottom: 16 },
    qualityRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    qualityBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: "center" },
    qualityBtnActive: { borderColor: colors.primaryMid, backgroundColor: colors.primaryGhost },
    qualityBtnText: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular" },
    calcBtn: { backgroundColor: colors.primary, borderRadius: 12, height: 50, alignItems: "center", justifyContent: "center" },
    calcBtnText: { fontSize: 15, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    resultCard: { backgroundColor: colors.primaryGhost, borderRadius: 12, padding: 16, marginTop: 16 },
    resultTitle: { fontSize: 15, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 12 },
    resultRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    resultLabel: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular" },
    resultValue: { fontSize: 13, fontWeight: "600", color: colors.text, fontFamily: "Inter_600SemiBold" },
    netRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.primaryPale, paddingTop: 10, marginTop: 4 },
    netLabel: { fontSize: 15, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold" },
    netValue: { fontSize: 16, fontWeight: "700", color: colors.success, fontFamily: "Inter_700Bold" },
  });

  return (
    <View style={s.container}>
      <Text style={s.sectionTitle}>Income Calculator</Text>

      <Text style={s.label}>Select Crop</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cropScroll}>
        {CROPS_DATABASE.map((c, i) => (
          <TouchableOpacity key={i} onPress={() => { setCropIdx(i); setResult(null); }} style={[s.cropBtn, cropIdx === i && s.cropBtnActive]}>
            <Text style={[s.cropBtnText, cropIdx === i && s.cropBtnTextActive]}>{c.emoji} {c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={s.label}>Field Area (Acres)</Text>
      <TextInput style={s.input} value={acres} onChangeText={v => { setAcres(v); setResult(null); }} keyboardType="numeric" placeholder="Enter acres" placeholderTextColor={colors.textLight} />

      <Text style={s.label}>Expected Quality</Text>
      <View style={s.qualityRow}>
        {qualities.map((q, i) => (
          <TouchableOpacity key={i} onPress={() => { setQuality(i); setResult(null); }} style={[s.qualityBtn, quality === i && s.qualityBtnActive]}>
            <Text style={[s.qualityBtnText, quality === i && { color: colors.primaryMid, fontFamily: "Inter_600SemiBold" }]}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.calcBtn} onPress={calculate}>
        <Text style={s.calcBtnText}>Calculate Income</Text>
      </TouchableOpacity>

      {result && (
        <View style={s.resultCard}>
          <Text style={s.resultTitle}>{result.crop} — {result.acres} acres ({qualities[quality]} quality)</Text>
          <View style={s.resultRow}>
            <Text style={s.resultLabel}>Gross Income</Text>
            <Text style={s.resultValue}>PKR {Math.round(result.grossIncome).toLocaleString()}</Text>
          </View>
          <View style={s.resultRow}>
            <Text style={s.resultLabel}>Estimated Expenses (35%)</Text>
            <Text style={[s.resultValue, { color: colors.danger }]}>- PKR {Math.round(result.expenses).toLocaleString()}</Text>
          </View>
          <View style={s.netRow}>
            <Text style={s.netLabel}>Net Income</Text>
            <Text style={s.netValue}>PKR {Math.round(result.netIncome).toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function SubmitDataForm({ colors }: { colors: any }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const s = StyleSheet.create({
    container: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 4 },
    sectionDesc: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", marginBottom: 20, lineHeight: 19 },
    label: { fontSize: 13, fontWeight: "600", color: colors.textMid, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
    input: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.text, fontFamily: "Inter_400Regular", marginBottom: 16 },
    locScroll: { marginBottom: 16 },
    locChip: { backgroundColor: colors.primaryGhost, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, marginRight: 8, borderWidth: 1.5, borderColor: "transparent" },
    locChipActive: { backgroundColor: colors.primaryMid, borderColor: colors.primaryMid },
    locChipText: { fontSize: 12, color: colors.textMid, fontFamily: "Inter_400Regular" },
    submitBtn: { backgroundColor: colors.primaryMid, borderRadius: 12, height: 50, alignItems: "center", justifyContent: "center" },
    submitBtnText: { fontSize: 15, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    successBox: { backgroundColor: colors.primaryGhost, borderRadius: 12, padding: 20, alignItems: "center", gap: 10 },
    successText: { fontSize: 15, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold" },
    successDesc: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 19 },
  });

  if (submitted) {
    return (
      <View style={s.container}>
        <View style={s.successBox}>
          <Feather name="check-circle" size={40} color={colors.success} />
          <Text style={s.successText}>Data Submitted!</Text>
          <Text style={s.successDesc}>Thank you for contributing to AgriMatch's crowdsourced database. Your data helps farmers across Pakistan.</Text>
          <TouchableOpacity onPress={() => setSubmitted(false)} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 14, color: colors.primaryMid, fontFamily: "Inter_600SemiBold" }}>Submit Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.sectionTitle}>Submit Soil Data</Text>
      <Text style={s.sectionDesc}>Help other farmers by sharing your field's soil data. Your contribution improves recommendations for everyone.</Text>

      <Text style={s.label}>Your Name / Farm Name</Text>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. Ali Khan Farm" placeholderTextColor={colors.textLight} />

      <Text style={s.label}>Location</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.locScroll}>
        {PAKISTAN_LOCATIONS.map((loc, i) => (
          <TouchableOpacity key={i} onPress={() => setLocation(i)} style={[s.locChip, location === i && s.locChipActive]}>
            <Text style={[s.locChipText, location === i && { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={s.submitBtn} onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setSubmitted(true);
      }}>
        <Text style={s.submitBtnText}>Submit Data</Text>
      </TouchableOpacity>
    </View>
  );
}

function CropDatabaseGallery({ colors }: { colors: any }) {
  const [search, setSearch] = useState("");
  const filtered = CROPS_DATABASE.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const s = StyleSheet.create({
    container: { backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 16 },
    searchInput: { borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.text, fontFamily: "Inter_400Regular", marginBottom: 16 },
    row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 12, alignItems: "center", gap: 12 },
    emoji: { fontSize: 24, width: 30, textAlign: "center" },
    info: { flex: 1 },
    cropName: { fontSize: 15, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold" },
    cropSoil: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular", marginTop: 2 },
    income: { fontSize: 13, fontWeight: "600", color: colors.success, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  });

  return (
    <View style={s.container}>
      <Text style={s.sectionTitle}>Crop Database ({CROPS_DATABASE.length} crops)</Text>
      <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Search crops..." placeholderTextColor={colors.textLight} />
      {filtered.map(crop => (
        <View key={crop.name} style={s.row}>
          <Text style={s.emoji}>{crop.emoji}</Text>
          <View style={s.info}>
            <Text style={s.cropName}>{crop.name}</Text>
            <Text style={s.cropSoil}>pH {crop.ph} · {crop.soils[0]}</Text>
          </View>
          <Text style={s.income}>{crop.income}</Text>
        </View>
      ))}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", marginBottom: 6, paddingTop: 16 },
    subtitle: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", marginBottom: 20, lineHeight: 19 },
    menuCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 12, borderLeftWidth: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    menuIcon: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
    menuText: { flex: 1 },
    menuLabel: { fontSize: 15, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold" },
    menuDesc: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 17 },
    profileCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 20, marginBottom: 20, marginTop: 16, flexDirection: "row", alignItems: "flex-start", gap: 14, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
    avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    avatarText: { fontSize: 20, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    profileInfo: { flex: 1, gap: 3 },
    profileName: { fontSize: 17, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    profileEmail: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 4 },
    profileRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    profileMeta: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_400Regular" },
    logoutBtn: { flexDirection: "column", alignItems: "center", gap: 4, paddingLeft: 8 },
    logoutText: { fontSize: 11, color: colors.danger, fontFamily: "Inter_600SemiBold" },
  });
}
