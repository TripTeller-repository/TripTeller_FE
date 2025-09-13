import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "/src/hooks/useUserState";
import styled from "styled-components";
import Button from "/src/components/commons/buttons/Button";
import checkIcon from "/icon/complete-message.svg";
import errorIcon from "/icon/error-message.svg";
import { useAPI } from "/src/api/API";
import SuspiciousChoiceModal from "./SuspiciousChoiceModal";
import Setup2FAModal from "./Setup2FAModal";
import TwoFactorDialog from "./TwoFactorDialog";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2FA 모달 상태
  const [suspiciousModal, setSuspiciousModal] = useState(null);
  const [setup2FAModal, setSetup2FAModal] = useState(null);
  const [twoFactorModal, setTwoFactorModal] = useState(null);
  const [tempToken, setTempToken] = useState("");

  const navigate = useNavigate();
  const { request } = useAPI();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) setEmailTouched(true);
  };

  const handleEmailValidation = (e) => {
    const value = e.target.value;
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
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
      setIsSubmitting(true);

      const response = await request("/auth/sign-in", "POST", {
        email,
        password,
      });

      const data = response.data;
      console.log("Login response:", data); // 디버깅용

      setTempToken(data.tempToken);

      // 케이스 1: 정상 로그인 완료 (2FA도 의심스러운 로그인도 없음)
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        fetchCurrentUser();
        navigate("/");
        return;
      }

      // 케이스 2: 의심스러운 로그인 감지
      if (data.isSuspiciousLogin) {
        setSuspiciousModal({
          message: data.message || "의심스러운 로그인이 감지되었습니다.",
          suspiciousFactors: data.suspiciousFactors || [],
          tempToken: data.tempToken,
          userHas2FA: data.userHas2FA,
        });
        return;
      }

      // 케이스 3: 정상 로그인이지만 tempToken만 반환된 경우 - 바로 proceed
      if (!data.isSuspiciousLogin && data.tempToken) {
        try {
          const proceedResponse = await request(
            "/auth/sign-in/proceed",
            "POST",
            {
              tempToken: data.tempToken,
            },
          );

          if (proceedResponse.data.accessToken) {
            localStorage.setItem(
              "accessToken",
              proceedResponse.data.accessToken,
            );
            fetchCurrentUser();
            navigate("/");
            return;
          }
        } catch (proceedError) {
          console.error("Proceed login failed:", proceedError);
          alert(`로그인 진행에 실패했습니다: ${proceedError.message}`);
          return;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(`로그인 요청에 실패했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 의심스러운 로그인 - 일반 로그인 선택
  const handleNormalLogin = async () => {
    try {
      const response = await request("/auth/sign-in/proceed", "POST", {
        tempToken: suspiciousModal.tempToken,
      });

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        fetchCurrentUser();
        setSuspiciousModal(null);
        navigate("/");
      }
    } catch (error) {
      alert(`로그인 진행에 실패했습니다: ${error.message}`);
      setSuspiciousModal(null);
    }
  };

  // 의심스러운 로그인 - 2FA 선택
  const handleChoose2FA = () => {
    if (suspiciousModal.userHas2FA) {
      // 이미 2FA 설정된 경우 - 바로 인증
      setTwoFactorModal({
        tempToken: suspiciousModal.tempToken,
        allowSkip: true, // 의심스러운 로그인에서는 건너뛰기 허용
      });
    } else {
      // 2FA 미설정 - 설정 진행
      setSetup2FAModal({
        tempToken: suspiciousModal.tempToken,
      });
    }
    setSuspiciousModal(null);
  };

  // 2FA 설정 완료 후
  const handle2FASetupDone = () => {
    setSetup2FAModal(null);
    // 설정 완료 후 바로 2FA 인증 진행
    setTwoFactorModal({
      tempToken: tempToken,
    });
  };

  // 2FA 인증 성공
  const handle2FASuccess = (data) => {
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      fetchCurrentUser();
      setTwoFactorModal(null);
      navigate("/");
    }
  };

  // 모달 닫기
  const closeAllModals = () => {
    setSuspiciousModal(null);
    setSetup2FAModal(null);
    setTwoFactorModal(null);
    setTempToken("");
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
        disabled={isSubmitting}
      />

      <LoginLabel>비밀번호</LoginLabel>
      <LoginInput
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={handlePasswordChange}
        id="password"
        disabled={isSubmitting}
      />
      <NewButton
        onClick={handleLogin}
        disabled={!email || !password || !isEmailValid || isSubmitting}
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </NewButton>
      <TextContainer>
        <P>
          계정이 없으신가요?
          <span onClick={() => navigate("/signup")}> 회원가입</span> 하기
        </P>
      </TextContainer>

      {/* 의심스러운 로그인 선택 모달 */}
      {suspiciousModal && (
        <SuspiciousChoiceModal
          message={suspiciousModal.message}
          suspiciousFactors={suspiciousModal.suspiciousFactors}
          userHas2FA={suspiciousModal.userHas2FA}
          onChooseNormal={handleNormalLogin}
          onChoose2FA={handleChoose2FA}
          onClose={closeAllModals}
        />
      )}

      {/* 2FA 설정 모달 */}
      {setup2FAModal && (
        <Setup2FAModal
          tempToken={setup2FAModal.tempToken}
          onSetupDone={handle2FASetupDone}
          onCancel={closeAllModals}
        />
      )}

      {/* 2FA 인증 모달 */}
      {twoFactorModal && (
        <TwoFactorDialog
          tempToken={twoFactorModal.tempToken}
          allowSkip={twoFactorModal.allowSkip}
          onSuccess={handle2FASuccess}
          onCancel={closeAllModals}
        />
      )}
    </LoginContainer>
  );
}

export default LoginForm;
