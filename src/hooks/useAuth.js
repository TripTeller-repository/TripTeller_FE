import { useState, useEffect, useCallback } from "react";
import { useAPI } from "/src/api/API";

export function useAuth() {
  const { request } = useAPI();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 토큰 유효성 검사
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // 토큰이 있으면 서버에 검증 요청
      const response = await request("/user/info", "GET");

      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      if (
        error.message.includes("expired") ||
        error.message.includes("invalid")
      ) {
        await refreshToken();
      } else {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [request]);

  // 토큰 재발급
  const refreshToken = useCallback(async () => {
    try {
      const response = await request("/auth/refresh-accessToken", "POST");

      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setIsAuthenticated(true);

        // 의심스러운 로그인 감지 시 사용자에게 알림
        if (response.data.suspicious) {
          console.warn("의심스러운 로그인이 감지되었습니다.");
          // 필요시 추가 보안 조치
        }

        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      return false;
    }
  }, [request]);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await request("/auth/logout", "POST");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
      // 메인 페이지로 리다이렉트
      window.location.href = "/";
    }
  }, [request]);

  // 로그인 성공 처리
  const handleLoginSuccess = useCallback((userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // 2FA 상태 조회
  const get2FAStatus = useCallback(async () => {
    try {
      const response = await request("/auth/2fa/status", "GET");
      return response.data;
    } catch (error) {
      console.error("Failed to get 2FA status:", error);
      return {
        enabled: false,
        backupCodesCount: 0,
        setupCompletedAt: null,
        lastAuthenticatedAt: null,
      };
    }
  }, [request]);

  // 로그인 히스토리 조회
  const getLoginHistory = useCallback(async () => {
    try {
      const response = await request("/auth/login-history", "GET");
      return response.data.loginHistory || [];
    } catch (error) {
      console.error("Failed to get login history:", error);
      return [];
    }
  }, [request]);

  // 2FA 비활성화
  const disable2FA = useCallback(
    async (token) => {
      try {
        const response = await request("/auth/2fa/disable", "POST", { token });
        return response.data;
      } catch (error) {
        throw new Error(error.message || "2FA 비활성화에 실패했습니다.");
      }
    },
    [request],
  );

  // 백업 코드 재생성
  const regenerateBackupCodes = useCallback(
    async (token) => {
      try {
        const response = await request("/auth/2fa/backup-codes", "POST", {
          token,
        });
        return response.data;
      } catch (error) {
        throw new Error(error.message || "백업 코드 재생성에 실패했습니다.");
      }
    },
    [request],
  );

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 토큰 만료 시 자동 재발급을 위한 interceptor 설정
  useEffect(() => {
    let refreshTimer;

    if (isAuthenticated) {
      // 8분마다 토큰 재발급 시도 (10분 만료되기 전에)
      refreshTimer = setInterval(
        async () => {
          await refreshToken();
        },
        8 * 60 * 1000,
      );
    }

    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [isAuthenticated, refreshToken]);

  return {
    isAuthenticated,
    loading,
    user,
    logout,
    handleLoginSuccess,
    checkAuthStatus,
    refreshToken,
    get2FAStatus,
    getLoginHistory,
    disable2FA,
    regenerateBackupCodes,
  };
}
