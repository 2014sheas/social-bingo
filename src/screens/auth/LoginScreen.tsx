import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import { validateEmail, validatePassword } from "../../utils/auth/validation";
import { handleFirebaseError } from "../../utils/auth/errorHandling";
import { ValidationErrors } from "../../utils/auth/validation";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      dispatch(loginStart());
      console.log("Attempting login...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Updating last login timestamp...");
      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: new Date().toISOString(),
      });

      console.log("Login successful, navigating to MainTab...");
      dispatch(
        loginSuccess({
          id: user.uid,
          email: user.email || "",
          username: user.displayName || "",
        })
      );
      navigation.navigate("Main", { screen: "Home" });
    } catch (error: any) {
      console.log("Login error:", error);
      handleFirebaseError(error, setErrors);
      dispatch(
        loginFailure(
          "Login failed. Please check your credentials and try again."
        )
      );
    }
  };

  const handleRegister = () => {
    console.log("Navigating to Register...");
    navigation.navigate("Auth", { screen: "Register" });
  };

  const handleForgotPassword = () => {
    console.log("Navigating to PasswordReset...");
    navigation.navigate("Auth", { screen: "PasswordReset" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
        secureTextEntry
      />

      <AuthButton title="Login" onPress={handleLogin} loading={isLoading} />

      <TouchableOpacity
        style={styles.forgotPasswordLink}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerLink} onPress={handleRegister}>
        <Text style={styles.registerText}>
          Don't have an account? Register here
        </Text>
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
    marginBottom: 30,
    textAlign: "center",
  },
  forgotPasswordLink: {
    marginTop: 15,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default LoginScreen;
