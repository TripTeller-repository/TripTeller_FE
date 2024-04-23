import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "/src/hooks/useUserState";
import styled from "styled-components";
import Button from "/src/components/commons/buttons/Button";
import checkIcon from "/icon/complete-message.svg";
import errorIcon from "/icon/error-message.svg";
import { useAPI } from '/src/api/API';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const LoginLabel = styled.label`
  display: flex;
  align-items: center;
  font-family: Pretendard;
  font-size: 12px;
  width: 360px;
  text-align: left;
  margin-bottom: 4px;
  color: ${(props) =>
    props.$emailTouched
      ? props.$isValid === true
        ? "#34E0A1" // 이메일이 유효할 때
        : "var(--main-color)" // 이메일이 유효하지 않을 때
      : "var(--main2-color)"};
`;

const LoginInput = styled.input`
  width: 360px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--main2-color);
  margin-bottom: 16px;
`;
const NewButton = styled(Button)`
  width: 360px;
  margin-top: 20px;
`;
const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 360px;
  border-bottom: 1px solid var(--main2-color);
  margin-bottom: 40px;
`;
const P = styled.p`
  font-family: Pretendard;
  font-size: 12px;
  color: var(--text-color);
  margin-top: 12px;
  margin-bottom: 40px;
  span {
    color: var(--main-color);
    cursor: pointer;
  }
`;
const Icon = styled.img`
  width: 14px;
`;

function LoginForm() {
  const { fetchCurrentUser } = useUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setEmailValid] = useState(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const navigate = useNavigate();
  const { request } = useAPI();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) setEmailTouched(true);
  };

  const handleEmailValidation = (e) => {
    const value = e.target.value;
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)); // 이메일 유효성 검사
  };
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validate = () => {
    if (!email || !password || !isEmailValid) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return false;
    }
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return

    try {
      const response = await request('/auth/sign-in', 'POST', { email, password })
      localStorage.setItem("accessToken", response.data.accessToken);

      // 유저 정보를 가져와서 전역 상태에 저장
      fetchCurrentUser()

      // 홈 화면으로 이동
      navigate("/");
    } catch (error) {
      alert(`로그인 요청에 실패했습니다: ${error.message}`);
    }
  };

  return (
    <LoginContainer>
      <LoginLabel
        htmlFor="email"
        $emailTouched={emailTouched}
        $isValid={isEmailValid}
      >
        {emailTouched && !isEmailValid ? (
          <>
            <Icon src={errorIcon} alt="Invalid email" />
            잘못된 이메일 양식입니다.
          </>
        ) : (
          <>
            이메일
            {emailTouched && isEmailValid && (
              <Icon src={checkIcon} alt="Valid email" />
            )}
          </>
        )}
      </LoginLabel>
      <LoginInput
        type="text"
        placeholder="이메일"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailValidation}
        id="email"
      />

      <LoginLabel>비밀번호</LoginLabel>
      <LoginInput
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={handlePasswordChange}
        id="password"
      />
      <NewButton
        onClick={handleLogin}
        disabled={!email || !password || !isEmailValid}
      >
        로그인
      </NewButton>
      <TextContainer>
        <P>
          계정이 없으신가요?
          <span onClick={() => navigate("/signup")}> 회원가입</span> 하기
        </P>
      </TextContainer>
    </LoginContainer>
  );
}

export default LoginForm;
