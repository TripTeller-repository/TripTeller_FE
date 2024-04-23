import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIcon from "/icon/calendar.svg";

const DateSearchContainer = styled.div`
  position: relative;
`;

const DateSearchReadonlyInput = styled.input`
  width: 160px;
  padding: 10px;
  padding-left: 35px;
  border: 1px solid var(--placeholder-color);
  border-radius: 10px;
  background-image: url(${CalendarIcon});
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px;
  cursor: pointer;
  background-color: var(--back-color);
  text-align: center;
`;

const CalendarPopup = styled.div`
  position: absolute;
  margin-top: 10px;
  left: 0;
  background-color: var(--white-color);
  border: 1px solid var(--placeholder-color);
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 999; // 모달창보다 하위에 있어야해서 999로 함
`;

function DateSearch() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // 달력 닫기
  };

  return (
    <DateSearchContainer>
      <DateSearchReadonlyInput
        placeholder="기간별 조회"
        onClick={toggleCalendar}
        value={selectedDate ? selectedDate.toLocaleDateString() : ""} // 선택된 날짜가 있으면 해당 날짜를 표시
        readOnly // 읽기 전용이라 사용자가 직접 날짜 입력 x
      />
      {showCalendar && (
        <CalendarPopup>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
          />
        </CalendarPopup>
      )}
    </DateSearchContainer>
  );
}

export default DateSearch;
