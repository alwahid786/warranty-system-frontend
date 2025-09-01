import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

console.log("accessToken in cookies ----", Cookies.get("accessToken"));

export const getUserIdFromToken = () => {
  const token = Cookies.get("accessToken");
  console.log("token from cookies ----", token); // 👀 Debug log
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("decoded token ----", decoded); // 👀 Debug log
    return decoded.id || decoded._id;
  } catch (err) {
    console.error("Token decode failed", err);
    return null;
  }
};
