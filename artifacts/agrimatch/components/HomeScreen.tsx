import React, { useEffect } from "react";
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
import "../i18n";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGO = require("@/assets/images/Agrimatch-logo.png");

export default function HomeScreen() {

  const { t,i18n } = useTranslation();
  const changeLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem("appLanguage", lang);
};
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 52 : Platform.OS === "ios" ? 0 : 30;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const quickActions = [
  {
    label: t("croprecommendation"),
    icon: "layers" as const,
    tab: "soil",
    color: colors.primaryMid,
  },
  {
    label: t("cropMatcher"),
    icon: "git-merge" as const,
    tab: "crops",
    color: colors.soilMid,
  },
  {
    label: t("pestDetection"),
    icon: "alert-circle" as const,
    tab: "pest",
    color: colors.danger,
  },
];

  const styles = makeStyles(colors);

  useEffect(() => {
  const loadLanguage = async () => {
    const savedLanguage = await AsyncStorage.getItem("appLanguage");

    if (savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
    }
  };

  loadLanguage();
}, [i18n]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoSection}>
        <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.welcomeText}>
          {t("homeWelcome")}
        </Text>
      </View>

      <Text
        style={[
          styles.sectionTitle,
          i18n.language === "ur" && styles.sectionTitleUrdu,
        ]}
      >
        {t("quickActions")}
      </Text>
      <View
        style={[
          styles.quickGrid,
          i18n.language === "ur" && styles.quickGridUrdu,
        ]}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[
              styles.quickCard,
              i18n.language === "ur"
                ? {
                    borderLeftWidth: 0,
                    borderRightWidth: 4,
                    borderRightColor: action.color,
                  }
                : {
                    borderLeftWidth: 4,
                    borderLeftColor: action.color,
                  },
            ]}
            onPress={() => router.push(`/(tabs)/${action.tab}` as any)}
            activeOpacity={0.75}
          >
            <View
  style={[
    styles.quickCardContent,
    i18n.language === "ur" && styles.quickCardContentUrdu,
  ]}
