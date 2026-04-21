import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { PAKISTAN_LOCATIONS } from "@/constants/data";

const LOGO = require("@/assets/images/Agrimatch-logo.png");

type Tab = "login" | "signup";

type SocialProvider = "Google" | "Outlook" | "Yahoo";

const SOCIAL_PROVIDERS: {
  name: SocialProvider;
  color: string;
  bgColor: string;
  domain: string;
  icon: string;
  loginUrl: string;
}[] = [
  {
    name: "Google",
    color: "#EA4335",
    bgColor: "#FFF3F2",
    domain: "gmail.com",
    icon: "G",
    loginUrl: "https://accounts.google.com/signin",
  },
  {
    name: "Outlook",
    color: "#0078D4",
    bgColor: "#F0F6FF",
    domain: "outlook.com",
    icon: "O",
    loginUrl: "https://login.live.com",
  },
  {
    name: "Yahoo",
    color: "#6001D2",
    bgColor: "#F5F0FF",
    domain: "yahoo.com",
    icon: "Y",
    loginUrl: "https://login.yahoo.com",
  },
];

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login, signup } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupLocation, setSignupLocation] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [socialModal, setSocialModal] = useState<{ visible: boolean; provider: SocialProvider | null }>({ visible: false, provider: null });
  const [socialName, setSocialName] = useState("");
  const [socialEmail, setSocialEmail] = useState("");
  const [socialError, setSocialError] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialBrowserDone, setSocialBrowserDone] = useState(false);

  const styles = makeStyles(colors, insets.top, insets.bottom);

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    Haptics.selectionAsync();
  };

  const handleLogin = async () => {
    setError("");
    if (!loginEmail.trim()) return setError("Please enter your email address.");
    if (!loginPassword) return setError("Please enter your password.");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await login(loginEmail.trim(), loginPassword);
    setLoading(false);
    if (!res.success) setError(res.error ?? "Login failed.");
  };

  const handleSignup = async () => {
    setError("");
    if (!signupName.trim()) return setError("Please enter your full name.");
    if (!signupEmail.trim()) return setError("Please enter your email address.");
    if (!signupEmail.includes("@")) return setError("Please enter a valid email address.");
    if (signupPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (signupPassword !== signupConfirm) return setError("Passwords do not match.");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await signup(signupName, signupEmail, signupPassword, signupPhone, signupLocation);
    setLoading(false);
    if (!res.success) setError(res.error ?? "Signup failed.");
  };

  const openSocialModal = async (provider: SocialProvider) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const providerData = SOCIAL_PROVIDERS.find(p => p.name === provider)!;

    setSocialName("");
    setSocialEmail("");
    setSocialError("");
    setSocialBrowserDone(false);

    try {
      await WebBrowser.openBrowserAsync(providerData.loginUrl, {
        ...(Platform.OS === "ios"
          ? { presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET }
          : {}),
        toolbarColor: providerData.color,
        controlsColor: "#ffffff",
        showTitle: true,
        enableDefaultShareMenuItem: false,
      });
    } catch {}

    setSocialBrowserDone(true);
    setSocialModal({ visible: true, provider });
  };

  const handleSocialContinue = async () => {
    setSocialError("");
    if (!socialName.trim()) return setSocialError("Please enter your full name.");
    if (!socialEmail.trim()) return setSocialError("Please enter your email address.");
    if (!socialEmail.includes("@")) return setSocialError("Please enter a valid email address.");

    setSocialLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const socialPassword = `social_${socialModal.provider}_${socialEmail.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const tryLogin = await login(socialEmail.trim(), socialPassword);
    if (tryLogin.success) { setSocialLoading(false); setSocialModal({ visible: false, provider: null }); return; }

    const res = await signup(socialName, socialEmail, socialPassword);
    setSocialLoading(false);
    if (!res.success) { setSocialError(res.error ?? "Could not sign in. Please try again."); return; }
    setSocialModal({ visible: false, provider: null });
  };

  const currentProvider = SOCIAL_PROVIDERS.find(p => p.name === socialModal.provider);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header / Logo */}
        <View style={styles.header}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.welcome}>Welcome to AgriMatch</Text>
          <Text style={styles.tagline}>Smart Agriculture for Pakistan Farmers</Text>
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialSection}>
          <Text style={styles.socialLabel}>Continue with</Text>
          <View style={styles.socialRow}>
            {SOCIAL_PROVIDERS.map((p) => (
              <TouchableOpacity
                key={p.name}
                style={[styles.socialBtn, { backgroundColor: p.bgColor, borderColor: p.color + "33" }]}
                onPress={() => openSocialModal(p.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.socialIconCircle, { backgroundColor: p.color }]}>
                  <Text style={styles.socialIconText}>{p.icon}</Text>
                </View>
                <Text style={[styles.socialBtnText, { color: p.color }]}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or use email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "login" && styles.tabBtnActive]}
            onPress={() => switchTab("login")}
          >
            <Text style={[styles.tabBtnText, tab === "login" && styles.tabBtnTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === "signup" && styles.tabBtnActive]}
            onPress={() => switchTab("signup")}
          >
            <Text style={[styles.tabBtnText, tab === "signup" && styles.tabBtnTextActive]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Error Banner */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={14} color="#c0392b" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <View style={styles.form}>
            <FieldLabel label="Email Address" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="mail" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.textLight}
                value={loginEmail}
                onChangeText={setLoginEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <FieldLabel label="Password" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="lock" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textLight}
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="log-in" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitBtnText}>Login to AgriMatch</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => switchTab("signup")} style={styles.switchLink}>
              <Text style={styles.switchLinkText}>Don't have an account? <Text style={{ color: colors.primaryMid, fontFamily: "Inter_600SemiBold" }}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Signup Form */}
        {tab === "signup" && (
          <View style={styles.form}>
            <FieldLabel label="Full Name" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="user" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Muhammad Ali"
                placeholderTextColor={colors.textLight}
                value={signupName}
                onChangeText={setSignupName}
                autoCorrect={false}
              />
            </View>

            <FieldLabel label="Email Address" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="mail" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.textLight}
                value={signupEmail}
                onChangeText={setSignupEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <FieldLabel label="Phone Number (Optional)" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="phone" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+92 300 1234567"
                placeholderTextColor={colors.textLight}
                value={signupPhone}
                onChangeText={setSignupPhone}
                keyboardType="phone-pad"
              />
            </View>

            <FieldLabel label="Location in Pakistan (Optional)" colors={colors} />
            <TouchableOpacity
              style={styles.inputWrap}
              onPress={() => setShowLocationPicker(!showLocationPicker)}
            >
              <Feather name="map-pin" size={16} color={colors.textLight} style={styles.inputIcon} />
              <Text style={[styles.input, { flex: 1, paddingTop: 11, color: signupLocation ? colors.text : colors.textLight }]}>
                {signupLocation || "Select your city"}
              </Text>
              <Feather name={showLocationPicker ? "chevron-up" : "chevron-down"} size={16} color={colors.textLight} style={{ paddingHorizontal: 10 }} />
            </TouchableOpacity>
            {showLocationPicker && (
              <ScrollView
                style={styles.locationPicker}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                {PAKISTAN_LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.locationItem, signupLocation === loc && styles.locationItemActive]}
                    onPress={() => { setSignupLocation(loc); setShowLocationPicker(false); }}
                  >
                    <Text style={[styles.locationItemText, signupLocation === loc && { color: "#fff" }]}>{loc}</Text>
                    {signupLocation === loc && <Feather name="check" size={14} color="#fff" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <FieldLabel label="Password" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="lock" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Min. 6 characters"
                placeholderTextColor={colors.textLight}
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <FieldLabel label="Confirm Password" colors={colors} />
            <View style={styles.inputWrap}>
              <Feather name="lock" size={16} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor={colors.textLight}
                value={signupConfirm}
                onChangeText={setSignupConfirm}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} activeOpacity={0.85} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Feather name="user-plus" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.submitBtnText}>Create Account</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => switchTab("login")} style={styles.switchLink}>
              <Text style={styles.switchLinkText}>Already have an account? <Text style={{ color: colors.primaryMid, fontFamily: "Inter_600SemiBold" }}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Features strip */}
        <View style={styles.featuresRow}>
          {[
            { icon: "layers", label: "Soil Analysis" },
            { icon: "git-merge", label: "Crop Match" },
            { icon: "shield", label: "Pest Alert" },
            { icon: "trending-up", label: "Income Calc" },
          ].map((f) => (
            <View key={f.label} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Feather name={f.icon as any} size={16} color={colors.primaryMid} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Social Login Modal */}
      <Modal
        visible={socialModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setSocialModal({ visible: false, provider: null })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {currentProvider && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalProviderBadge, { backgroundColor: currentProvider.color }]}>
                    <Text style={styles.modalProviderIcon}>{currentProvider.icon}</Text>
                  </View>
                  <Text style={styles.modalTitle}>Continue with {currentProvider.name}</Text>
                  <TouchableOpacity
                    onPress={() => setSocialModal({ visible: false, provider: null })}
                    style={styles.modalClose}
                  >
                    <Feather name="x" size={20} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>
                  {socialBrowserDone
                    ? `Signed in with ${currentProvider.name}? Enter the email you used to link it with your AgriMatch account.`
                    : `Enter your ${currentProvider.name} account email to sign in or register with AgriMatch.`}
                </Text>

                {!!socialError && (
                  <View style={[styles.errorBanner, { marginBottom: 12 }]}>
                    <Feather name="alert-circle" size={13} color="#c0392b" />
                    <Text style={styles.errorText}>{socialError}</Text>
                  </View>
                )}

                <FieldLabel label="Full Name" colors={colors} />
                <View style={styles.inputWrap}>
                  <Feather name="user" size={15} color={colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Muhammad Ali"
                    placeholderTextColor={colors.textLight}
                    value={socialName}
                    onChangeText={setSocialName}
                    autoCorrect={false}
                  />
                </View>

                <FieldLabel label={`${currentProvider.name} Email`} colors={colors} />
                <View style={styles.inputWrap}>
                  <Feather name="mail" size={15} color={colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`you@${currentProvider.domain}`}
                    placeholderTextColor={colors.textLight}
                    value={socialEmail}
                    onChangeText={setSocialEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: currentProvider.color, marginTop: 8 }]}
                  onPress={handleSocialContinue}
                  activeOpacity={0.85}
                  disabled={socialLoading}
                >
                  {socialLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <View style={[styles.socialBtnIconInline, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" }}>{currentProvider.icon}</Text>
                      </View>
                      <Text style={styles.submitBtnText}>Continue with {currentProvider.name}</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.modalDisclaimer}>
                  Sign in to {currentProvider?.name} first, then enter the same email here to link it with AgriMatch. No separate password needed.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textMid, fontFamily: "Inter_600SemiBold", marginBottom: 7, marginTop: 4 }}>
      {label}
    </Text>
  );
}

function makeStyles(colors: any, topInset: number, bottomInset: number) {
  return StyleSheet.create({
    container: { paddingHorizontal: 24 },
    header: { alignItems: "center", marginBottom: 24 },
    logo: { width: 200, height: 200, marginBottom: -20 },
    welcome: { fontSize: 23, fontWeight: "700", color: colors.primary, fontFamily: "Inter_700Bold", textAlign: "center", marginBottom: 4 },
    tagline: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", textAlign: "center" },
    socialSection: { marginBottom: 18 },
    socialLabel: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_500Medium", textAlign: "center", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
    socialRow: { flexDirection: "row", gap: 10 },
    socialBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5 },
    socialIconCircle: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
    socialIconText: { fontSize: 12, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    socialBtnText: { fontSize: 13, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
    divider: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { fontSize: 12, color: colors.textLight, fontFamily: "Inter_400Regular" },
    tabRow: { flexDirection: "row", backgroundColor: colors.primaryGhost, borderRadius: 14, padding: 4, marginBottom: 20 },
    tabBtn: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 11 },
    tabBtnActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
    tabBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.textMid },
    tabBtnTextActive: { color: "#fff" },
    errorBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FDECEA", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: "#e74c3c" },
    errorText: { flex: 1, fontSize: 13, color: "#c0392b", fontFamily: "Inter_400Regular" },
    form: { gap: 0 },
    inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, marginBottom: 14, overflow: "hidden" },
    inputIcon: { paddingHorizontal: 12 },
    input: { flex: 1, paddingVertical: 12, paddingRight: 12, fontSize: 14, color: colors.text, fontFamily: "Inter_400Regular" },
    eyeBtn: { paddingHorizontal: 12, paddingVertical: 12 },
    locationPicker: { maxHeight: 200, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, marginTop: -10, marginBottom: 14 },
    locationItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
    locationItemActive: { backgroundColor: colors.primaryMid },
    locationItemText: { fontSize: 14, color: colors.text, fontFamily: "Inter_400Regular" },
    submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.primary, borderRadius: 14, height: 54, marginTop: 6, marginBottom: 16, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    submitBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    switchLink: { alignItems: "center", paddingBottom: 8 },
    switchLinkText: { fontSize: 14, color: colors.textMid, fontFamily: "Inter_400Regular" },
    featuresRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.border },
    featureItem: { alignItems: "center", gap: 6 },
    featureIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryGhost, alignItems: "center", justifyContent: "center" },
    featureLabel: { fontSize: 11, color: colors.textMid, fontFamily: "Inter_500Medium", textAlign: "center" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
    modalCard: { backgroundColor: colors.background, borderRadius: 24, padding: 24, width: "100%", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 30, elevation: 20 },
    modalHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
    modalProviderBadge: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    modalProviderIcon: { fontSize: 18, fontWeight: "700", color: "#fff", fontFamily: "Inter_700Bold" },
    modalTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: colors.text, fontFamily: "Inter_700Bold" },
    modalClose: { padding: 4 },
    modalSubtitle: { fontSize: 13, color: colors.textMid, fontFamily: "Inter_400Regular", lineHeight: 19, marginBottom: 18 },
    socialBtnIconInline: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    modalDisclaimer: { fontSize: 11, color: colors.textLight, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 16, marginTop: 12 },
  });
}
