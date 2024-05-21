import styled from 'styled-components';

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 188px;
  background-color: #fff;
`;

const TabButtonContainer = styled.div`
  display: flex;
  justify-content: center; // 가로축 중앙 정렬
  align-items: center; // 세로축 중앙 정렬
  width: 363px;
  height: 36px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const TabItem = styled.div`
  height: 24px; // 높이는 디자인에 맞게 조정
  display: flex;
  align-items: center;
  font-family: "PretendardSemiBold";
  cursor: pointer;
  font-size: 20px;
  margin-bottom: 0;
  padding-left: 24px;
  padding-right: 24px;

  &:not(:last-child) {
    // 마지막 TabItem을 제외한 모든 TabItem
    border-right: 2px solid var(--main2-color);
  }
  color: ${(props) => (props.$isActive ? "var(--main-color)" : "inherit")};
`;

const TabDescription = styled.p`
  font-family: "PretendardSemiBold";
  font-size: 12px;
  text-align: center;
  width: 100%;
  height: 38px;
  margin-top: 0;
  margin-bottom: 0;

`;

const TabMenu = ({ activeTab, setActiveTab }) => {
  const getTabDescription = () => {
    switch (activeTab) {
      case "일정관리":
        return "일정관리를 계획해 봅시다! 추가일정은 마우스로 Drag&Drop이 가능합니다.";
      case "예산/지출":
        return "지출 내역을 상세하게 기록해 보세요!";
      case "여행로그":
        return "여행의 과정을 사진과 함께 기록해 보세요!";
      default:
        return "선택된 탭이 없습니다.";
    }
  };

  return (
    <TabContainer>
      <TabButtonContainer>
        <TabItem
          $isActive={activeTab === "일정관리"}
          onClick={() => setActiveTab("일정관리")}
        >
          일정관리
        </TabItem>

        <TabItem
          $isActive={activeTab === "예산/지출"}
          onClick={() => setActiveTab("예산/지출")}
        >
          예산/지출
        </TabItem>
        <TabItem
          $isActive={activeTab === "여행로그"}
          onClick={() => setActiveTab("여행로그")}
        >
          여행로그
        </TabItem>
      </TabButtonContainer>
      <TabDescription>{getTabDescription()}</TabDescription>
    </TabContainer>
  );
};

export default TabMenu;