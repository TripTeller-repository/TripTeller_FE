import React from "react";
import styled from "styled-components";

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AlertContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AlertTitle = styled.h3`
  color: var(--main-color);
  margin-top: 0;
  margin-bottom: 16px;
`;

const AlertMessage = styled.p`
  margin-bottom: 20px;
  color: var(--text-color);
  line-height: 1.5;
`;

const ConfirmButton = styled.button`
  background-color: var(--main-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #e02c4b;
  }
`;

function SuspiciousLoginAlert({ message, onClose }) {
  return (
    <AlertOverlay onClick={onClose}>
      <AlertContainer onClick={(e) => e.stopPropagation()}>
        <AlertTitle>보안 알림</AlertTitle>
        <AlertMessage>
          {message ||
            "의심스러운 로그인이 감지되었습니다. 본인이 아니라면 비밀번호를 변경해주세요."}
        </AlertMessage>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </AlertContainer>
    </AlertOverlay>
  );
}

export default SuspiciousLoginAlert;
