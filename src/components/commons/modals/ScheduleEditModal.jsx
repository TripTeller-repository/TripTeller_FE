import styled from "styled-components";
import { useState } from "react";
import KakaoMapModal from "/src/components/commons/modals/KakaoMapModal";
import dayjs from "dayjs"; // Day.js 라이브러리
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 580px;
  height: 480px;
  background-color: var(--white-color);
  border-radius: 28px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 28px 28px 48px 28px;

  h1 {
    width: 540px;
    height: 70px;
    font-family: "PretendardSemiBold";
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 48px;
  }
`;

// 오전,오후 컨테이너
const AmPmContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 175px;
  margin-right: 50px;
`;
// 오전,오후 버튼
const AmPmButton = styled.button`
  background-color: ${({ selected }) =>
    selected ? "var(--main-color)" : "var(--main2-color)"};
  color: ${({ selected }) =>
    selected ? "var(--white-color)" : "var(--white-color)"};
  border: none;
  border-radius: 4px;
  width: 85px;
  height: 40px;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${({ selected }) => (selected ? "pink" : "#ff5f5f")};
    transition-duration: 0.2s;
  }
`;

const InputContainer = styled.div`
  width: 482px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 30px;

  label {
    font-family: "pretendardSemiBold";
    font-size: 20px;
    margin-right: 30px;
  }
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const MemoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TimeSelecContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 175px;
`;

// 장소 검색 버튼
const SearchButton = styled.button`
  width: 125px;
  height: 60px;
  padding: 10px;
  margin-left: 10px; // 입력 필드와 버튼 사이의 간격
  background-color: var(--main2-color);
  border: 1px solid var(--main-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--white-color);

  &:hover {
    background-color: var(--main-color);
    transition-duration: 0.2s;
  }
`;

// 장소 검색 -> 입력값 받는 곳
const InputField = styled.input`
  width: 265px;
  height: 60px;
  padding: 10px;
  border: 1px solid var(--main-color);
  border-radius: 4px;
  margin-right: 0px;
`;

// 메모란
const TextArea = styled.input`
  width: 400px;
  height: 100px;
  padding: 10px;
  border: 1px solid var(--main-color);
  border-radius: 4px;
`;

// 변경하기 버튼
const SubmitButton = styled.button`
  width: 150px;
  height: 50px;
  background-color: var(--main2-color);
  border-radius: 8px;
  color: var(--white-color);
  margin-top: 10px;

  &:hover {
    background-color: var(--main-color);
    transition-duration: 0.2s;
  }
`;

const TimeSelector = styled.select`
  width: 85px;
  height: 40px;
  border: 1px solid var(--main-color);
  border-radius: 4px;
`;

const ScheduleEditModal = ({
  onClose,
  onUpdate,
  editData,
  scheduleInfo,
  planId,
}) => {
  const [isAM, setIsAM] = useState(true);
  const [location, setLocation] = useState(editData.location); // 장소 상태
  const [memo, setMemo] = useState(editData.memo); // 메모 상태
  const [showMapModal, setShowMapModal] = useState(false);
  // 시간과 분 상태도 필요에 따라 추가 가능
  const [hour, setHour] = useState("12"); // Default hour set to 12
  const [minute, setMinute] = useState("00"); // Default minute set to 00

  // 장소검색하기버튼
  const handleLocationSearch = () => {
    setShowMapModal(true); // 지도를 모달 열기
  };

  // 장소검색한 명칭 및 주소 저장
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation); // 지도에서 선택한 장소를 상태에 저장
    setShowMapModal(false); // 지도 모달 닫기
  };

  // 메모 입력 상태 저장
  const handleMemoChange = (event) => {
    if (event.target.value.length <= 15) {
      setMemo(event.target.value);
    }
  };

  // 변경하기 버튼을 누를 때 호출할 함수
  const handleSubmit = async () => {
    const currentDate = dayjs().tz("Asia/Seoul").format("YYYY-MM-DD");
    const isAMOffset = isAM ? 0 : 12;
    const normalizedHour = (parseInt(hour) % 12) + isAMOffset;

    const formattedTime = dayjs(`${currentDate} ${normalizedHour}:${minute}`)
      .tz("Asia/Seoul")
      .format("YYYY-MM-DD HH:mm"); // 사용자가 선택한 시간 포맷팅

    try {
      // 여기서 서버로 변경 사항을 보내는 API 호출을 수행
      const updatedSchedule = {
        location,
        time: formattedTime,
        memo,
      };
      await onUpdate(updatedSchedule, scheduleInfo._id, planId);
      onClose();
    } catch (error) {
      // 에러 처리
      console.error("Error updating schedule:", error);
    }
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <h1>세부 일정 수정</h1>
        <InputContainer>
          <LocationContainer>
            <label>장소</label>
            <InputField
              placeholder="장소를 검색해주세요"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <SearchButton onClick={handleLocationSearch}>
              장소 검색
            </SearchButton>{" "}
            {/* 새로운 검색 버튼 */}
          </LocationContainer>
          {showMapModal && (
            <KakaoMapModal
              onClose={() => setShowMapModal(false)}
              onSelectLocation={handleLocationSelect}
            />
          )}

          <TimeContainer>
            <label>시작</label>
            <AmPmContainer>
              <AmPmButton selected={isAM} onClick={() => setIsAM(true)}>
                오전
              </AmPmButton>
              <AmPmButton selected={!isAM} onClick={() => setIsAM(false)}>
                오후
              </AmPmButton>
            </AmPmContainer>
            <TimeSelecContainer>
              <TimeSelector
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1} 시`}</option>
                ))}
              </TimeSelector>
              <TimeSelector
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{`${i} 분`}</option>
                ))}
              </TimeSelector>
            </TimeSelecContainer>
          </TimeContainer>

          <MemoContainer>
            <label>메모</label>
            <TextArea
              placeholder="(선택) 메모를 15자 이내 입력해주세요."
              type="text"
              maxLength="14"
              value={memo}
              onChange={handleMemoChange}
            />
          </MemoContainer>
        </InputContainer>
        <SubmitButton onClick={handleSubmit}>변경하기</SubmitButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ScheduleEditModal;
