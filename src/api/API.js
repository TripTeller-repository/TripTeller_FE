// import URL from "/src/api/API";
export const URL = `http://http://kdt-sw-8-team07.elicecoding.com:3000`;

export function useAPI() {
  const request = async (url, method = "GET", params = undefined) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("accessToken");
      if (token) headers.Authorization = `Bearer ${token}`;

      const options = {
        method,
        headers,
      };
      if (params) options.body = JSON.stringify(params);
      const response = await fetch(`${URL}${url}`, options);

      if (!response.ok) {
        throw new Error(data.message || "네트워크 응답이 올바르지 않습니다.");
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
