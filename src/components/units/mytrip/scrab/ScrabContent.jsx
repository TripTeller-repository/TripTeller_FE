import styled from "styled-components";
import OurTripFeedCard from "/src/components/commons/card/OurTripFeedCard";
import { URL, useAPI } from "/src/api/API";
import React, { useEffect, useState, useCallback } from "react";

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

function ScrapContent({ sortBy }) {
  const { request } = useAPI();
  const [scrabData, setScrabData] = useState([]);
  const token = localStorage.getItem("accessToken");

  // 아래 코드를 통해 api호출을 최소화하려했으나, 렌더링이 안되는 문제 발생함
  useEffect(() => {
    const fetchData = async () => {
      const response = await request(`/scrap`);
      const scrabDatas = await response.data;
      setScrabData(scrabDatas);
    };
    fetchData();
  }, []); // 최초 렌더링 시에만 fetch 호출

  // sortBy 값에 따라 배열을 정렬하여 데이터 업데이트 (useCallback으로 최적화)
  const sortedData = [...scrabData].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likeCount - a.likeCount;
    }
    // 다른 정렬 방식이 있다면 여기에 추가
    return 0;
  });

  const onScrap = useCallback(async (feedId) => {
    try {
      const response = await fetch(`${URL}/scrap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          feedId: feedId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }
    } catch (error) {
      console.error("데이터 전송이 실패하였습니다:", error.message);
    }
  }, []);

  const offScrap = useCallback(async (feedId) => {
    try {
      const response = await fetch(`${URL}/scrap/${feedId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "네트워크 응답이 올바르지 않습니다.",
        );
      }
    } catch (error) {
      console.error("데이터 전송이 실패하였습니다:", error.message);
    }
  }, []);

  return (
    <Container>
      <MaxWidthContainer>
        <FeedCardContainer>
          {sortedData.map((scrap) => (
            <OurTripFeedCard
              key={scrap.feedId}
              title={scrap.title}
              startDate={scrap.startDate}
              endDate={scrap.endDate}
              imageUrl={scrap.thumbnailUrl}
              likeCount={scrap.likeCount}
              onScrap={() => onScrap(scrap.feedId)}
              offScrap={() => offScrap(scrap.feedId)}
              href={`/ourtrip/details?feedId=${scrap.feedId}&travelPlanId=${scrap.travelPlanId}`}
            />
          ))}
        </FeedCardContainer>
      </MaxWidthContainer>
    </Container>
  );
}

export default ScrapContent;
