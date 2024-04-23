import React, { useState } from "react";
import styled from "styled-components";

const BannerContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 30px;
  background-position: center;
  bacground-size: cover;
  background-image: ${(props) => `url(${props.$imageurl})`};
  background-color: ${(props) => props.$backgroundColor};
`;

const BannerText1 = styled.div`
  font-size: 25px;
  font-family: "PretendardSemiBold";
  color: var(--main-color);
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 0.3s forwards;
  margin-top: 120px;

  text-shadow: (--box-shadow);

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const BannerText2 = styled.div`
  font-size: 76px;
  font-weight: 900;
  font-family: "PretendardBlack";
  color: var(--main-color);
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 1s forwards;
  text-shadow: var(--box-shadow);

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const IconContainerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 600px;
`;

const BackwardIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
  transition: transform 0.3s ease; /* 호버 시 변환 효과 설정 */

  /* 호버 시 이미지 크기 확대 */
  &:hover {
    transform: scale(1.1); /* 이미지 크기를 1.1배로 확대 */
  }
  &:active {
    filter: brightness(2);
  }
`;

const ForwardIcon = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
  transition: transform 0.3s ease; /* 호버 시 변환 효과 설정 */

  /* 호버 시 이미지 크기 확대 */
  &:hover {
    transform: scale(1.1); /* 이미지 크기를 1.1배로 확대 */
  }
  &:active {
    filter: brightness(2);
  }
`;

const PageIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? "var(--main-color)" : "#ccc"};
  margin: 0 5px;
`;

function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideImages = [
    "/img/banner04.jpg",
    "/img/mainbanner.gif",
    "/img/banner02.jpg", //2,3번째 슬라이드에는 이미지 안 넣음
  ];

  const slideBackgroundColors = [
    "", // 첫 번째 슬라이드 배경색
    "",
    "",
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slideImages.length - 1 : prevSlide - 1,
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slideImages.length);
  };

  return (
    <BannerContainer
      $imageurl={slideImages[currentSlide]}
      $backgroundColor={slideBackgroundColors[currentSlide]}
    >
      <BannerText1
        style={{ color: currentSlide === 1 ? "var(--main-color)" : "white" }}
      >
        여행의 시작과 끝, 모든 순간을 함께
        <br />
      </BannerText1>
      <BannerText2
        style={{ color: currentSlide === 1 ? "var(--main-color)" : "white" }}
      >
        TripTeller
      </BannerText2>
      <IconContainerWrapper>
        <IconContainer>
          <BackwardIcon src="./icon/arrow_back.svg" onClick={handlePrevSlide} />
          <ForwardIcon
            src="./icon/arrow_forward.svg"
            onClick={handleNextSlide}
          />
        </IconContainer>
      </IconContainerWrapper>
      <PageIndicator>
        {slideImages.map((_, index) => (
          <PageDot key={index} $active={currentSlide === index} />
        ))}
      </PageIndicator>
    </BannerContainer>
  );
}

export default MainBanner;
