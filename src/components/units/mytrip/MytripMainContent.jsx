import React, { useState } from "react";
import styled from "styled-components";
import BannerMytrip from "/src/components/commons/banner/BannerMytrip";
import MytripTabMenu from "/src/components/commons/tab/MytripTabmenu";
// import ScrabContent from "/src/components/units/mytrip/scrab/ScrabContent";
import MyTripLogContent from "/src/components/units/mytrip/mytripLog/MyTripLogContent";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MyTripMainContent = () => {
  const [activeTab, setActiveTab] = useState("지난 여행");

  return (
    <>
      <BannerMytrip />
      <Container>
        <MytripTabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </Container>
      {activeTab === "지난 여행" && <MyTripLogContent />}
      {/* {activeTab === "스크랩" && <ScrabContent />} */}
    </>
  );
};

export default MyTripMainContent;
