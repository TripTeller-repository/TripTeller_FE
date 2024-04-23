import SocialLoginButton from "/src/components/units/login/components/SocialLoginButton";
import styled from "styled-components";
import LoginForm from "/src/components/units/login/components/LoginForm";

const CenteredContainer = styled.div`
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
`;

const LoginContainer = styled.div`
  width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  p {
    font-size: 0.7rem;
  }
`;
const Title = styled.div`
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
  margin-bottom: 32px;

  img {
    width: 120px;
    height: 26px;
    margin-bottom: 22px;
  }
  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    font-family: PretendardExtraBold;
  }
`;
const LoginContent = () => {
  const onClick = () => {
    window.Kakao.Auth.authorize({
      redirectUri: "http://127.0.0.1:5173/login/redirect",
    });
  };

  return (
    <CenteredContainer>
      <LoginContainer>
        <Title>
          <img src="/img/logo.png" alt="logo" />
          <p>로그인하고</p>
          <p> 여행을 시작하세요!</p>
        </Title>
        <LoginForm />
        <ButtonContainer>
          <SocialLoginButton
            icon="/icon/kakao.png"
            text="Kakao로 시작하기"
            bgColor="#fee500"
            hoverColor="#c7b300"
            textColor="#503639"
            onClick={onClick}
          />

          <p>계정이 없을 시 자동으로 회원가입됩니다.</p>
        </ButtonContainer>
      </LoginContainer>
    </CenteredContainer>
  );
};

export default LoginContent;
