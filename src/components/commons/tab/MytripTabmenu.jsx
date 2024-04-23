import styled from "styled-components";
// import { useNavigate } from "react-router-dom";

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  background-color: var(--white-color);
  margin-top: 100px;
`;

const HorizontalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const TabButtonContainer = styled.div`
  display: flex;
  height: 36px;
  & > :first-child {
    border-right: none;
    border-radius: 5px 0 0 5px;
  }
  & > :last-child {
    border-radius: 0 5px 5px 0;
  }
`;

const TabItem = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  font-size: 24px;

  color: ${(props) =>
    props.$isActive ? "var(--main-color)" : "var(--subtext-color)"};

  &:not(:last-child) {
    margin-right: 50px;
  }

  font-family: "PretendardSemiBold";
  cursor: pointer;
`;

const ToggleButton = styled.button`
  width: 80px;
  background-color: var(--back-color);
  border: 1px solid var(--main2-color);

  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  font-family: "PretendardSemiBold";

  &:hover {
    background-color: var(--main2-color);
    transition-duration: 0.2s;
    color: white;
  }
`;

const TabDescription = styled.div`
  font-family: "PretendardSemiBold";
  font-size: 12px;
  text-align: center;
  width: 100%;
  height: 30px; // 토글 높이 조절
  margin-top: 0;
  margin-bottom: 0;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MytripTabMenu = ({ activeTab, setActiveTab, sortBy, setSortBy }) => {
  // const navigate = useNavigate();

  // const handleScrapTabClick = () => {
  //   setActiveTab("스크랩");
  //   navigate("/mytrip/scrab");
  // };

  const getTabDescription = () => {
    switch (activeTab) {
      case "지난 여행":
        return "";
      case "스크랩":
        return (
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
        );
      default:
        return "선택된 탭이 없습니다.";
    }
  };

  return (
    <TabContainer>
      <HorizontalContainer>
        <TabButtonContainer>
          <TabItem
            $isActive={activeTab === "지난 여행"}
            onClick={() => setActiveTab("지난 여행")}
          >
            지난 여행
          </TabItem>
          {/* <TabItem
            $isActive={activeTab === "스크랩"}
            onClick={handleScrapTabClick}
          >
            스크랩
          </TabItem> */}
        </TabButtonContainer>
        <ToggleContainer>
          <TabDescription>{getTabDescription()}</TabDescription>
        </ToggleContainer>
      </HorizontalContainer>
    </TabContainer>
  );
};

export default MytripTabMenu;
