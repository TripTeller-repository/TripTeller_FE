import React from "react";
import styled from "styled-components";

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  align-items: center;
`;

const BackwardIcon = styled.img`
  width: 32px;
  height: 32px;

  &:hover {
    // 화살표 아이콘 호버시 색 변경
    filter: brightness(0.9);
  }
`;

function ArrowForwardBtn() {
  return (    
    <IconContainer>
      <BackwardIcon src="./icon/arrow_back.svg" />
    </IconContainer>
  );
}

export default ArrowForwardBtn;