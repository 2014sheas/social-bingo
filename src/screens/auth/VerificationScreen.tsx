import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { sendEmailVerification, reload, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type VerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Verification"
>;

const VerificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<VerificationScreenNavigationProp>();

  const checkVerificationStatus = async () => {
    try {
      setIsLoading(true);
      console.log("Checking verification status...");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user found");
      }
      await currentUser.reload();
      if (currentUser.emailVerified) {
        console.log("Email verified, navigating to Login...");
        Alert.alert(
          "Success",
          "Your email has been verified! You can now log in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login" as never),
            },
          ]
        );
      } else {
        console.log("Email not yet verified");
        setError("Email not yet verified. Please check your inbox.");
      }
    } catch (error: any) {
      console.log("Verification check error:", error);
      let errorMessage =
        "Failed to check verification status. Please try again.";

      switch (error.code) {
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/user-token-expired":
          errorMessage = "Your session has expired. Please log in again.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      console.log("Resending verification email...");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user found");
      }
      await sendEmailVerification(currentUser);
      console.log("Verification email resent");
      setError("Verification email resent. Please check your inbox.");
    } catch (error: any) {
      console.log("Resend verification error:", error);
      let errorMessage =
        "Failed to resend verification email. Please try again.";

      switch (error.code) {
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;
      }

      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await signOut(auth);
      console.log("Logout successful, navigating to Login...");
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("Logout error:", error);
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification email to {auth.currentUser?.email}
      </Text>
      <Text style={styles.instructions}>
        Please check your inbox and click the verification link. If you don't
        see the email, check your spam folder.
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={checkVerificationStatus}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Check Verification Status</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleResendVerification}
        disabled={isResending}
      >
        {isResending ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <Text style={styles.secondaryButtonText}>
            Resend Verification Email
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutLink} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
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
    marginBottom: 10,
    textAlign: "center",
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  logoutLink: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default VerificationScreen;
