import React, { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko"; // 한국어 지원
import ScheduleDeleteModal from "/src/components/commons/modals/ScheduleDeleteModal";

dayjs.extend(utc);
dayjs.extend(timezone);

const DayContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%; // 상위 컨테이너에 맞춰서 100%로 설정
  margin-bottom: 36px; // 마진 조정
`;

const DayHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; // 요소들을 양쪽 끝으로 분산
  align-items: flex-end; // 요소들을 하단으로 정렬
  position: relative; // 휴지통 아이콘의 절대 위치를 위한 기준점
  width: 250px; // 필요한 너비로 조절
  height: 130px; // 필요한 높이로 조절
  // margin-right: 36px;
`;

const DayCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-color);
  color: var(--white-color);
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-right: 40px; // DateText와의 간격을 위해 추가
  width: 137px;
  height: 130px;
`;

const DayTitle = styled.h3`
  text-align: center;
  color: var(--white-color); // 폰트 색상
  font-size: 38px; // 폰트 사이즈
  font-family: "PretendardSemiBold"; // 폰트 굵기
  margin: 0;
`;

const DateText = styled.span`
  align-self: flex-end; // 컨테이너의 하단 정렬
  color: var(--text-color); // 폰트 색상
  font-size: 18px; // 폰트 사이즈
  font-family: "PretendardSemiBold"; // 폰트 굵기
`;

// DayDate 컴포넌트화, props로 day와 date를 받습니다.
const DayDateCard = ({ day, date, onDelete }) => {
  // 모달의 상태 관리를 위한 useState
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달을 닫는 함수
  const handleCloseModal = () => setIsModalOpen(false);

  // 날짜 포맷팅, dayjs 라이브러리 사용
  const formattedDate = dayjs(date).isValid()
    ? dayjs(date).tz("Asia/Seoul").format("M.D(dd)")
    : "유효하지 않은 날짜";

  // 함수 컴포넌트의 반환 부분
  return (
    <DayContainer>
      <DayHeaderContainer>
        <DayCard>
          <DayTitle>Day {day}</DayTitle>
        </DayCard>
        <DateText>{formattedDate}</DateText>
        {/* TrashIcon 클릭 시 handleOpenModal 함수 호출로 모달을 여는 역할 */}
      </DayHeaderContainer>
      {/* 모달 상태에 따라 ScheduleDeleteModal 컴포넌트 표시 */}
      {isModalOpen && (
        <ScheduleDeleteModal
          onClose={handleCloseModal}
          onDelete={() => {
            onDelete(day); // day가 삭제하고자 하는 날짜의 ID입니다.
            handleCloseModal(); // 모달 닫기
          }}
        />
      )}
    </DayContainer>
  );
};

export default DayDateCard;
