import { message } from "antd";

export const isAccessTokenExpired = () => {
  const expirationTime = localStorage.getItem("accessTokenExpiration");
  if (!expirationTime) return true;

  const currentTime = new Date().getTime();
  return currentTime > parseInt(expirationTime, 10);
};

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || isAccessTokenExpired()) {
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch("http://localhost:8000/refresh-token", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh access token.");
      }

      const { accessToken: newAccessToken, accessTokenExpiresIn } = await response.json();
      const accessTokenExpirationTime = new Date().getTime() + accessTokenExpiresIn * 1000;
      const accessTokenExpirationDate = new Date(accessTokenExpirationTime).toLocaleString();
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("accessTokenExpirationDate", accessTokenExpirationDate);

      return newAccessToken;
    } catch (error) {
      message.error("Failed to refresh access token: " + error);
      logout();
      return null;
    }
  }

  return accessToken;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpirationDate");
  localStorage.removeItem("refreshTokenExpirationDate");
  localStorage.removeItem("roles");
  message.success("Logged out successfully.");
};