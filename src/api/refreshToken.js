import { URL } from "/src/api/API";

// 액세스 토큰 재발급 요청하는 API
export async function refreshToken() {
  try {
    const response = await fetch(`${URL}/auth/refresh-accessToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (data === "Refresh Token has expired") {
      window.location.href = "/login";
    }

    const oldAccessToken = localStorage.getItem("accessToken");
    const newAccessToken = data.accessToken;

    if (oldAccessToken === newAccessToken) {
      console.error("Access token was not refreshed.");
    }

    if (
      newAccessToken &&
      newAccessToken !== null &&
      newAccessToken !== undefined
    ) {
      localStorage.setItem("accessToken", newAccessToken);

      console.log("토큰이 성공적으로 갱신되었습니다.");
    }
  } catch (error) {
    console.error(error.message);
    window.location.href = "/login";
  }
}
