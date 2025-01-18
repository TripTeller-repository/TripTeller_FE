import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 350px;
  border-radius: 5px;
`;

const ImageContainer = styled.a`
  width: 380px;
  height: 250px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: transform 0.3s ease; /* 호버 시 변환 효과 설정 */

  /* 호버 시 이미지 크기 확대 */
  &:hover {
    transform: scale(1.05); /* 이미지 크기를 1.1배로 확대 */
  }
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
  text-align: left;

  &:hover {
    color: var(--main-color);
    transition-duration: 0.2s;
  }
`;

const Description = styled.div`
  font-size: 14px;
  color: var(--placeholder-color);
  margin-bottom: 10px;
  text-align: left;
`;

function FeedCard({ imageUrl, title, startDate, endDate, href }) {
  const formattedDate = (date) => {
    return dayjs(date).tz("Asia/Seoul").locale("ko").format("YYYY.MM.DD");
  };

  return (
    <CardContainer>
      <ImageContainer href={href}>
        <Image
          src={imageUrl ? imageUrl : "/img/triplog_default.jpg"}
          alt="Trip Image"
        />
      </ImageContainer>
      <TextContainer>
        <a href={href}>
          <Title>{title}</Title>
        </a>
        <Description>
          {formattedDate(startDate)} ~ {formattedDate(endDate)}
        </Description>
      </TextContainer>
    </CardContainer>
  );
}

export default FeedCard;
