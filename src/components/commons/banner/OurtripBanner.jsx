import styled from "styled-components";
// import InfiniteTextBar from "./InfiniteTextBar";

const BannerContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  padding: 40px 0;
  background: linear-gradient(to right, var(--sub-color), var(--main2-color));
  background-image: url("/img/banner03.jpg");
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BannerText = styled.p`
  font-size: 36px;
  font-family: "PretendardSemiBold";
  color: var(--white-color);
  text-align: center;
  line-height: 48px;
  margin-bottom: 52px;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 0.3s forwards; // 글자 애니메이션 효과
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
// const FlowContent = styled.span`
//   font-family: PretendardExtraBold;
//   margin: 0 30px;
//   padding: 6px 16px;
//   height: 20px;
//   background-color: rgba(0, 0, 0, 0.2);
//   border-radius: 16px;
//   color: white;
// `;

function OurtripBanner({ feedLength }) {
  return (
    <BannerContainer>
      <BannerText>
        {feedLength}개의 여행족보가
        <br />
        당신을 기다리고 있어요!
      </BannerText>
      {/* <InfiniteTextBar>
        <FlowContent>#서울특별시</FlowContent>
        <FlowContent>#강원도</FlowContent>
        <FlowContent>#맛집여행</FlowContent>
        <FlowContent>#부산여행</FlowContent>
        <FlowContent>#벚꽃나들이</FlowContent>
        <FlowContent>#전국투어</FlowContent>
        <FlowContent>#제주도여행</FlowContent>
        <FlowContent>#디저트투어</FlowContent>
        <FlowContent>#진해군항제</FlowContent>
        <FlowContent>#광안리여행</FlowContent>
        <FlowContent>#한강공원</FlowContent>
        <FlowContent>#불꽃놀이축제</FlowContent>
        <FlowContent>#서울특별시</FlowContent>
        <FlowContent>#강원도</FlowContent>
        <FlowContent>#맛집여행</FlowContent>
        <FlowContent>#부산여행</FlowContent>
        <FlowContent>#벚꽃나들이</FlowContent>
        <FlowContent>#전국투어</FlowContent>
        <FlowContent>#제주도여행</FlowContent>
        <FlowContent>#디저트투어</FlowContent>
        <FlowContent>#진해군항제</FlowContent>
        <FlowContent>#광안리여행</FlowContent>
        <FlowContent>#한강공원</FlowContent>
        <FlowContent>#푸바오</FlowContent>
      </InfiniteTextBar> */}
    </BannerContainer>
  );
}

export default OurtripBanner;
