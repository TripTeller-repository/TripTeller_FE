import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "/src/hooks/useUserState";
import styled from "styled-components";
import Button from "/src/components/commons/buttons/Button";
import checkIcon from "/icon/complete-message.svg";
import errorIcon from "/icon/error-message.svg";
import { useAPI } from "/src/api/API";
import SuspiciousLoginAlert from "./SuspiciousLoginAlert";

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
  const [showSuspiciousAlert, setShowSuspiciousAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await request("/auth/sign-in", "POST", {
        email,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);

      // 유저 정보를 가져와서 전역 상태에 저장
      fetchCurrentUser();

      // 의심스러운 로그인 감지 처리
      if (response.data.suspicious) {
        setAlertMessage(
          response.data.message ||
            "의심스러운 로그인이 감지되었습니다. 본인이 아니라면 비밀번호를 변경해주세요.",
        );
        setShowSuspiciousAlert(true);
      } else {
        // 의심스러운 로그인이 아니면 바로 홈으로 이동
        navigate("/");
      }
    } catch (error) {
      alert(`로그인 요청에 실패했습니다: ${error.message}`);
    }
  };

  const closeAlert = () => {
    console.log("Alert closing"); // 디버깅용 로그
    setShowSuspiciousAlert(false);
    // 알림창을 닫은 후 홈으로 이동
    navigate("/");
  };

  return (
    <LoginContainer>
      {showSuspiciousAlert && (
        <SuspiciousLoginAlert message={alertMessage} onClose={closeAlert} />
      )}

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
