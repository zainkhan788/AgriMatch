import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import "../i18n";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { PESTS } from "@/constants/data";

export default function PestDetectionScreen() {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [selectedPest, setSelectedPest] = useState<typeof PESTS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const filterScrollRef = useRef<ScrollView>(null);

  const styles = makeStyles(colors);
  const filters = ["All", "High", "Medium", "Critical"];

  const filteredPests = activeFilter === "All"
    ? PESTS
    : PESTS.filter(p => p.severity === activeFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (i18n.language === "ur") {
        filterScrollRef.current?.scrollToEnd({
          animated: false,
        });
      } else {
        filterScrollRef.current?.scrollTo({
          x: 0,
          animated: false,
        });
      }
    }, 100);
  
    return () => clearTimeout(timer);
  }, [i18n.language]);

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
      <Text
        style={[
          styles.title,
          i18n.language === "ur" && styles.titleUrdu,
        ]}
      >
        {t("pestDetectionTitle")}
      </Text>
      
      <Text
        style={[
          styles.subtitle,
          i18n.language === "ur" && styles.subtitleUrdu,
        ]}
      >
        {t("pestDetectionSubtitle")}
      </Text>

      <View 
        style={[
          styles.alertBanner,
          i18n.language === "ur" && styles.alertBannerUrdu 
          ]}
      >
        <Feather name="alert-triangle" size={16} color={colors.warning} />
        <Text 
          style={[
            styles.alertText,
            i18n.language === "ur" && styles.alertTextUrdu
          ]}
        >
          {t("pestEarlyDetectionAlert")}
        </Text>
      </View>

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
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterChip,
              i18n.language === "ur" && styles.filterChipUrdu,
              activeFilter === f && {
                backgroundColor: getSeverityColor(f),
              },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                i18n.language === "ur" && styles.filterChipTextUrdu,
                activeFilter === f && styles.filterChipTextActive
              ]}
            >
              {f === "All"
                ? t("allPests")
                : t("riskFilter", {
                    severity: t(f),
                  })}
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
          <View
            style={[
              styles.pestHeader,
              i18n.language === "ur" && styles.pestHeaderUrdu,
            ]}
          >
            <View
              style={[
                styles.pestIconWrap,
                { backgroundColor: pest.color + "22" },
              ]}
            >
              <Text style={styles.pestEmoji}>{pest.emoji}</Text>
            </View>
          
            <View
              style={[
                styles.pestInfo,
                i18n.language === "ur" && styles.pestInfoUrdu,
              ]}
            >
              <Text
                style={[
                  styles.pestName,
                  i18n.language === "ur" && styles.pestTextUrdu,
                ]}
              >
                {i18n.language === "ur"
                  ? pest.name.ur
                  : pest.name.en}
              </Text>
          
              <Text
                style={[
                  styles.pestAffected,
                  i18n.language === "ur" && styles.pestTextUrdu,
                ]}
              >
                {t("affects")}:{" "}
                {pest.affected
                  .map((crop) =>
                    t(crop, {
                      defaultValue: crop,
                    })
                  )
                  .join(i18n.language === "ur" ? "، " : ", ")}
              </Text>
            </View>
          
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(pest.severity) },
              ]}
            >
              <Text style={styles.severityText}>
                {t(pest.severity, {
                  defaultValue: pest.severity,
                })}
              </Text>
            </View>
          </View>

          {selectedPest?.id === pest.id && (
            <View style={styles.pestDetail}>
          
              {/* Identification */}
              <View style={styles.detailSection}>
                <View
                  style={[
                    styles.detailSectionHeader,
                    i18n.language === "ur" &&
                      styles.detailSectionHeaderUrdu,
                  ]}
                >
                  <Feather
                    name="eye"
                    size={14}
                    color={colors.primaryMid}
                  />
          
                  <Text
                    style={[
                      styles.detailSectionTitle,
                      i18n.language === "ur" &&
                        styles.pestTextUrdu,
                    ]}
                  >
                    {t("identification")}
                  </Text>
                </View>
          
                  <Text
                    style={[
                      styles.detailText,
                      i18n.language === "ur" &&
                        styles.detailTextUrdu,
                    ]}
                  >
                    {i18n.language === "ur"
                      ? pest.description.ur
                      : pest.description.en}
                  </Text>
                </View>
            
                <View style={styles.divider} />
            
                {/* Treatment */}
                <View style={styles.detailSection}>
                  <View
                    style={[
                      styles.detailSectionHeader,
                      i18n.language === "ur" &&
                        styles.detailSectionHeaderUrdu,
                    ]}
                  >
                    <Feather
                      name="tool"
                      size={14}
                      color={colors.warning}
                    />
            
                    <Text
                      style={[
                        styles.detailSectionTitle,
                        i18n.language === "ur" &&
                          styles.pestTextUrdu,
                      ]}
                    >
                      {t("treatment")}
                    </Text>
                  </View>
            
                  <Text
                    style={[
                      styles.detailText,
                      i18n.language === "ur" &&
                        styles.detailTextUrdu,
                    ]}
                  >
                    {i18n.language === "ur"
                      ? pest.treatment.ur
                      : pest.treatment.en}
                  </Text>
                </View>
            
                <View style={styles.divider} />
            
                {/* Prevention */}
                <View style={styles.detailSection}>
                  <View
                    style={[
                      styles.detailSectionHeader,
                      i18n.language === "ur" &&
                        styles.detailSectionHeaderUrdu,
                    ]}
                  >
                    <Feather
                      name="shield"
                      size={14}
                      color={colors.success}
                    />
            
                    <Text
                      style={[
                        styles.detailSectionTitle,
                        i18n.language === "ur" &&
                          styles.pestTextUrdu,
                      ]}
                    >
                      {t("prevention")}
                    </Text>
                  </View>
            
                  <Text
                    style={[
                      styles.detailText,
                      i18n.language === "ur" &&
                        styles.detailTextUrdu,
                    ]}
                  >
                    {i18n.language === "ur"
                      ? pest.prevention.ur
                      : pest.prevention.en}
                  </Text>
                </View>
              </View>
            )}      

          <View
            style={[
              styles.pestFooter,
              i18n.language === "ur" && styles.pestFooterUrdu,
            ]}
          >
            <Feather name={selectedPest?.id === pest.id ? "chevron-up" : "chevron-down"} size={16} color={colors.textLight} />
            <Text
              style={[
                styles.tapText,
                i18n.language === "ur" && styles.pestTextUrdu,
              ]}
            >
              {selectedPest?.id === pest.id
                ? t("tapToCollapse")
                : t("tapForDetails")}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      <View
        style={[
          styles.reportSection,
          i18n.language === "ur" && styles.reportSectionUrdu,
        ]}
      >
        <Feather
          name="map-pin"
          size={22}
          color={colors.primaryMid}
        />
      
        <View
          style={[
            styles.reportText,
            i18n.language === "ur" && styles.reportTextUrdu,
          ]}
        >
          <Text
            style={[
              styles.reportTitle,
              i18n.language === "ur" && styles.reportTitleUrdu,
            ]}
          >
            {t("reportPestSighting")}
          </Text>
      
          <Text
            style={[
              styles.reportDesc,
              i18n.language === "ur" && styles.reportDescUrdu,
            ]}
          >
            {t("reportPestDescription")}
          </Text>
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
    filterChip: { backgroundColor: colors.primaryGhost, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: "transparent" },
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
    
    alertBannerUrdu: {
      flexDirection: "row-reverse",
      borderLeftWidth: 0,
      borderRightWidth: 3,
      borderRightColor: colors.warning,
    },
    
    alertTextUrdu: {
      textAlign: "right",
      writingDirection: "rtl",
      lineHeight: 28,
    },
    filterContent: {
      flexDirection: "row",
      gap: 8,
      paddingRight: 10,
    },
    
    filterContentUrdu: {
      flexDirection: "row-reverse",
      paddingLeft: 10,
      paddingRight: 0,
    },
    
    filterChipUrdu: {
      minWidth: 120,
    },
    
    filterChipTextUrdu: {
      textAlign: "center",
      writingDirection: "rtl",
    },
    pestHeaderUrdu: {
      flexDirection: "row-reverse",
    },
    
    pestInfoUrdu: {
      alignItems: "flex-end",
    },
    
    pestTextUrdu: {
      textAlign: "right",
      writingDirection: "rtl",
    },
    
    pestFooterUrdu: {
      flexDirection: "row-reverse",
      justifyContent: "flex-start",
    },
    detailSectionHeaderUrdu: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },
  
  detailTextUrdu: {
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
  },
  reportSectionUrdu: {
  flexDirection: "row-reverse",
  alignItems: "flex-start",
  },
  
  reportTextUrdu: {
    alignItems: "flex-end",
  },
  
  reportTitleUrdu: {
    width: "100%",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 28,
  },
  
  reportDescUrdu: {
    width: "100%",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 26,
  },
  });
}
