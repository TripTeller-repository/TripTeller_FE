import styled from "styled-components";
import ProfileCard from "/src/components/commons/card/ProfileCard";

const ProfileCss = styled.div`
  position: sticky;
  top: 110px;
  & > :first-child {
    border: 1px solid var(--main2-color);
  }
`;

const TripLogSidebar = ({ userInfo, children }) => {
  return (
    <ProfileCss>
      <ProfileCard userInfo={userInfo}>{children}</ProfileCard>
    </ProfileCss>
  );
};

export default TripLogSidebar;
