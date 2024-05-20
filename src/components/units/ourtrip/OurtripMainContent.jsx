import React, { useState, useEffect } from "react";
import styled from "styled-components";
import OurtripBanner from "/src/components/commons/banner/OurtripBanner";
import OurTripFeedCard from "/src/components/commons/card/OurTripFeedCard";
import { useAPI } from "/src/api/API";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HorizontalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  height: 200px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 0px;
`;

const Title = styled.h1`
  font-family: "PretendardSemiBold";
  width: 200px;
  // height: 36px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 36px;
`;
const FeedCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 30px;
  margin-bottom: 20px;
  width: 1200px;
`;

const TabButtonContainer = styled.div`
  display: flex;
  height: 36px;
  justify-content: space-between;
  // width: 1200px;

  & > button:first-child {
    border-right: none;
    border-radius: 5px 0 0 5px;
  }
  & > button:last-child {
    border-radius: 0 5px 5px 0;
  }
`;

const ToggleButton = styled.button`
  width: 80px;
  background-color: var(--back-color);
  border: 1px solid var(--main2-color);
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  font-family: "PretendardSemiBold";
  margin-left: auto;
  width: 120px;

  &:hover {
    background-color: var(--main2-color);
    transition-duration: 0.2s;
    color: white;
  }
`;

const OurTripMainContent = () => {
  const { request } = useAPI();
  const [ourTripData, setOurTripData] = useState([]);
  const [sortBy, setSortBy] = useState("latest"); // 초기값 설정

  useEffect(() => {
    const fetchData = async () => {
      const response = await request(`/feeds`);
      const data = response.data.feeds.data;
      console.log(data);
      setOurTripData(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <OurtripBanner feedLength={ourTripData.length} />
      <Container>
        <HorizontalContainer>
          <Title>여행 족보</Title>
          <TabButtonContainer>
            <ToggleButton
              $isActive={sortBy === "latest"}
              onClick={() => setSortBy("latest")}
            >
              최신순
            </ToggleButton>
            <ToggleButton
              $isActive={sortBy === "popular"}
              onClick={() => setSortBy("popular")}
            >
              인기순
            </ToggleButton>
          </TabButtonContainer>
        </HorizontalContainer>
        <FeedCardContainer>
          {ourTripData.map((feed) => (
            <OurTripFeedCard
              key={feed.feedId}
              title={feed.title}
              startDate={feed.startDate}
              endDate={feed.endDate}
              imageUrl={feed.thumbnailUrl}
              likeCount={feed.likeCount}
              initialScrapState={feed.isScrapped}
              href={`/ourtrip/details?feedId=${feed.feedId}&travelPlanId=${feed.travelPlanId}`}
            />
          ))}
        </FeedCardContainer>
      </Container>
    </>
  );
};

export default OurTripMainContent;
