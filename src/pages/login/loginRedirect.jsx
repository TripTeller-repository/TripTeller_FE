import React, { useEffect } from "react";
import { URL } from "/src/api/API";

const RedirectPage = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    async function signInByCode() {
      try {
        const response = await fetch(`${URL}/auth/sign-in/kakao`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ code }),
          credentials: "include", // 쿠키 포함
        });
        const data = await response.json();

        // 토큰 있을 때만 localStorage에 넣어주기
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        } else {
          console.log("토큰이 없어서 카카오 로그인 실패");
        }
        window.location.href = "/";
      } catch (error) {
        console.error("SignIn error:", error);
      }
    }

    signInByCode();
  }, []);

  return (
    <>
      <div>로그인 중입니다.</div>
    </>
  );
};

export default RedirectPage;
