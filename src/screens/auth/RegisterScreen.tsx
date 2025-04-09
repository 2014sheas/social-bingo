import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../store/slices/authSlice";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/auth/validation";
import { handleFirebaseError } from "../../utils/auth/errorHandling";
import { ValidationErrors } from "../../utils/auth/validation";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword:
        password !== confirmPassword ? "Passwords do not match" : undefined,
      username: validateUsername(username),
    };
    setErrors(newErrors);
    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword &&
      !newErrors.username
    );
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      dispatch(registerStart());
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      dispatch(
        registerSuccess({
          id: user.uid,
          email: user.email || "",
          username: username,
        })
      );
      navigation.navigate("Verification");
    } catch (error: any) {
      handleFirebaseError(error, setErrors);
      dispatch(registerFailure("Registration failed. Please try again."));
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <AuthInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors((prev) => ({ ...prev, username: undefined }));
        }}
        error={errors.username}
        autoCapitalize="none"
      />

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
          setErrors((prev) => ({
            ...prev,
            password: undefined,
            confirmPassword: undefined,
          }));
        }}
        error={errors.password}
        secureTextEntry
      />

      <AuthInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }}
        error={errors.confirmPassword}
        secureTextEntry
      />

      <AuthButton
        title="Register"
        onPress={handleRegister}
        loading={isLoading}
      />

      <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
        <Text style={styles.loginText}>
          Already have an account? Login here
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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default RegisterScreen;
