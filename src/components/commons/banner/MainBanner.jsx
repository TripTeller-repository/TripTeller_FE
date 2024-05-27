import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const BannerWrapper = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  margin-bottom: 30px;
`;

const BannerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => props.$translateValue}%);
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: ${(props) => `url(${props.$imageurl})`};
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
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
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
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
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
  background-color: ${(props) => (props.$active ? "var(--main-color)" : "#ccc")};
  margin: 0 5px;
`;

function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideImages = [
    "/img/mainbanner.gif",
    "/img/banner04.jpg",
    "/img/banner01.jpeg",
    "/img/banner02.jpg",
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slideImages.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slideImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 3000); // 정해진 초마다 슬라이드 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  }, []);

  return (
    <BannerWrapper>
      <BannerContainer $translateValue={-currentSlide * 100}>
        {slideImages.map((image, index) => (
          <Slide key={index} $imageurl={image}>
            <BannerText1>여행의 시작과 끝, 모든 순간을 함께</BannerText1>
            <BannerText2>TripTeller</BannerText2>
          </Slide>
        ))}
      </BannerContainer>
      <IconContainerWrapper>
        <IconContainer>
          <BackwardIcon src="./icon/arrow_back.svg" onClick={handlePrevSlide} />
          <ForwardIcon src="./icon/arrow_forward.svg" onClick={handleNextSlide} />
        </IconContainer>
      </IconContainerWrapper>
      <PageIndicator>
        {slideImages.map((_, index) => (
          <PageDot key={index} $active={currentSlide === index} />
        ))}
      </PageIndicator>
    </BannerWrapper>
  );
}

export default MainBanner;
