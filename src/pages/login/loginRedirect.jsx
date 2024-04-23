import React, {  useEffect } from "react";

const RedirectPage = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    async function signInByCode() {
      try {
        const response = await fetch("signIn/kakao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ code }),
        });
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
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
