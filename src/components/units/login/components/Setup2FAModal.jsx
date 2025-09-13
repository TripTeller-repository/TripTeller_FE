import React, { useEffect, useState } from "react";
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
  width: 480px;
  max-width: 94vw;
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

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const QR = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ManualKey = styled.div`
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
  text-align: center;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--main2-color);
  padding: 0 12px;
  text-align: center;
  font-size: 1.1rem;
  letter-spacing: 2px;
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
`;

const Solid = styled.button`
  background: var(--main-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;

  &:disabled {
    background: var(--main2-color);
    cursor: not-allowed;
  }
`;

const BackupCodes = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
`;

const BackupCodeList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-family: monospace;
  font-size: 0.9rem;
`;

const BackupCodeItem = styled.div`
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
`;

export default function Setup2FAModal({ tempToken, onCancel, onSetupDone }) {
  const { request } = useAPI();
  const [qrSrc, setQrSrc] = useState("");
  const [manualEntryKey, setManualEntryKey] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [backupCodes, setBackupCodes] = useState(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const fetchedRef = React.useRef(false);

  // 1) QR/시크릿 생성
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        // 백엔드 API 구조에 맞춰 tempToken을 body에 포함
        const resp = await request("/auth/2fa/setup", "POST", {
          tempToken: tempToken,
        });

        const data = resp?.data || {};

        setQrSrc(data.qrCode || "");
        setManualEntryKey(data.manualEntryKey || "");
      } catch (e) {
        console.error("2FA setup error:", e);
        setError(e?.message || "2FA QR 생성에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [tempToken, request]);

  // 2) 사용자가 앱 등록 후 첫 코드로 설정 완료
  const completeSetup = async () => {
    if (!code || code.length !== 6) {
      setError("6자리 인증 코드를 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const resp = await request("/auth/2fa/verify-setup", "POST", {
        tempToken: tempToken,
        token: code,
      });

      const responseData = resp?.data || {};
      setBackupCodes(responseData.backupCodes || []);
      setSetupComplete(true);
    } catch (e) {
      console.error("2FA verify setup error:", e);
      setError(e?.message || "2FA 설정 완료에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    onSetupDone?.();
  };

  if (loading) {
    return (
      <Overlay onClick={onCancel}>
        <Card onClick={(e) => e.stopPropagation()}>
          <Title>2단계 인증 설정</Title>
          <Text>QR 코드를 생성하고 있습니다...</Text>
        </Card>
      </Overlay>
    );
  }

  if (setupComplete && backupCodes) {
    return (
      <Overlay onClick={(e) => e.stopPropagation()}>
        <Card onClick={(e) => e.stopPropagation()}>
          <Title>2단계 인증 설정 완료</Title>
          <Text>
            2단계 인증이 성공적으로 활성화되었습니다! 아래 백업 코드를 안전한
            곳에 보관해주세요.
          </Text>

          <BackupCodes>
            <Text style={{ margin: "0 0 12px", fontWeight: "600" }}>
              백업 코드 (각 코드는 한 번만 사용 가능)
            </Text>
            <BackupCodeList>
              {backupCodes.map((code, index) => (
                <BackupCodeItem key={index}>{code}</BackupCodeItem>
              ))}
            </BackupCodeList>
          </BackupCodes>

          <Text style={{ fontSize: "0.9rem", color: "#666" }}>
            이 백업 코드들은 휴대폰을 분실했을 때 계정에 접근하기 위해
            사용됩니다. 안전한 곳에 저장하고 다른 사람과 공유하지 마세요.
          </Text>

          <Actions>
            <Ghost onClick={onCancel}>나중에</Ghost>
            <Solid onClick={handleFinish}>확인</Solid>
          </Actions>
        </Card>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onCancel}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>2단계 인증 설정</Title>
        <Text>
          Google Authenticator 또는 다른 TOTP 앱으로 아래 QR 코드를 스캔한 후,
          앱에서 생성된 6자리 코드를 입력하세요.
        </Text>

        {qrSrc ? (
          <QRContainer>
            <QR src={qrSrc} alt="2FA QR Code" />
            {manualEntryKey && (
              <>
                <Text style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>
                  QR 코드를 스캔할 수 없는 경우, 아래 키를 수동으로 입력하세요:
                </Text>
                <ManualKey>{manualEntryKey}</ManualKey>
              </>
            )}
          </QRContainer>
        ) : (
          <Text style={{ color: "#e53935" }}>
            QR 코드 생성에 실패했습니다. 페이지를 새로고침하고 다시
            시도해주세요.
          </Text>
        )}

        <Row>
          <label htmlFor="first-code">인증 앱에서 생성된 6자리 코드</label>
          <Input
            id="first-code"
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setCode(value);
              if (error && value.length === 6) setError("");
            }}
          />
        </Row>

        {error && (
          <Text style={{ color: "#e53935", fontSize: "0.9rem" }}>{error}</Text>
        )}

        <Actions>
          <Ghost onClick={onCancel}>취소</Ghost>
          <Solid
            disabled={!code || code.length !== 6 || submitting}
            onClick={completeSetup}
          >
            {submitting ? "확인 중..." : "설정 완료"}
          </Solid>
        </Actions>
      </Card>
    </Overlay>
  );
}
