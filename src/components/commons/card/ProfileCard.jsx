import styled from "styled-components";

// #사용방법#

// 껍데기에 추가로 넣을 css는 사용할 부모 컴포넌트에서 아래처럼 넣으면 됨.
// const ProfileCss = styled.div`
//   & > :first-child {
//     ✨여기에 css 넣어주시면 됩니다.
//   }
// `;

// 그다음 return문에서 아래와 같이 사용.
// <ProfileCss>
//     <Profile></Profile>
// </ProfileCss>

// 공통 스타일
const ModalContent = styled.div`
  width: 270px;
  box-sizing: border-box;
  background-color: white;
  padding: 20px 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;

  & > :last-child {
    width: 100%;
  }
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid rgba(255, 95, 95, 0.3);
  margin: 20px 0;
`;

const ProfileContent = styled.div`
  text-align: center;
  margin: 16px 0 20px 0;
  h2 {
    font-family: PretendardExtraBold;
    font-size: 18px;
  }
  p {
    font-size: 12px;
    color: var(--placeholder-color);
    text-decoration: underline;
    margin-top: 4px;
  }
`;
const PorfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

// 프로필 모달 컴포넌트
const ProfileCard = ({ children, userInfo = {} }) => {
  const { nickname, email, profileImage } = userInfo;

  return (
    <>
      <ModalContent>
        <ProfileContainer>
          <PorfileImage
            src={profileImage}
          />
          <ProfileContent>
            <h2>{nickname}</h2>
            <p>{email}</p>
          </ProfileContent>
        </ProfileContainer>
        {children}
      </ModalContent>
    </>
  );
};

export default ProfileCard;
