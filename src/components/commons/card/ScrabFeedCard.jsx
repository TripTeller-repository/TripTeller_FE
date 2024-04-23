import React, { useState } from "react";
import styled from "styled-components";
import HeartIcon from "/icon/heart_on.svg";
import EmptyHeartIcon from "/icon/heart_off.svg";
import dayjs from "dayjs";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 350px;
  border-radius: 5px;
  position: relative;        // 아이콘 사진 안에 배치하기 위해
`;

const ImageContainer = styled.div`
  width: 380px;
  height: 250px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const IconWrapper = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer; 
`;

const TextContainer = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  text-align: start;
`;

const Description = styled.div`
  font-size: 14px;
  color: var(--placeholder-color);
  margin-bottom: 10px;
  text-align: start;
`;

function ScrabFeedCard({ imageUrl, title, startDate, endDate }) {
  const [scrap, setScrap] = useState(true); // 하트 채워진 상태가 기본값

  const toggleScrap = () => {
    setScrap(!scrap); // true/false 값
  };

  const formattedDate = (date) => {
    return dayjs(date).locale("ko").format("YYYY.MM.DD");
  };

  return (
    <CardContainer>
      <ImageContainer>
        <Image src={imageUrl ? imageUrl : "/img/triplog_default.jpg"} alt="Trip Image" />
      </ImageContainer>
      <IconWrapper
        src={scrap ? HeartIcon : EmptyHeartIcon} // 하트 아이콘 누르면 빈 하트로 변경
        alt="Heart Icon"
        onClick={toggleScrap} // 아이콘 클릭하면 toggleScrap 함수 호출됨
      />
      <TextContainer>
        <Title>{title}</Title>
        <Description>{formattedDate(startDate)} ~ {formattedDate(endDate)}</Description>
      </TextContainer>
    </CardContainer>
  );
}

export default ScrabFeedCard;
