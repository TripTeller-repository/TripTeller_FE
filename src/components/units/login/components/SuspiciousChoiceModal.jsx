import React from "react";
import styled from "styled-components";

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
  width: 450px;
  max-width: 92vw;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h3`
  margin: 0 0 16px;
  color: var(--main-color);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SecurityIcon = styled.span`
  font-size: 1.2em;
  color: #ff6b35;
`;

const Text = styled.p`
  margin: 0 0 16px;
  color: var(--text-color);
  line-height: 1.5;
`;

const FactorsList = styled.ul`
  background: #fff3e0;
  border: 1px solid #ffcc80;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;

  li {
    color: #e65100;
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
`;

const Ghost = styled.button`
  border: 1px solid var(--main2-color);
  background: transparent;
  color: var(--text-color);
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: var(--text-color);
  }
`;

const Solid = styled.button`
  background: var(--main-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: var(--main-hover-color);
  }
`;

const RecommendationBox = styled.div`
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
`;

const RecommendationText = styled.p`
  margin: 0;
  color: #2e7d32;
  font-size: 0.9rem;
  font-weight: 500;
`;

export default function SuspiciousChoiceModal({
  message,
  suspiciousFactors = [],
  userHas2FA = false,
  onChooseNormal,
  onChoose2FA,
  onClose,
}) {
  const defaultMessage = "의심스러운 로그인이 감지되었습니다.";

  const factorMessages = {
    ip_change: "IP 주소 변경 감지",
    device_change: "새로운 기기에서 접속",
    long_absence: "오랜 기간 미접속 후 로그인",
    "기기 또는 위치 변경 감지": "기기 또는 위치 변경 감지",
  };

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>
          <SecurityIcon>🔒</SecurityIcon>
          보안 알림
        </Title>

        <Text>{message || defaultMessage}</Text>

        {suspiciousFactors && suspiciousFactors.length > 0 && (
          <>
            <Text style={{ marginBottom: "8px", fontWeight: "500" }}>
              감지된 의심 요소:
            </Text>
            <FactorsList>
              {suspiciousFactors.map((factor, index) => (
                <li key={index}>{factorMessages[factor] || factor}</li>
              ))}
            </FactorsList>
          </>
        )}

        <RecommendationBox>
          <RecommendationText>
            {userHas2FA
              ? "2단계 인증으로 계정을 더욱 안전하게 보호하세요."
              : "2단계 인증 설정으로 계정 보안을 강화하는 것을 권장합니다."}
          </RecommendationText>
        </RecommendationBox>

        <Text style={{ fontSize: "0.9rem", color: "#666" }}>
          본인의 로그인이 맞다면 아래 옵션 중 하나를 선택해주세요:
        </Text>

        <Actions>
          <Ghost onClick={onChooseNormal}>일반 로그인 진행</Ghost>
          <Solid onClick={onChoose2FA}>
            {userHas2FA ? "2단계 인증 진행" : "2단계 인증 설정"}
          </Solid>
        </Actions>
      </Card>
    </Overlay>
  );
}
