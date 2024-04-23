import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FeedCard from "/src/components/commons/card/FeedCard";
import { URL } from "/src/api/API";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MaxWidthContainer = styled.div`
  width: 1200px;
`;

const FeedCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 30px;
  margin-bottom: 50px;
`;

function MyTripLogContent() {
  const [myTripData, setMyTripData] = useState([]);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/feed/order/byRecent`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("에러");
        }

        const data = await response.json();
        setMyTripData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <MaxWidthContainer>
        <FeedCardContainer>
          {myTripData.map((feed) => (
            <FeedCard
              key={feed.feedId}
              title={feed.title}
              startDate={feed.startDate}
              endDate={feed.endDate}
              imageUrl={feed.thumbnailUrl}
              href={`/maketrip?feedId=${feed.feedId}&travelPlanId=${feed.travelPlanId}`}
            />
          ))}
        </FeedCardContainer>
      </MaxWidthContainer>
    </Container>
  );
}

export default MyTripLogContent;
