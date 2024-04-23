import React from "react";
import styled from "styled-components";

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
`;

const ForwardIcon = styled.img`
  width: 32px;
  height: 32px;  
  
  &:hover {
    filter: brightness(0.9);
  }
`;

function ArrowBackBtn() {
  return (    
    <IconContainer>
      <ForwardIcon src="./icon/arrow_forward.svg" />
    </IconContainer>
  );
}

export default ArrowBackBtn;