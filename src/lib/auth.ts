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
      const formData = new FormData();
      formData.append("refreshToken", refreshToken);

      const response = await fetch("http://localhost:8000/refresh-token", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
          throw new Error("Failed to refresh access token.");
        }
        console.log('response: ', response);

      const { accessToken: newAccessToken, accessTokenExpiresIn, refreshTokenExpiresIn } = await response.json();
      const accessTokenExpirationTime = new Date().getTime() + accessTokenExpiresIn * 1000;
      const accessTokenExpirationDate = new Date(accessTokenExpirationTime).toLocaleString();
    //   const refreshTokenExpirationTime = new Date().getTime() + refreshTokenExpiresIn * 1000;
    //   const refreshTokenExpirationDate = new Date(refreshTokenExpirationTime).toLocaleString();
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("accessTokenExpirationDate", accessTokenExpirationDate);
    //   localStorage.setItem("refreshTokenExpirationDate", refreshTokenExpirationDate);

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpirationDate");
      localStorage.removeItem("refreshTokenExpirationDate");
      return null;
    }
  }

  return accessToken;
};
