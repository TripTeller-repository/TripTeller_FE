import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import DayDateCard from '/src/components/units/maketrip/schedule/components/DayDate';
import AddScheduleButtonCard from '/src/components/units/maketrip/schedule/components/AddScheduleButton';
import ScheduleDetailCard from '/src/components/commons/card/ScheduleDetailCard';
import ArrowBackBtn from '/src/components/units/maketrip/schedule/components/ArrowBackBtn';
import ArrowForwardBtn from '/src/components/units/maketrip/schedule/components/ArrowForwardBtn';
import { useAPI, URL } from "/src/api/API";

const FlexContainer = styled.div`  
  display: flex;
  align-items: center;
  justify-content: center; // space-between은 양 끝의 컴포넌트 사이에 여백을 추가합니다.
  width: 100%;
`

const ArrowLeftBtnBox = styled.div`
  flex: 1;  // 화살표 버튼에 1의 비율을 부여합니다.
`

const ArrowRightBtnBox = styled.div`
  flex: 1;  // 화살표 버튼에 1의 비율을 부여합니다.  
`

const CenterContainer = styled.div`  
  display: flex; // flex를 사용하여 내부 아이템들을 수평으로 정렬
  align-items: flex-start;
  overflow-x: auto; // 수평 스크롤을 가능하게 함
  width: 1200px; // 컨테이너의 전체 너비를 부모에 맞춥니다.
  margin: auto; // 자동 마진을 사용하여 페이지 중앙에 정렬  
  min-height: 800px;
  position: relative; // 자식의 절대 위치 지정을 위해 relative 설정  
`

const ContentContainer = styled.div`
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 46px;
  left: 0; // 왼쪽 가장자리에서 시작
  top: 0; // 상단 가장자리에 정렬
` 

const ScheduleContent = () => { 
  const [dailyPlans, setDailyPlans] = useState([]); // 일정받아오는
  const [travelPlanId, setTravelPlanId] = useState(''); // TravelPlanId useState로 관리  
  const { request } = useAPI()
  const centerContainerRef = useRef(); // 좌우이동스크롤 ref 생성

  // 스크롤 함수
  const scrollContainerBy = (distance) => {
    if (centerContainerRef.current) {
      centerContainerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  // 현재 feedId, travelPlanId값 가져오기
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const feedId = urlParams.get("feedId");
  const travelPlan_Id = urlParams.get("travelPlanId");
  
  useEffect(() => {
    const onMounted = async () => {
      const response = await request(`/feed/${feedId}/travelPlan/${travelPlan_Id}`)
      const fetchedTravelPlanId = response.data._id
      setTravelPlanId(fetchedTravelPlanId);

      const dailyPlans = response.data.dailyPlans.filter((d) => d.dateType === 'DATE')
      setDailyPlans(dailyPlans)
    }

    onMounted()
  }, [])

  const handleCreateSchedule = (newSchedule, planId) => {
    setDailyPlans((prevDailyPlans) => {
      // prevDailyPlans에서 새 일정이 추가될 일자를 기반으로 해당 일자를 찾습니다.
      const updatedPlans = [...prevDailyPlans];
      const dayIndex = updatedPlans.findIndex(d => d._id === (newSchedule.dayId || planId)); 
  
      if (dayIndex >= 0) {
        // 해당 일자가 존재하면 새 일정을 해당 일자의 dailySchedules 배열에 추가합니다.
        updatedPlans[dayIndex].dailySchedules = [...updatedPlans[dayIndex].dailySchedules, newSchedule];
      }
  
      return updatedPlans;
    });
  };

  // 세부일정 카드 삭제(휴지통)버튼
  const handleDeleteSchedule = async (scheduleId, planId) => {
    if (!planId) {
      console.error('Plan ID is undefined.');
      return;
    }

    // 서버에 삭제 요청을 보내는 로직
    const jwt = localStorage.getItem('accessToken'); // 혹은 인증을 위한 토큰을 다른 방식으로 관리할 수 있습니다.
        
    try {
      // 서버에 DELETE 요청을 보냅니다.
      const response = await fetch(`${URL}/dailyPlan/${planId}/dailySchedule/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }
  
      // 상태 업데이트 로직
      setDailyPlans((prevDailyPlans) => {
        return prevDailyPlans.map(plan => {
          // Array.isArray(plan.dailySchedules)를 추가함으로써 dailySchedules가
          //  배열이 아닐 경우 filter 함수를 호출하지 않아 오류를 방지할 수 있습니다.
          if (plan._id === planId && Array.isArray(plan.dailySchedules)) {
            return {
              ...plan,
              dailySchedules: plan.dailySchedules.filter(schedule => schedule._id !== scheduleId),
            };
          }
        return plan;
      });
    });

    // 성공적으로 삭제되었다는 메시지 처리
  } catch (error) {
    console.error('Error deleting schedule:', error);
  }
};

// 수정모달 변경하기 버튼 눌렀을 때 상태업데이트까지
const handleUpdateSchedule = async (updatedData, scheduleId, planId) => {
  const jwt = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${URL}/dailyPlan/${planId}/dailySchedule/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update schedule');
    }

    const updatedSchedule = await response.json();

    // 상태 업데이트 로직
    setDailyPlans(prevDailyPlans => {
      return prevDailyPlans.map(plan => {
        if (plan._id === planId) {
          return {
            ...plan,
            dailySchedules: plan.dailySchedules.map(schedule => {
              if (schedule._id === scheduleId) {
                return { ...schedule, ...updatedSchedule };
              }
              return schedule;
            }),
          };
        }
        return plan;
      });
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
  }
};
  
  return (
    <FlexContainer>
      <ArrowLeftBtnBox onClick={() => scrollContainerBy(-296)}>
          <ArrowBackBtn />
        </ArrowLeftBtnBox>
      <CenterContainer ref={centerContainerRef}>

        {/* 기존 DayDateCard와 AddScheduleButtonCard 컴포넌트를 map을 이용해 리스트로 출력 */}
        {dailyPlans.map((plan, index) => (
        <ContentContainer key={plan._id}>
          <DayDateCard
            day={index + 1} // 일자는 배열의 인덱스에 1을 더한 값으로 표시합니다.
            date={plan.date} // 서버로부터 받은 날짜 데이터
          />
          <AddScheduleButtonCard planId={plan._id} onScheduleCreate={handleCreateSchedule} />
          {/* ScheduleDetailCard는 필요에 따라 추가 */}
          {plan.dailySchedules.map(schedule => (
          <ScheduleDetailCard 
          key={schedule._id} 
          scheduleInfo={schedule} 
          onDelete={handleDeleteSchedule}
          onUpdate={handleUpdateSchedule}
          planId={plan._id}
         />
        )) }  
        </ContentContainer>
       ))}

      </CenterContainer>
      <ArrowRightBtnBox onClick={() => scrollContainerBy(296)}>
          <ArrowForwardBtn />
        </ArrowRightBtnBox>
    </FlexContainer>
  );
}

export default ScheduleContent;