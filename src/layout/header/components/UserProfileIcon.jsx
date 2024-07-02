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

  const handleOnclick = () => {
    if (user?.profileImage) {
      openModal();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <StyledIcon
        /*user의 profileImage가 null 또는 undefined인 경우 MypageIcon이 뜨도록 함.*/
        src={token ? user?.profileImage ?? MypageIcon : MypageIcon}
        alt="UserProfile"
        onClick={handleOnclick}
      />
    </>
  );
};

export default UserProfileIcon;
