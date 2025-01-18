import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    {
      try {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        // 토큰 있을 때만 localStorage에 넣어주기
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } else {
          console.error("카카오 로그인 중 액세스 토큰을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("Kakao SignIn error:", error);
      }
    }

    // 로그인 실패/성공 여부와 무관하게 메인 화면으로 리다이렉트
    navigate("/");
  }, [navigate]);

  return (
    <>
      <div>로그인 중입니다.</div>
    </>
  );
};

export default RedirectPage;
