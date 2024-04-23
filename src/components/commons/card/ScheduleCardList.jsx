import { useState } from "react";
import styled from "styled-components";
import ScheduleCard from "/src/components/commons/card/ScheduleCard";

const NewScheduleCard = styled(ScheduleCard)`
  width: 100%;
  margin: 0;
  margin-bottom: 4px;
`;
const DayScheduleList = styled.ol`
  max-height: 528px;
  overflow-y: auto;
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  & > li:first-child > h3:first-child {
    margin-top: 0;
  }
`;
const DayTitle = styled.h3`
  font-family: PretendardExtraBold;
  margin: 20px 0 8px 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const DropdownButton = styled.button`
  height: 25px;
  width: 25px;
  background-image: url("/icon/dropdown_arrow.svg");
  background-size: cover;
  transition: transform 0.4s ease-in-out;
  transform: ${(props) => (props.$show ? "rotate(0)" : "rotate(-90deg)")};
`;
const Tooltip = styled.span`
  font-size: 12px;
  color: var(--main-color);
  visibility: hidden;

  ${DropdownButton}:hover + & {
    visibility: ${(props) => (props.$show ? "hidden" : "visible")};
  }
`;
const DropdownContentUl = styled.ul`
  transition: height 0.4s ease-in-out;
  overflow: hidden;
  height: ${(props) => (props.$show ? props.$height : "0")};
`;

const ScheduleCardList = ({ dailyPlanList }) => {
  // 모든 드롭다운의 열림 상태를 관리하기 위해 객체를 사용
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleDropdown = (index) => {
    setOpenIndexes((prevIndexes) => ({
      ...prevIndexes,
      [index]: !prevIndexes[index], // 현재 상태의 반대로 설정 (열려 있으면 닫고, 닫혀 있으면 열기)
    }));
  };

  return (
    <DayScheduleList>
      {dailyPlanList.map((dailyPlan, index) => {
        //일자별 일정카드의 갯수 및 총 길이 구하기
        const contentHeight = dailyPlan.dailySchedules.length * 112 + "px";

        return (
          <li key={dailyPlan._id}>
            <DayTitle>
              <a href={`#${index}`}>{index + 1}일차</a>
              <DropdownButton
                onClick={() => toggleDropdown(index)}
                $show={openIndexes[index]}
              />
              <Tooltip $show={openIndexes[index]}>클릭해서 펼쳐보세요!</Tooltip>
            </DayTitle>
            <DropdownContentUl
              $show={openIndexes[index]}
              $height={contentHeight}
            >
              {dailyPlan.dailySchedules.map((dailySchedule, scheduleIndex) => (
                <a key={dailySchedule._id} href={`#${index}-${scheduleIndex}`}>
                  <NewScheduleCard ScheduleInfo={dailySchedule} />
                </a>
              ))}
            </DropdownContentUl>
          </li>
        );
      })}
    </DayScheduleList>
  );
};

export default ScheduleCardList;
