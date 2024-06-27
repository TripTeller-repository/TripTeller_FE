import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainBanner from "/src/components/commons/banner/MainBanner";
import OurTripFeedCard from "/src/components/commons/card/OurTripFeedCard";
import { URL } from "/src/api/API";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 70px;
  font-size: 40px;
  font-family: "PretendardSemiBold";
  margin-bottom: 30px;
  color: var(--main-color);
`;

const FeedCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px; // 사진 간의 간격 조절
  margin-bottom: 50px;
  width: 1200px;
`;

function MainContent() {
  const [mainBestData, setMainBestData] = useState([]);
  const [mainNewData, setMainNewData] = useState([]);

  useEffect(() => {
    const fetchBestData = async () => {
      try {
        const response = await fetch(
          `${URL}/our-trip/order-by/like-count?pageNumber=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("에러");
        }

        const responseData = await response.json();
        console.log("Response for mainBestData:", responseData);

        const data = responseData.feeds.data.slice(0, 3);
        console.log("Data for mainBestData:", data);

        setMainBestData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBestData();
  }, []);

  useEffect(() => {
    const fetchNewData = async () => {
      try {
        const response = await fetch(
          `${URL}/our-trip/order-by/recent?pageNumber=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("에러");
        }

        const responseData = await response.json();
        console.log("Response for mainNewData:", responseData);

        const data = responseData.feeds.data.slice(0, 3);
        console.log("Data for mainNewData:", data);

        setMainNewData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNewData();
  }, []);

  return (
    <Container>
      <MainBanner />

      <Title>New Trip</Title>

      <FeedCardContainer>
        {mainNewData.map((feed) => (
          <OurTripFeedCard
            key={feed.feedId}
            title={feed.title}
            startDate={feed.startDate}
            endDate={feed.endDate}
            imageUrl={feed.thumbnailUrl}
            href={`/ourtrip/details?feedId=${feed.feedId}&travelPlanId=${feed.travelPlanId}`}
          />
        ))}
      </FeedCardContainer>
    </Container>
  );
}

export default MainContent;
