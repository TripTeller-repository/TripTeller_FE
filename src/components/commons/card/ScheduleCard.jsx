import styled from "styled-components";
import dayjs from "dayjs";

const flexColumn = `
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  width: 250px;
  height: 106px;
  padding: 14px;
  margin-bottom: 8px;
  margin: 10px;

  background-color: var(--back-color);
  border: 1px solid var(--main-color);
  border-radius: 10px;
`;

const SideLine = styled.div`
  width: 4px;
  height: 75px;
  background-color: var(--main-color);
  border-radius: 10px;
  margin-right: 16px;
  margin-left: 4px;
`;
const Contents = styled.div`
  ${flexColumn}
  height: 75px;
`;
const Time = styled.p`
  color: var(--main-color);
  font-size: 12px;
  font-family: "PretendardSemiBold";
  height: 100%;
`;
const Location = styled.h4`
  font-size: 16px;
  margin-bottom: 8px;
`;
const Memo = styled.p`
  font-size: 12px;
`;
const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  img {
    width: 24px;
    heigth: 24px;
    margin-left: 8px;
    cursor: pointer;
  }
`;
// UTC 시간을 한국 시간 포맷으로 변경
const formattedTime = (time) => {
  return dayjs(time).locale("ko").format("A hh:mm");
};

const ScheduleCard = ({
  children,
  className,
  ScheduleInfo = {
    time: "오전 2:00",
    location: "경복궁",
    memo: "시내버스로 출발 이동",
  },
}) => {
  const { time, location, memo } = ScheduleInfo;

  return (
    <Container className={className}>
      <SideLine />
      <Contents>
        <Time>{formattedTime(time)}</Time>
        <Location>{location}</Location>
        <Memo>{memo}</Memo>
      </Contents>
      <ButtonContainer>{children}</ButtonContainer>
    </Container>
  );
};

export default ScheduleCard;
