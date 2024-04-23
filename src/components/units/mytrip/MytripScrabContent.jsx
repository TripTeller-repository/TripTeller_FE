import React, { useState } from "react";
import styled from "styled-components";
import BannerMytrip from "/src/components/commons/banner/BannerMytrip";
import MytripTabMenu from "/src/components/commons/tab/MytripTabmenu";
import ScrapContent from "/src/components/units/mytrip/scrab/ScrabContent";
import MyTripLogContent from "/src/components/units/mytrip/mytripLog/MyTripLogContent";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MyTripScrabContent = () => {
  const [activeTab, setActiveTab] = useState("스크랩");
  const [sortBy, setSortBy] = useState("latest");

  return (
    <>
      <BannerMytrip />
      <div>
        <Container>
          <MytripTabMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSortBy={setSortBy}
          />
        </Container>
      </div>
      {activeTab === "지난 여행" && <MyTripLogContent />}
      {activeTab === "스크랩" && <ScrapContent sortBy={sortBy} />}
    </>
  );
};

export default MyTripScrabContent;
