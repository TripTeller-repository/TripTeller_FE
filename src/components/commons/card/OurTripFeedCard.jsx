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
  position: relative;
`;

const ImageContainer = styled.a`
  width: 380px;
  height: 250px;
`;

const Image = styled.img`
  width: 380px;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
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
  text-align: start;

  &:hover {
    color: var(--main-color);
    transition-duration: 0.2s;
  }
`;

const Description = styled.div`
  font-size: 14px;
  color: var(--placeholder-color);
  margin-bottom: 10px;
  text-align: start;
`;

const Region = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-color);
  text-align: start;
`;

function OurTripFeedCard({ imageUrl, title, startDate, endDate, region, href }) {
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
          <Region>{region}</Region>
          <Title>{title}</Title>
        </a>
        <Description>
          {formattedDate(startDate)} ~ {formattedDate(endDate)}
        </Description>
      </TextContainer>
    </CardContainer>
  );
}

export default OurTripFeedCard;
