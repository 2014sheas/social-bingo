import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { validateEmail } from "../../utils/auth/validation";
import { handleFirebaseError } from "../../utils/auth/errorHandling";
import { ValidationErrors } from "../../utils/auth/validation";

type PasswordResetScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "PasswordReset"
>;

const PasswordResetScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigation = useNavigation<PasswordResetScreenNavigationProp>();

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
    };
    setErrors(newErrors);
    return !newErrors.email;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError("");
      console.log("Sending password reset email...");
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      console.log("Password reset error:", error);
      const errorMessage = handleFirebaseError(error, setErrors);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    console.log("Navigating back to Login...");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: undefined }));
          setError("");
        }}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <AuthButton
        title="Send Reset Link"
        onPress={handleResetPassword}
        loading={isLoading}
      />

      <TouchableOpacity style={styles.backLink} onPress={handleBackToLogin}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  backLink: {
    marginTop: 20,
    alignItems: "center",
  },
  backText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default PasswordResetScreen;
