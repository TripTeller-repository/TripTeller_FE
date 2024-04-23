import React, { useState } from 'react';
import styled from 'styled-components';
import ScheduleNewModal from "/src/components/commons/modals/ScheduleNewModal";

const AddScheduleContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%; // 상위 컨테이너에 맞춰서 100%로 설정
  margin-bottom: 8px;
`;

const AddScheduleHeaderContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center; // 세로 중앙 정렬 추가
  width: 100%; // 부모 컨테이너에 맞춰 100% 너비 설정
  margin: 10px;
`;

const AddScheduleCard = styled.div`
  display: flex;
  flex-direction: column; // 세로 방향 정렬
  align-items: center; // 가로축 중앙 정렬
  justify-content: center; // 세로축 중앙 정렬
  border: 1px solid var(--main-color);
  background-color: var(--white-color);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  width: 250px;
  height: 106px;

  &:hover {
    // 호버 상태 스타일 추가임시, 최종사용시 주석or코드삭제 다른스타일도 연구해보자
    background-color: var(--back-color);
  }
`;

const AddScheduleIcon = styled.div`
  display: flex; // 아이콘 중앙
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: none; // 버튼 기본 테두리 제거
  background: transparent; // 버튼 배경 투명하게 설정
  padding: 0; // 패딩 제거
  cursor: pointer; // 마우스 오버 시 커서 변경

  // 이미지나 아이콘에 추가 스타일
  img {
    width: 100%; // 이미지가 버튼 크기에 맞춰지도록 설정
    height: auto; // 이미지 비율 유지
  }
`;

const AddScheduleText = styled.div`
  margin-top: 8px; // 아이콘과 텍스트 사이의 간격
  color: var(--main-color); // 폰트 색상
  font-size: 14px; // 폰트 사이즈
  font-family: "PretendardSemiBold"; // 폰트 굵기
`;

const AddScheduleButtonCard = ({ planId, onScheduleCreate }) => {
  // 모달의 상태 관리를 위한 useState
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달을 여는 함수
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }
  
  // 모달을 닫는 함수
  const handleCloseModal = () => setIsModalOpen(false);

  // 함수 컴포넌트의 반환 부분
  return (
    <AddScheduleContainer>
      <AddScheduleHeaderContainer>
        <AddScheduleCard onClick={handleOpenModal}>
          <AddScheduleIcon><img src="/icon/add.svg" alt="Add Schedule" /></AddScheduleIcon>
          <AddScheduleText>일정 추가하기</AddScheduleText>
        </AddScheduleCard>        
      </AddScheduleHeaderContainer>
      {isModalOpen && (
        <ScheduleNewModal
          planId={planId}
          onClose={handleCloseModal}
          onCreate={onScheduleCreate}
        />
      )}
    </AddScheduleContainer>
  );
}

export default AddScheduleButtonCard;
