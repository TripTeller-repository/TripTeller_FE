import { useEffect, useState } from "react";
import styled from "styled-components";
import TripLogSidebar from "/src/components/commons/sidebar/TripLogSidebar";
import ScheduleCardList from "/src/components/commons/card/ScheduleCardList";
import LogDetailList from "/src/components/units/maketrip/tripLog/components/LogDetailList";
import PublicToggle from "/src/components/commons/toggle/PublicToggle";
import { useAPI, URL } from "/src/api/API";
import { useUserState } from "/src/hooks/useUserState";
import { useLocation } from "react-router-dom";

const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  box-sizing: border-box;

  position: relative;

  //a 태그로 이동 시 header 높이만큼 더 내려오게 해주기
  :target::before {
    content: "";
    display: block;
    height: 110px; // 헤더의 높이
    margin-top: -110px; // 헤더의 높이의 음수값
  }
`;
const H2 = styled.h2`
  font-size: 18px;
  font-family: PretendardExtraBold;
  color: var(--text-color);
  width: 100%;
  margin-bottom: 20px;
`;
const LogContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 36px;

  h3 {
    font-family: PretendardSemiBold;
    font-size: 40px;
  }
`;
const Toggle = styled.div`
  position: absolute;
  top: 6px;
  right: 0;
`;

// 데이터를 받아서 뿌리는 역할
function TripLogContent() {
  const token = localStorage.getItem("accessToken");
  const { user } = useUserState();
  const { request } = useAPI();

  // 상태관리
  const [dailyPlanList, setDailyPlanList] = useState([]);
  const [publicChecked, setPublicChecked] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  // 쿼리 파라미터 가져오기
  const location = useLocation(); // 현재 URL 정보를 가져옴
  const searchParams = new URLSearchParams(location.search); // URL의 쿼리 매개변수를 가져옴
  const feedId = searchParams.get("feedId"); // 'feedId' 쿼리 매개변수 값을 가져옴
  const travelPlanId = searchParams.get("travelPlanId"); // 'feedId' 쿼리 매개변수 값을 가져옴

  useEffect(() => {
    const fetchData = async () => {
      const response = await request(
        `/feed/${feedId}/travelPlan/${travelPlanId}`,
      );
      const dailyPlans = response.data.dailyPlans.filter(
        (d) => d.dateType === "DATE",
      );
      setDailyPlanList(dailyPlans);
    };
    fetchData();
  }, []);

  // 사용자가 입력한 text를 전송하기
  const handleSaveText = async (dailyScheduleId, newText) => {
    try {
      const response = await fetch(
        `${URL}/dailySchedule/${dailyScheduleId}/travelLog/postContent`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            postContent: newText,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }
    } catch (error) {
      console.error("데이터 전송이 실패하였습니다:", error.message);
    }
  };

  // 공개&비공개 토글 함수
  // 서버에서 isPublic 값을 가져와서 publicChecked 상태를 업데이트하는 함수

  useEffect(() => {
    const fetchFeedData = async () => {
      const response = await request(`/feed/${feedId}`);
      const isPublic = response.data[0].isPublic;
      const coverImage = response.data[0].coverImage;
      setPublicChecked(isPublic);
      setCoverImage(coverImage);
    };
    fetchFeedData();
  }, []);

  // 토글 버튼의 상태를 변경하는 함수
  const handlePublicToggle = async () => {
    try {
      // publicChecked 상태를 반전시킴
      setPublicChecked((prevState) => !prevState);

      // 서버에 변경된 isPublic 값을 PUT 요청으로 전송
      const response = await fetch(`${URL}/feed/${feedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublic: !publicChecked }),
      });

      if (!response.ok) {
        throw new Error("네트워크 응답이 올바르지 않습니다.");
      }


    } catch (error) {
      console.error("데이터를 업데이트하는데 실패했습니다:", error.message);

      // 실패했을 경우 다시 이전 상태로 되돌림
      setPublicChecked((prevState) => !prevState);
    }
  };

  return (
    <CenterBox>
      <Container>
        <TripLogSidebar userInfo={user}>
          <H2>📅 여행일정</H2>
          <ScheduleCardList dailyPlanList={dailyPlanList} />
        </TripLogSidebar>
        <LogContainer>
          <Toggle>
            <PublicToggle
              checked={publicChecked}
              onChange={handlePublicToggle}
            />
          </Toggle>
          <LogDetailList
            dailyPlanList={dailyPlanList}
            onSaveText={handleSaveText}
            feedId={feedId}
            coverImage={coverImage}
          />
        </LogContainer>
      </Container>
    </CenterBox>
  );
}

export default TripLogContent;
