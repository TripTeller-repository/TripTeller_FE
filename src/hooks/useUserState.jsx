import { useAPI } from "/src/api/API";
import { User } from "/src/models/User";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { userState } from "/src/recoil/userState";
import { refreshToken } from "../api/refreshToken";
import { URL } from "../api/API";

export function useUserState() {
  const { request } = useAPI();
  const [user, _setUser] = useRecoilState(userState);
  const isSigned = useMemo(() => user !== null, [user]);

  const setUser = (newUser) => {
    if (newUser instanceof User) _setUser(newUser);
    else if (newUser === null) _setUser(null);
    else
      _setUser(new User(newUser.nickname, newUser.email, newUser.profileImage));
  };

  // 토큰 유효성 확인 함수
  const checkTokenValidity = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access Token not found");
    }

    try {
      const response = await fetch(`${URL}/auth/verifyAccessToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("response", response);
    } catch (error) {
      console.error("토큰 유효성 검사 중 오류 발생:", error.message);
      if (error.message === "Access Token has expired") {
        try {
          await refreshToken();
          await fetchCurrentUser();
        } catch (refreshError) {
          console.error("토큰 갱신에 실패했습니다:", refreshError.message);
          throw refreshError;
        }
      } else {
        throw error;
      }
    }
  };

  // 현재 로그인한 사용자 정보를 가져옴
  const fetchCurrentUser = async () => {
    try {
      await checkTokenValidity(); // 토큰 유효성 확인

      const response = await request("/user/info");

      if (response.ok) {
        setUser(response.data);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      console.error(
        "사용자 정보를 불러오는 중에 오류가 발생했습니다:",
        error.message,
      );
      if (error.message === "Access Token has expired") {
        try {
          await refreshToken();
          await fetchCurrentUser();
        } catch (refreshError) {
          console.error("토큰 갱신에 실패했습니다:", refreshError.message);
          throw refreshError;
        }
      } else {
        throw error;
      }
    }
  };

  return {
    user,
    setUser,
    isSigned,
    fetchCurrentUser,
  };
}
