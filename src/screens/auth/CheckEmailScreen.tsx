import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebase";
import { sendEmailVerification } from "firebase/auth";

const CheckEmailScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user found");
      }
      await sendEmailVerification(user);
      Alert.alert(
        "Success",
        "Verification email sent. Please check your inbox."
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user found");
      }
      await user.reload();
      if (user.emailVerified) {
        Alert.alert("Success", "Email verified! You can now log in.", [
          { text: "OK", onPress: () => navigation.navigate("Login" as never) },
        ]);
      } else {
        Alert.alert(
          "Not Verified",
          "Your email is not yet verified. Please check your inbox."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification email to your inbox. Please verify your email
        to continue.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCheckVerification}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Check Verification Status</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleResendVerification}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>
          Resend Verification Email
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login" as never)}
      >
        <Text style={styles.logoutButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
  },
});

export default CheckEmailScreen;
