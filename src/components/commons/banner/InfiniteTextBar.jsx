import React from "react";
import styled, { keyframes } from "styled-components";

// 텍스트 바를 나타내는 스타일드 컴포넌트
const TextBar = styled.div`
  width: 1200px;
  height: 30px;
  // background-color: var(--back-color);
  line-height: 30px;
  white-space: nowrap; /* 텍스트가 줄 바꿈되지 않도록 설정 */
  overflow: hidden; /* 넘칠 경우 숨김 처리 */
  position: relative; /* 자식 요소를 상대적으로 배치하기 위해 필요 */
`;

// 애니메이션 키프레임 정의
const moveText = keyframes`
  0% {
    transform: translateX(100%); /* 시작 위치 */
  }
  100% {
    transform: translateX(-100%); /* 끝 위치 */
  }
`;

// 흐르는 효과를 가진 텍스트 스타일드 컴포넌트
const MovingText = styled.div`
  width: 100%;
  display: inline-block; /* 텍스트가 가로로 흐를 수 있도록 inline-block으로 설정 */
  animation: ${moveText} 30s linear infinite; /* 5초 동안 흐르는 애니메이션 적용 */
`;

// React 컴포넌트 정의
const InfiniteTextBar = ({ children }) => {
  return (
    <TextBar>
      <MovingText>{children}</MovingText>
    </TextBar>
  );
};

export default InfiniteTextBar;
