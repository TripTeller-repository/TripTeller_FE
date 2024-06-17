import MaketripBanner from "/src/components/commons/banner/MaketripBanner";
import TabMenu from "/src/components/commons/tab/MakeTripTabMenu";
import { useEffect, useState } from "react";
import BudgetContent from "/src/components/units/maketrip/budget/BudgetContent";
import ScheduleContent from "/src/components/units/maketrip/schedule/ScheduleContent";
import TripLogContent from "/src/components/units/maketrip/tripLog/TripLogContent";
import { useAPI } from "/src/api/API";

const MakeTripLayout = () => {
  const [activeTab, setActiveTab] = useState("일정관리");

  //배너에 title과 날짜를 가져와서 넣기
  const { request } = useAPI();
  const [travelPlanData, setTravelPlanData] = useState([]);
  const [feedData, setFeedData] = useState([]);

  // 현재 feedId, travelPlanId값 가져오기
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const feedId = urlParams.get("feedId");
  const travelPlanId = urlParams.get("travelPlanId");

  useEffect(() => {
    const fetchData = async () => {
      const response = await request(
        `/my-trip/${feedId}/travel-plan/${travelPlanId}`,
      );
      const travelPlan = response.data;
      setTravelPlanData(travelPlan);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await request(`/my-trip/${feedId}`);
      const feedData = response.data[0];
      setFeedData(feedData);
    };
    fetchData();
  }, []);

  return (
    <>
      <MaketripBanner
        travelPlanData={travelPlanData}
        coverImage={
          feedData.coverImage ? feedData.coverImage : feedData.thumbnailUrl
        }
      >
        {" "}
      </MaketripBanner>
      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "일정관리" && <ScheduleContent />}
      {activeTab === "예산/지출" && <BudgetContent />}
      {activeTab === "여행로그" && <TripLogContent />}
    </>
  );
};

export default MakeTripLayout;
