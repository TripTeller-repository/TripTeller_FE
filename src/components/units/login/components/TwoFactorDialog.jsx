import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useAPI } from "/src/api/API";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  width: 420px;
  max-width: 92vw;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h3`
  margin: 0 0 12px;
  color: var(--main-color);
`;

const Text = styled.p`
  margin: 0 0 16px;
  color: var(--text-color);
  line-height: 1.5;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 500;
`;

const Small = styled.small`
  color: var(--main2-color);
  font-size: 0.8rem;
  text-align: center;
  margin: 8px 0;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--main2-color);
  padding: 0 12px;
  text-align: center;
  font-size: 1.1rem;
  letter-spacing: ${(props) => (props.isNumeric ? "2px" : "normal")};

  &:focus {
    outline: none;
    border-color: var(--main-color);
  }
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Ghost = styled.button`
  border: 1px solid var(--main2-color);
  background: transparent;
  color: var(--text-color);
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const Solid = styled.button`
  background: var(--main-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--main-hover-color);
  }

  &:disabled {
    background: var(--main2-color);
    cursor: not-allowed;
  }
`;

const SkipOption = styled.div`
  text-align: center;
  margin: 16px 0;
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: var(--main2-color);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    color: var(--text-color);
  }
`;

export default function TwoFactorDialog({
  tempToken,
  onSuccess,
  onCancel,
  allowSkip = false, // 의심스러운 로그인에서만 건너뛰기 허용
}) {
  const { request } = useAPI();
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [usingBackup, setUsingBackup] = useState(false);

  const canSubmit = useMemo(
    () => !!tempToken && (!!totpCode || !!backupCode),
    [tempToken, totpCode, backupCode],
  );

  const submit2FA = async (skipTwoFactor = false) => {
    if (!skipTwoFactor && !canSubmit) return;

    try {
      setSubmitting(true);
      setError("");

      const requestBody = {
        tempToken,
        skipTwoFactor,
      };

      // skipTwoFactor가 false일 때만 코드 추가
      if (!skipTwoFactor) {
        if (totpCode) {
          requestBody.totpCode = totpCode;
        }
        if (backupCode) {
          requestBody.backupCode = backupCode;
        }
      }

      const resp = await request("/auth/2fa/verify", "POST", requestBody);

      if (resp?.data?.accessToken) {
        localStorage.setItem("accessToken", resp.data.accessToken);
      }
      onSuccess?.(resp?.data);
    } catch (e) {
      console.error("2FA verification error:", e);
      setError(e?.message || "2단계 인증에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    submit2FA(true);
  };

  const toggleInputMode = () => {
    setUsingBackup(!usingBackup);
    setTotpCode("");
    setBackupCode("");
    setError("");
  };

  return (
    <Overlay onClick={onCancel}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>2단계 인증</Title>
        <Text>
          {usingBackup
            ? "백업 코드를 입력해주세요."
            : "인증 앱에서 생성된 6자리 코드를 입력해주세요."}
        </Text>

        <Field>
          <Label htmlFor={usingBackup ? "backup" : "totp"}>
            {usingBackup ? "백업 코드" : "인증 코드"}
          </Label>
          {usingBackup ? (
            <Input
              id="backup"
              placeholder="ABCD-EFGH"
              value={backupCode}
              onChange={(e) => {
                setBackupCode(e.target.value.toUpperCase());
                if (error) setError("");
              }}
            />
          ) : (
            <Input
              id="totp"
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              isNumeric
              value={totpCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setTotpCode(value);
                if (error) setError("");
              }}
            />
          )}
        </Field>

        <Small>
          <button
            type="button"
            onClick={toggleInputMode}
            style={{
              background: "none",
              border: "none",
              color: "var(--main-color)",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "inherit",
            }}
          >
            {usingBackup ? "인증 앱 코드 사용" : "백업 코드 사용"}
          </button>
        </Small>

        {error && (
          <Text style={{ color: "#e53935", fontSize: "0.9rem" }}>{error}</Text>
        )}

        <Actions>
          <Ghost onClick={onCancel}>취소</Ghost>
          <Solid
            disabled={!canSubmit || submitting}
            onClick={() => submit2FA(false)}
          >
            {submitting ? "확인 중..." : "확인"}
          </Solid>
        </Actions>

        {allowSkip && (
          <SkipOption>
            <SkipButton onClick={handleSkip} disabled={submitting}>
              2단계 인증 건너뛰고 로그인
            </SkipButton>
          </SkipOption>
        )}
      </Card>
    </Overlay>
  );
}