>
  <View
      style={[
        styles.quickIcon,
        { backgroundColor: action.color + "22" },
      ]}
    >
      <Feather
        name={action.icon}
        size={20}
        color={action.color}
      />
    </View>
  
    <Text
      style={[
        styles.quickLabel,
        i18n.language === "ur" && styles.quickLabelUrdu,
      ]}
    >
      {action.label}
    </Text>
  </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[
        styles.sectionTitle,
        i18n.language === "ur" && styles.sectionTitleUrdu,
      ]}>
        {t("liveStatistics")}
      </Text>
      
      <View
        style={[
          styles.statsGrid,
          i18n.language === "ur" && styles.statsGridUrdu,
        ]}
      >
        <StatCard
          label={t("registeredFarmers")}
          value={STATS.totalFarmers.toLocaleString()}
          icon="users"
          color={colors.primaryLight}
          colors={colors}
        />
      
        <StatCard
          label={t("soilSamples")}
          value={STATS.soilSamples.toLocaleString()}
          icon="database"
          color={colors.primaryMid}
          colors={colors}
        />
      
        <StatCard
          label={t("recommendations")}
          value={STATS.cropRecommendations.toLocaleString()}
          icon="check-circle"
          color={colors.success}
          colors={colors}
        />
      
        <StatCard
          label={t("incomeIncrease")}
          value={`+${STATS.avgIncomeIncrease}%`}
          icon="trending-up"
          color={colors.gold}
          colors={colors}
        />
      </View>

      <Text style={[
        styles.sectionTitle,
        i18n.language === "ur" && styles.sectionTitleUrdu,
      ]}>
        {t("provinceHighlights")}
      </Text>
      {STATS.provinceStats.map((p) => (
        <View
          key={p.province}
          style={[
            styles.provinceRow,
            i18n.language === "ur" && styles.provinceRowUrdu,
          ]}
        >
          <View
            style={[
              styles.provinceDot,
              i18n.language === "ur"
                ? styles.provinceDotUrdu
                : styles.provinceDotEnglish,
              { backgroundColor: p.color },
            ]}
          />
      
          <View
            style={[
              styles.provinceInfo,
              i18n.language === "ur" && styles.provinceInfoUrdu,
            ]}
          >
            <Text
              style={[
                styles.provinceName,
                i18n.language === "ur" && styles.provinceTextUrdu,
              ]}
            >
              {t(p.province)}
            </Text>
      
            <Text
              style={[
                styles.provinceDetail,
                i18n.language === "ur" && styles.provinceTextUrdu,
              ]}
            >
              {t("topCrop")}: {t(p.topCrop)}
            </Text>
          </View>
      
          <View
            style={[
              styles.provinceSamples,
              i18n.language === "ur" && styles.provinceSamplesUrdu,
            ]}
          >
            <Text style={styles.provinceCount}>
              {p.samples.toLocaleString()}
            </Text>
      
            <Text style={styles.provinceLabel}>
              {t("samples")}
            </Text>
          </View>
        </View>
      ))}
      
      <View style={styles.howItWorks}>
        <Text
         style={[
           styles.howTitle,
           i18n.language === "ur" && styles.howTitleUrdu,
         ]}
       >
          {t("howAgriMatchWorks")}
        </Text>
      
        {[
          {
            step: "1",
            text: t("homeStep1"),
            icon: "upload" as const,
          },
          {
            step: "2",
            text: t("homeStep2"),
            icon: "cpu" as const,
          },
          {
            step: "3",
            text: t("homeStep3"),
            icon: "git-merge" as const,
          },
          {
            step: "4",
            text: t("homeStep4"),
            icon: "bar-chart-2" as const,
          },
        ].map((item) => (
          <View
            key={item.step}
            style={[
              styles.stepRow,
              i18n.language === "ur" && styles.stepRowUrdu,
            ]}
          >
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
      
            <Feather
              name={item.icon}
              size={16}
              color={colors.primaryLight}
              style={[
                styles.stepIcon,
                i18n.language === "ur" && styles.stepIconUrdu,
              ]}
            />
      
            <Text
              style={[
                styles.stepText,
                i18n.language === "ur" && styles.stepTextUrdu,
              ]}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
  {i18n.language === "ur" ? (
    <View style={styles.languageRow}>
      <TouchableOpacity onPress={() => changeLanguage("ur")}>
        <Text
          style={[
            styles.languageText,
            styles.urduText,
            styles.activeLanguageText,
          ]}
        >
          اردو
        </Text>
      </TouchableOpacity>

      <Text style={styles.separator}>|</Text>

      <TouchableOpacity onPress={() => changeLanguage("en")}>
        <Text style={styles.languageText}>English</Text>
      </TouchableOpacity>

      <View style={styles.languageGap} />

      <View style={styles.urduLanguageTitle}>
        <Text style={styles.languageTitle}>زبان</Text>
        <Text style={styles.globeIcon}>🌐</Text>
      </View>
    </View>
  ) : (
    <View style={styles.languageRow}>
      <View style={styles.englishLanguageTitle}>
        <Text style={styles.globeIcon}>🌐</Text>
        <Text style={styles.languageTitle}>Language</Text>
      </View>

      <View style={styles.languageGap} />

      <TouchableOpacity onPress={() => changeLanguage("en")}>
        <Text
          style={[
            styles.languageText,
            styles.activeLanguageText,
          ]}
        >
          English
        </Text>
      </TouchableOpacity>

      <Text style={styles.separator}>|</Text>

      <TouchableOpacity onPress={() => changeLanguage("ur")}>
        <Text style={[styles.languageText, styles.urduText]}>
          اردو
        </Text>
      </TouchableOpacity>
    </View>
  )}
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
    quickGridUrdu: {
      flexDirection: "row-reverse",
    },
    quickCard: {
      width: "47%",
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    quickIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    quickLabel: { fontSize: 14, fontWeight: "600", color: colors.text, fontFamily: "Inter_600SemiBold" },
    statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
    statsGridUrdu: {
      flexDirection: "row-reverse",
    },
    statCard: { width: "47%", backgroundColor: colors.card, borderRadius: 14, padding: 16, alignItems: "center", borderTopWidth: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, gap: 6 },
    statValue: { fontSize: 20, fontWeight: "700", fontFamily: "Inter_700Bold" },
    statLabel: { fontSize: 11, color: colors.textLight, fontFamily: "Inter_400Regular", textAlign: "center" },
    provinceRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    provinceDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },    
    provinceDotEnglish: {
      marginRight: 12,
    },
    provinceDotUrdu: {
      marginLeft: 12,
    },
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
    footer: {
      alignItems: "center",
      marginTop: 15,
      marginBottom: 25,
    },
    
    footerText: {
      fontSize: 12,
      color: colors.textLight,
      fontFamily: "Inter_400Regular",
    },

    howTitleUrdu: {
  textAlign: "right",
  writingDirection: "rtl",
},

stepRowUrdu: {
  flexDirection: "row-reverse",
},

stepTextUrdu: {
  flex: 1,
  textAlign: "right",
  writingDirection: "rtl",
},

stepIconUrdu: {
  marginRight: 10,
  marginLeft: 10,
},
quickCardContent: {
  flex: 1,
  alignItems: "flex-start",
},

quickCardContentUrdu: {
  alignItems: "flex-end",
},

quickLabelUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},
sectionTitleUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},
provinceInfoUrdu: {
  alignItems: "flex-end",
},

provinceTextUrdu: {
  width: "100%",
  textAlign: "right",
  writingDirection: "rtl",
},
provinceRowUrdu: {
  flexDirection: "row-reverse",
},

provinceSamplesUrdu: {
  alignItems: "flex-start",
},
languageRowUrdu: {
  flexDirection: "row",
},

languageTitleUrdu: {
  marginLeft: 10,
  writingDirection: "rtl",
},
languageRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

languageGap: {
  width: 14,
},

urduLanguageTitle: {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
},

englishLanguageTitle: {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
},

languageTitle: {
  fontSize: 15,
  fontWeight: "600",
  color: colors.text,
  fontFamily: "Inter_600SemiBold",
},

globeIcon: {
  fontSize: 18,
},

languageText: {
  fontSize: 15,
  fontWeight: "600",
  color: colors.primary,
  fontFamily: "Inter_600SemiBold",
},

separator: {
  marginHorizontal: 8,
  color: colors.textLight,
},

activeLanguageText: {
  color: "#777",
  fontWeight: "700",
},

urduText: {
  transform: [{ translateY: -2 }],
},
 });
}
