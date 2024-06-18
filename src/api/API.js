//import URL from "/src/api/API";
export const URL = `http://localhost:3000`; // => 개발용 URL
// export const URL = `https://api.trip-teller.com`; // => 배포용 URL

export function useAPI() {
  const request = async (url, method = "GET", params = undefined) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log("`Bearer ${token}`: ", `Bearer ${token}`);
      }

      const options = {
        method,
        headers,
        credentials: "include", // 서버의 쿠키 허용
      };
      if (params) options.body = JSON.stringify(params);
      const response = await fetch(`${URL}${url}`, options);

      if (!response.ok) {
        const errorData = await response.json(); // 에러 응답 데이터 읽기
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }

      const data = await response.json();
      response.data = data;

      return response;
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다:", error);
      if (error.message === "Access Token has expired") {
        try {
          console.log("액세스 토큰이 만료되었습니다. 토큰을 갱신합니다.");
          await refreshToken(); // 토큰 갱신 시도

          const newAccessToken = localStorage.getItem("accessToken");
          headers.Authorization = `Bearer ${newAccessToken}`;

          const retryResponse = await fetch(`${URL}${endpoint}`, {
            ...config,
            headers,
          });

          if (!retryResponse.ok) {
            const retryErrorData = await retryResponse.json();
            throw new Error(
              retryErrorData.message || "네트워크 응답이 올바르지 않습니다.",
            );
          }

          return retryResponse.json();
        } catch (refreshError) {
          console.error("토큰 갱신에 실패했습니다.", refreshError.message);
          throw refreshError; // 토큰 갱신 실패 처리
        }
      }
      throw error;
    }
  };

  return {
    request,
  };
}
