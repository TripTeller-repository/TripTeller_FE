//import URL from "/src/api/API";
// export const URL = `http://localhost:3000`; // => 개발용 URL
export const URL = `https://api.trip-teller.com`; // => 배포용 URL

export function useAPI() {
  const request = async (url, method = "GET", params = undefined) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        // console.log("`Bearer ${token}`: ", `Bearer ${token}`);
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

      throw error;
    }
  };

  return {
    request,
  };
}
