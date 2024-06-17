import React, { useState, useEffect, useRef } from "react";
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

const LoadingIndicator = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  .loader {
    width: 50px;
    --b: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, #f03355) content-box;
    -webkit-mask: repeating-conic-gradient(
        #0000 0deg,
        #000 1deg 20deg,
        #0000 21deg 36deg
      ),
      radial-gradient(
        farthest-side,
        #0000 calc(100% - var(--b) - 1px),
        #000 calc(100% - var(--b))
      );
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: l4 1s infinite steps(10);
  }

  @keyframes l4 {
    to {
      transform: rotate(1turn);
    }
  }
`;

function MyTripLogContent() {
  const [myTripData, setMyTripData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const loader = useRef(null);

  const fetchNewData = async () => {
    try {
      const response = await fetch(
        `${URL}/my-trip/order-by/recent?pageNumber=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("데이터를 불러오는 데 실패했습니다.");
      }

      const data = await response.json();
      console.log(data);

      if (!data.feeds || !Array.isArray(data.feeds.data)) {
        throw new Error("API 응답이 올바르지 않습니다.");
      }

      // 중복 데이터 필터링
      setMyTripData((prevData) => {
        const newFeedIds = new Set(data.feeds.data.map((feed) => feed.feedId));
        const filteredData = prevData.filter(
          (feed) => !newFeedIds.has(feed.feedId),
        );
        return [...filteredData, ...data.feeds.data];
      });

      setHasMore(data.feeds.data.length > 0);

      // 로딩 아이콘 2초 동안 출력
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("데이터를 불러오는 도중 오류가 발생했습니다:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setLoading(true);
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (loading) {
      fetchNewData();
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  }, [loading]);

  useEffect(() => {
    fetchNewData();
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
              href={`/my-trip?feedId=${feed.feedId}&travelPlanId=${feed.travelPlanId}`}
            />
          ))}
        </FeedCardContainer>
        <div ref={loader}>
          {loading && (
            <LoadingIndicator>
              <div className="loader"></div>
            </LoadingIndicator>
          )}
        </div>
      </MaxWidthContainer>
    </Container>
  );
}

export default MyTripLogContent;
