import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { URL } from "/src/api/API";
import { useNavigate } from "react-router-dom";

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 30px;
  border: 2px solid var(--main2-color);
  position: relative;
  width: 480px;
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  font-family: "Pretendard";
  font-size: 16px;
  height: 40px;
  box-sizing: border-box;
  color: var(--text-color);
  border: 1px solid var(--main2-color);
  border-radius: 10px;
  padding-left: 20px;
  width: 300px;
`;

const DayStartInput = styled(DatePicker)`
  width: 135px;
  margin-right: 10px;
`;

const DayEndInput = styled(DatePicker)`
  width: 135px;
  margin-left: 10px;
`;

const Title = styled.h3`
  margin-bottom: 28px;
  margin-top: 20px;
  font-size: 34px;
`;

const ModalContentText = styled.h3`
  padding: 20px;
  font-weight: 100;
  margin-right: 10px;
  font-size: 20px;
  font-family: "PretendardSemibold";
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const SubmitButton = styled.button`
  font-family: "PretendardSemiBold";
  color: #fff;
  background-color: var(--main2-color);
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  margin-top: 28px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 140px;

  &:hover {
    background-color: var(--main-color);
    transition-duration: 0.2s;
  }
`;

const Dropdown = styled.select`
  height: 40px;
  border: 1px solid var(--main2-color);
  border-radius: 10px;
  padding-left: 20px;
  width: 300px;
  color: var(--placeholder-color);
`;

const Separator = styled.span``;

const NewTripMakeModal = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [region, setRegion] = useState("");
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  const handleSubmit = async () => {
    try {
      const feedResponse = await fetch(`${URL}/my-trip`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public: false,
          coverImage: "/img/coverImage_default.jpg",
        }),
      });

      if (!feedResponse.ok) {
        throw new Error("에러");
      }

      const feedData = await feedResponse.json();
      const feedId = feedData._id;

      const planResponse = await fetch(`${URL}/my-trip/${feedId}/travel-plan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          numberOfPeople,
          region,
        }),
      });

      if (!planResponse.ok) {
        throw new Error("에러");
      }

      const planData = await planResponse.json();
      const travelPlanId = planData._id;

      closeModal();
      navigate(
        `/maketrip?feedId=${feedId}&travelPlanId=${travelPlanId}&region=${region}`,
      );
    } catch (error) {
      console.error("에러", error);
    }
  };

  return (
    <ModalWrapper onMouseDown={closeModal}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <FlexContainer>
          <Title>신규 일정 생성</Title>
        </FlexContainer>
        <FlexContainer>
          <ModalContentText>제목</ModalContentText>
          <Input
            placeholder="20자 이내 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={20}
          />
        </FlexContainer>
        <FlexContainer>
          <ModalContentText>기간</ModalContentText>
          <DayStartInput
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="시작일"
            // minDate={new Date()} (과거 날짜도 입력 가능하게 함)
          />
          <Separator>~</Separator>
          <DayEndInput
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="종료일"
            minDate={startDate}
            maxDate={
              startDate
                ? new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000)
                : null
            }
          />
        </FlexContainer>
        <FlexContainer>
          <ModalContentText>인원</ModalContentText>
          <Input
            placeholder="인원을 입력해주세요."
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
          />
        </FlexContainer>
        <FlexContainer>
          <ModalContentText>지역</ModalContentText>
          <Dropdown value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="" disabled>
              지역을 선택해주세요.
            </option>
            <option value="Seoul">서울특별시</option>
            <option value="GyeonggiIncheon">경기 / 인천</option>
            <option value="ChungcheongDaejeon">충청 / 대전</option>
            <option value="GyeongsangDaeguUlsan">경상 / 대구 / 울산</option>
            <option value="JeollaGwangju">전라 / 광주</option>
            <option value="Gangwon">강원</option>
            <option value="Busan">부산</option>
            <option value="Jeju">제주</option>
          </Dropdown>
        </FlexContainer>
        <SubmitButton onClick={handleSubmit}>등록하기</SubmitButton>
      </ModalContent>
    </ModalWrapper>
  );
};

export default NewTripMakeModal;
