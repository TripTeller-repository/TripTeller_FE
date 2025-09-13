export const URL =
  import.meta.env.VITE_API_URL || `https://api.trip-teller.com`;

import React from "react";

export function useAPI() {
  const request = React.useCallback(
    async (url, method = "GET", body, opts = {}) => {
      const {
        headers: extraHeaders = {},
        bearerToken = null,
        noAuth = false,
        fetchOptions = {},
      } = opts;

      const headers = {
        "Content-Type": "application/json",
        ...extraHeaders,
      };

      // Authorization: noAuth → bearerToken → localStorage accessToken
      if (!noAuth) {
        const accessToken = localStorage.getItem("accessToken");
        const tokenToUse = bearerToken ?? accessToken;
        if (tokenToUse) {
          headers.Authorization = `Bearer ${tokenToUse}`;
        }
      }

      const init = {
        method,
        headers,
        credentials: "include", // httpOnly 쿠키 받기
        ...fetchOptions,
      };

      if (body !== undefined && body !== null) {
        init.body = JSON.stringify(body);
      }

      const res = await fetch(`${URL}${url}`, init);

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.toLowerCase().includes("application/json");
      const data = isJson ? await res.json().catch(() => ({})) : undefined;

      if (!res.ok) {
        const message =
          (data && data.message) ||
          `HTTP ${res.status} ${res.statusText || ""}`.trim();
        throw new Error(message);
      }

      return { status: res.status, ok: res.ok, data };
    },
    [],
  );

  return { request };
}
