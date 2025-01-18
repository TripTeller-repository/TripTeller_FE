import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LogDetailImg from "/src/components/units/maketrip/tripLog/components/LogDetailImg.jsx";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(timezone);

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }
  h4 {
    display: flex;
    align-items: flex-end;
    color: var(--main-color);
    margin-bottom: 6px;
    font-size: 18px;
  }
  span {
    font-family: PretendardSemiBold;
    font-size: 12px;
    margin-bottom: 1px;
  }
`;
const TitleText = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Contents = styled.div`
  margin: 10px 0 0 11px;
  padding-left: 20px;
  border-left: 2px dashed var(--main-color);
  display: flex;
  align-items: center;
`;

const Card = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 208px;
  padding: 10px;
  background-color: white;
  border: 1px solid var(--main2-color);
  border-radius: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const TextContainer = styled.div`
  height: 100%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const TextContainerTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  text-align: center;

  & > * {
    font-family: PretendardSemiBold;
    border-radius: 10px;
    line-height: 22px;
    height: 22px;
    font-size: 12px;
    color: var(--main-color);
    padding: 0 8px;
    box-sizing: border-box;
  }
`;
const P = styled.p`
  width: auto;
  background-color: var(--back-color);
  font-size: 14px;
`;
const SaveButton = styled.button`
  display: ${(props) => (props.$show ? "inline-block" : "none")};

  &:hover {
    filter: brightness(90%);
  }
`;
const CompleteButton = styled.button`
  color: ${(props) => (props.$completed ? "#34E0A1" : "inherit")};
  cursor: ${(props) => (props.$completed ? "default" : "pointer")};
  display: flex;
  align-items: center;
  img {
    width: 14px;
    height: 14px;
  }
`;
const Textarea = styled.textarea`
  font-size: 14px;
  width: 100%;
  min-width: 150px;
  box-sizing: border-box;
  padding: 10px 0 0 10px;
  height: 100%;
  border-color: transparent;
  border-radius: 10px;
  resize: none;

  &::placeholder {
    color: var(--placeholder-color);
  }

  &:focus {
    border-color: transparent;
    background-color: var(--back-color);
  }
  &:focus-visible {
    outline: none;
  }
`;
const TextP = styled.p`
  font-size: 14px;
  width: 100%;
  min-width: 150px;
  box-sizing: border-box;
  padding: 10px 0 0 10px;
  height: 100%;
  border-color: transparent;
  border-radius: 10px;
  resize: none;
`;
// 초기값 설정, 카드별 상태관리
const LogDetailCard = ({
  id,
  onSaveText,
  ScheduleInfo: {
    time = "오전 2:00",
    location = "장소",
    memo = "메모",
    postContent = "",
    imageUrl = "",
  } = {},
  readOnly,
  onClick,
  handleCheckbox,
}) => {
  const [text, setText] = useState(postContent);
  const [isModified, setIsModified] = useState(false); // textarea 값이 변경되었는지 여부
  const [currentImageUrl, setCurrentImageUrl] = useState(""); // 이미지 URL 상태
  const [isSaved, setIsSaved] = useState(false); // 저장이 완료되었는지 여부
  const [isThumbnail, setIsThumbnail] = useState(false);

  const toggleThumbnail = () => {
    setIsThumbnail((prevState) => !prevState);
    handleCheckbox(); // 부모 컴포넌트에서 전달된 썸네일 상태 변경 함수 호출
  };

  // imageUrl prop이 변경될 때마다 currentImageUrl 상태를 업데이트합니다.
  useEffect(() => {
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  // UTC 시간을 한국 시간 포맷으로 변경
  const formattedTime = (time) => {
    return dayjs(time).tz("Asia/Seoul").locale("ko").format("A hh:mm");
  };

  // 텍스트를 입력 시 변경되는 함수
  const handleTextChange = (event) => {
    setText(event.target.value);
    setIsModified(event.target.value !== postContent); // textarea 값이 기존과 다른지 확인
    setIsSaved(false);
  };

  // 텍스트 저장하는 함수
  const saveText = () => {
    onSaveText(text); // 상위 컴포넌트에서 전달된 데이터 처리 함수 호출
    setIsSaved(true); // 저장이 완료되었음을 표시
  };

  return (
    <li id={id}>
      <Title>
        <img src="/icon/location.svg" />
        <TitleText>
          <h4>{memo}</h4>
          <span>{location}</span>
        </TitleText>
      </Title>
      <Contents>
        <Card>
          <TextContainer>
            <TextContainerTitle>
              <P>{formattedTime(time)}</P>
              {isSaved ? (
                <CompleteButton $completed={isSaved} disabled={isSaved}>
                  <img src="/icon/complete-message.svg" />
                  저장완료
                </CompleteButton>
              ) : (
                <SaveButton
                  $show={isModified}
                  disabled={!isModified || isSaved}
                  onClick={saveText}
                >
                  저장
                </SaveButton>
              )}
            </TextContainerTitle>
            {readOnly ? (
              <TextP>{text}</TextP>
            ) : (
              <Textarea
                maxLength="100"
                placeholder="내용을 입력해주세요. (100자 이하)"
                value={text ? text : ""}
                onChange={handleTextChange}
              />
            )}
          </TextContainer>
          <LogDetailImg
            imageUrl={currentImageUrl}
            readOnly={readOnly}
            onClick={onClick}
            isThumbnail={isThumbnail}
            handleCheckbox={toggleThumbnail}
          />
        </Card>
      </Contents>
    </li>
  );
};

export default LogDetailCard;
