import MypageIcon from "/icon/mypage.svg";
import styled from "styled-components";
import { useUserState } from "/src/hooks/useUserState";

const StyledIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
`;

const UserProfileIcon = ({ openModal }) => {
  const token = localStorage.getItem("accessToken");
  const { user } = useUserState();

  return (
    <>
      <StyledIcon
        src={token ? user?.profileImage : MypageIcon}
        alt="UserProfile"
        onClick={openModal}
      />
    </>
  );
};

export default UserProfileIcon;
