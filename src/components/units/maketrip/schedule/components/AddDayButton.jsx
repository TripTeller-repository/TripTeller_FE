import React from 'react';
import styled from 'styled-components';

const AddDayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  // 추가할 버튼의 스타일을 정의하세요
`;

const AddDayHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; // 요소들을 양쪽 끝으로 분산
  align-items: flex-end; // 요소들을 하단으로 정렬
  position: relative; // Add 아이콘의 절대 위치를 위한 기준점
  width: 250px; // 필요한 너비로 조절
  height: 130px; // 필요한 높이로 조절
  margin-right: 36px;  
`
const AddDayCard = styled.div`
  display: flex;
  flex-direction: column; // 요소들을 세로로 쌓기
  align-items: center; // 가로축 중앙 정렬
  justify-content: center; // 세로축 중앙 정렬
  border: 1px solid var(--main-color);
  background-color: var(--white-color);;
  color: var(--main-color);
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 134px;
  height: 126px;
`;

const AddDayIcon = styled.button`
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


const AddDayText = styled.span`
  margin-top: 8px; // 아이콘과 텍스트 사이의 간격
  color: var(--main-color); // 폰트 색상
  font-size: 14px; // 폰트 사이즈
  font-family: "PretendardSemiBold"; // 폰트 굵기
`;



const AddDayButtonCard = ({ onClick }) => {
  return (
    <AddDayContainer>
      <AddDayHeaderContainer>
        <AddDayCard>
          <AddDayIcon onClick={onClick}>
            <img src="/icon/add.svg" alt="Add day" />
          </AddDayIcon>
          <AddDayText>Day 추가하기</AddDayText>
        </AddDayCard>
      </AddDayHeaderContainer>
    </AddDayContainer>
  );
}

export default AddDayButtonCard;