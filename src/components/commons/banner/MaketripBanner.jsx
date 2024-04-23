import styled from "styled-components";
import dayjs from "dayjs";

const coverImage = "/img/banner_maketrip.jpg";

const BannerContainer = styled.div`
  width: 100%;
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url(${(prop) => prop.$coverImage || coverImage});
  background-size: cover;
  background-position: center;
`;
const ContainerText = styled.div`
  height: 96px;
  margin: 82px 0 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
`;
const ContainerButton = styled.div`
  width: 100%;
  height: 74px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const Title = styled.h1`
  color: white;
  font-size: 36px;
  margin-bottom: 16px;
`;
const Date = styled.p`
  font-size: 20px;
  color: white;
`;

// UTC 시간을 날짜 포맷으로 변경
const formattedDate = (date) => {
  return dayjs(date).locale("ko").format("YYYY.MM.DD");
};

// Mytrip-일정생성 페이지 공통 Banner구현
function MaketripBanner({
  children,
  travelPlanData = {
    title: "제목이 없습니다🌸",
    startDate: "시작 날짜가 없습니다",
    endDate: "종료 날짜가 없습니다",
  },
  coverImage,
}) {
  const { title, startDate, endDate } = travelPlanData;

  return (
    <>
      <BannerContainer $coverImage={coverImage}>
        <ContainerText>
          <Title>{title}</Title>
          <Date>
            {formattedDate(startDate)} ~ {formattedDate(endDate)}
          </Date>
        </ContainerText>
        <ContainerButton>{children}</ContainerButton>
      </BannerContainer>
    </>
  );
}

export default MaketripBanner;
