import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import OurtripBanner from "/src/components/commons/banner/OurtripBanner";
import OurTripFeedCard from "/src/components/commons/card/OurTripFeedCard";
import { URL } from "/src/api/API";

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
  background-color: ${({ $active }) =>
    $active ? "var(--main2-color)" : "var(--back-color)"};
  border: 1px solid var(--main2-color);
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  font-family: "PretendardSemiBold";
  margin-left: auto;
  width: 120px;
  transition-duration: 0.2s;

  &:hover {
    color: var(--main-color);
  }

  &:active {
    background-color: var(--main-color);
    color: var(--white-color);
  }
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
    background: conic-gradient(#0000 10%,#f03355) content-box;
    -webkit-mask:
      repeating-conic-gradient(#0000 0deg,#000 1deg 20deg,#0000 21deg 36deg),
      radial-gradient(farthest-side,#0000 calc(100% - var(--b) - 1px),#000 calc(100% - var(--b)));
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

const OurTripMainContent = () => {
  const [ourTripData, setOurTripData] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [activeButton, setActiveButton] = useState("latest");
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const loader = useRef(null);

  const fetchNewData = async () => {
    try {
      const response = await fetch(`${URL}/feeds/order/` + (sortBy === "popular" ? `byLikeCount?pageNumber=${pageNumber}` : `byRecent?pageNumber=${pageNumber}`), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("API 요청에 실패했습니다.");
      }

      const data = await response.json();
      console.log(data); // 응답 데이터 로그

      if (!data.feeds || !Array.isArray(data.feeds.data)) {
        throw new Error("API 응답이 올바르지 않습니다.");
      }

      setOurTripData(prevData => {
        const newFeedIds = new Set(data.feeds.data.map(feed => feed.feedId));
        const filteredData = prevData.filter(feed => !newFeedIds.has(feed.feedId));
        return [...filteredData, ...data.feeds.data];
      });

      setHasMore(data.feeds.data.length > 0);

      // 로딩 상태를 2초 동안 유지
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(entries => {
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
      setPageNumber(prevPageNumber => prevPageNumber + 1);
    }
  }, [loading]);

  useEffect(() => {
    setPageNumber(1);
    setOurTripData([]);
    setLoading(true);
  }, [sortBy]);

  return (
    <>
      <OurtripBanner feedLength={ourTripData.length} />
      <Container>
        <HorizontalContainer>
          <Title>여행 족보</Title>
          <TabButtonContainer>
            <ToggleButton
              $active={activeButton === "latest"}
              onClick={() => {
                setSortBy("latest");
                setActiveButton("latest");
              }}
            >
              최신순
            </ToggleButton>
            <ToggleButton
              $active={activeButton === "popular"}
              onClick={() => {
                setSortBy("popular");
                setActiveButton("popular");
              }}
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
              region={feed.region}
              href={`/ourtrip/details?feedId=${feed.feedId}&travelPlanId=${feed.travelPlanId}`}
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
      </Container>
    </>
  );
};

export default OurTripMainContent;
