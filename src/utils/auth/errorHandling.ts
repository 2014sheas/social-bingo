import { ValidationErrors } from "./validation";

export const handleFirebaseError = (
  error: any,
  setErrors: (errors: ValidationErrors) => void
): void => {
  switch (error.code) {
    case "auth/user-not-found":
      setErrors({
        email:
          "No account found with this email. Please register or try a different email.",
      });
      break;
    case "auth/wrong-password":
      setErrors({ password: "Incorrect password. Please try again." });
      break;
    case "auth/invalid-email":
      setErrors({ email: "Please enter a valid email address." });
      break;
    case "auth/email-already-in-use":
      setErrors({
        email:
          "This email is already registered. Please try logging in or use a different email.",
      });
      break;
    case "auth/weak-password":
      setErrors({
        password: "Password is too weak. Please use a stronger password.",
      });
      break;
    case "auth/too-many-requests":
      setErrors({ email: "Too many attempts. Please try again later." });
      break;
    case "auth/network-request-failed":
      setErrors({
        email: "Network error. Please check your internet connection.",
      });
      break;
    case "auth/operation-not-allowed":
      setErrors({
        email: "This operation is currently disabled. Please contact support.",
      });
      break;
    case "auth/user-disabled":
      setErrors({
        email: "This account has been disabled. Please contact support.",
      });
      break;
    default:
      setErrors({ email: "An error occurred. Please try again." });
  }
};
