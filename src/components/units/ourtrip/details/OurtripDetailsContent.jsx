import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import TripLogSidebar from "/src/components/commons/sidebar/TripLogSidebar";
import ScheduleCardList from "/src/components/commons/card/ScheduleCardList";
import LogDetailList from "/src/components/units/maketrip/tripLog/components/LogDetailList";
import MaketripBanner from "/src/components/commons/banner/MaketripBanner";
import { URL } from "/src/api/API";
import { useLocation } from "react-router-dom";

const Introduce = styled.p`
  font-family: PretendardSemiBold;
  height: 188px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-family: PretendardExtraBold;
    color: var(--main-color);
  }
`;
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
const ButtonList = styled.div`
  position: absolute;
  right: 0;
  top: 4px;
  height: 36px;
  // width: 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  button > img {
    width: 36px;
    height: 100%;
  }

  button {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

// 데이터를 받아서 뿌리는 역할
function OurtripDetailsContent() {
  const token = localStorage.getItem("accessToken");

  // 상태관리
  const [dailyPlanList, setDailyPlanList] = useState([]);
  const [feedData, setFeedData] = useState([]);
  const [writerData, setWriterData] = useState([]);

  // 쿼리 파라미터 가져오기
  const location = useLocation(); // 현재 URL 정보를 가져옴
  const { pathname, search } = location;
  const searchParams = new URLSearchParams(`${search}`); // URL의 쿼리 매개변수를 가져옴
  const feedId = searchParams.get("feedId"); // 'feedId' 쿼리 매개변수 값을 가져옴

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedData = await fetchTravelData(); // fetchTravelData() 실행 후 결과 받기
        await fetchUserData(feedData.userId); // fetchUserData()에 userId 전달
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 피드 데이터 불러오기
  const fetchTravelData = async () => {
    try {
      const response = await fetch(`${URL}/feeds/${feedId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }
      const data = await response.json();
      setFeedData(data[0]);
      const dailyPlans = data[0].travelPlan.dailyPlans.filter(
        (d) => d.dateType === "DATE",
      );
      setDailyPlanList(dailyPlans);
      return data[0];
    } catch (error) {
      console.error("데이터 전송이 실패하였습니다:", error.message);
    }
  };
  // 작성자 데이터 불러오기
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${URL}/feeds/user/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }
      const data = await response.json();
      setWriterData(data);
    } catch (error) {
      console.error("데이터 전송이 실패하였습니다:", error.message);
    }
  };

  // textbox 읽기전용으로 만드는 값
  const isReadOnly = true;

  // 링크 복사하기
  const handleCopyClipBoard = async () => {
    try {
      const currentUrl = `${window.location.protocol}//${window.location.host}${pathname}${search}`;
      await navigator.clipboard.writeText(currentUrl);
      alert(`클립보드에 링크가 복사되었어요.\n${currentUrl}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <MaketripBanner
        travelPlanData={feedData.travelPlan}
        coverImage={
          feedData.coverImage ? feedData.coverImage : feedData.thumbnailUrl
        }
      />
      <Introduce>
        <span>{writerData ? writerData.nickname : "User"}</span>님의
        여행기록입니다📖
      </Introduce>
      <CenterBox>
        <Container>
          <TripLogSidebar userInfo={writerData}>
            <H2>📅 여행일정</H2>
            <ScheduleCardList dailyPlanList={dailyPlanList} />
          </TripLogSidebar>
          <LogContainer>
            <ButtonList>
              <button onClick={() => handleCopyClipBoard()}>
                <img src="/icon/share.svg" alt="share" />
              </button>
            </ButtonList>
            <LogDetailList
              dailyPlanList={dailyPlanList}
              readOnly={isReadOnly}
            />
          </LogContainer>
        </Container>
      </CenterBox>
    </>
  );
}

export default OurtripDetailsContent;
