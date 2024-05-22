import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "/src/components/commons/buttons/Button";
import checkIcon from "/icon/complete-message.svg";
import errorIcon from "/icon/error-message.svg";
import { URL } from "/src/api/API";

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 40px;
  margin-bottom: 130px;
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;
const TitleImage = styled.img`
  width: 300px;
  margin-bottom: 20px;
  margin-top: 20px;
`;
const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
`;

const SignUpInput = styled.input`
  width: 360px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--main2-color);
  margin-bottom: 20px;
`;

const NewButton = styled(Button)`
  width: 360px;
  margin-top: 20px;
`;
const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 360px;
  margin-top: 20px;
  margin-bottom: 80px;
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
const SignUpLabel = styled.label`
  display: flex;
  align-items: center;
  font-family: Pretendard;
  font-size: 12px;
  width: 360px;
  text-align: left;
  margin-bottom: 4px;
  color: ${(props) =>
    props.$Touched
      ? props.$isValid === true
        ? "#34E0A1" // 이메일이 유효할 때
        : "var(--main-color)" // 이메일이 유효하지 않을 때
      : "var(--main2-color)"};
`;

const Icon = styled.img`
  width: 14px;
`;

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEmailValid, setEmailValid] = useState(null);
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(null);
  const [isNicknameValid, setIsNicknameValid] = useState(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailTouched) setEmailTouched(true);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordTouched) setPasswordTouched(true);
  };

  const handlePasswordConfirmChange = (e) => {
    const value = e.target.value;
    setPasswordConfirm(e.target.value);
    setIsPasswordConfirmValid(value === password);
    if (!passwordConfirmTouched) setPasswordConfirmTouched(true);
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
    if (!nicknameTouched) setNicknameTouched(true);
  }
  // 이메일 유효성 검사
  const handleEmailValidation = (e) => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  //비밀번호 유효성 검사
  const validatePassword = (e) => {
    setIsPasswordValid(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W).{8,}$/.test(e.target.value),
    );
  }; 
  const validateNickname = (e) => {
    const value = e.target.value;
    setIsNicknameValid(/^[a-zA-Z0-9가-힣]{1,6}$/.test(value));
    if (!nicknameTouched) setNicknameTouched(true);
  };
  
  // 회원가입 함수
  const handleSignUp = async () => {
    const allValid = isEmailValid && isPasswordValid && isPasswordConfirmValid && password === passwordConfirm && isNicknameValid;
    if (allValid) {
      try {
        const response = await fetch(`${URL}/auth/sign-up`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            nickname: nickname,
            password: password, 
          })
        });
  
        if (response.ok) {
          alert('회원가입이 완료되었습니다.');
          navigate('/login');
        } else {
          const error = await response.json();
          alert(`회원가입 실패: ${error.message}`);
        }
      } catch (error) {
        console.error('회원가입 요청 중 에러 발생:', error);
        alert('회원가입 요청 중 문제가 발생했습니다.');
      }
    } else {
      let errorMessage = "모든 필드의 유효성을 확인해주세요:\n";
    if (!isEmailValid) errorMessage += "- 잘못된 이메일 양식입니다.\n";
    if (!isPasswordValid) errorMessage += "- 영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요.\n";
    if (!isPasswordConfirmValid) errorMessage += "- 비밀번호가 일치하지 않습니다.\n";
    if (!isNicknameValid) errorMessage += "- 잘못된 닉네임 양식입니다.\n";
    alert(errorMessage);
  }
};

  return (
    <SignUpContainer>
      <TitleContainer>
        <TitleImage src="/img/logo.gif" />
        <Title>회원가입</Title>
      </TitleContainer>
      <SignUpLabel htmlFor="email" $Touched={emailTouched} $isValid={isEmailValid}>
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
      </SignUpLabel>
      <SignUpInput
        type="text"
        placeholder="이메일"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailValidation}
        id="email"
      />
      <SignUpLabel htmlFor="nickname" $Touched={nicknameTouched} $isValid={isNicknameValid}>
        {nicknameTouched && !isNicknameValid ? (
          <>
            <Icon src={errorIcon} alt="Invalid email" />
            잘못된 닉네임 양식입니다.
          </>
        ) : (
          <>
            닉네임
            {nicknameTouched && isNicknameValid && (
              <Icon src={checkIcon} alt="Valid nickname" />
            )}
          </>
        )}
      </SignUpLabel>
      <SignUpInput
        type="text"
        placeholder="한글, 영문, 숫자로만 6글자 이내로 적어주세요."
        value={nickname}
        onChange={handleNicknameChange}
        onBlur={validateNickname}
        id="email"
      />
      <SignUpLabel
        htmlFor="pssword"
        $Touched={passwordTouched}
        $isValid={isPasswordValid}
      >
        {passwordTouched && !isPasswordValid ? (
          <>
            <Icon src={errorIcon} alt="Invalid pssword" />
            영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요.
          </>
        ) : (
          <>
            비밀번호
            {passwordTouched && isPasswordValid && (
              <Icon src={checkIcon} alt="Valid pssword" />
            )}
          </>
        )}
      </SignUpLabel>
      <SignUpInput
        type="password"
        placeholder="영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요."
        value={password}
        onChange={handlePasswordChange}
        onBlur={validatePassword}
      />
      <SignUpLabel
        htmlFor="passwordConfirm"
        $Touched={passwordConfirmTouched}
        $isValid={isPasswordConfirmValid}
      >
        {passwordConfirmTouched && !isPasswordConfirmValid ? (
          <>
            <Icon src={errorIcon} alt="Invalid passwordConfirm" />
            비밀번호가 일치하지 않습니다.
          </>
        ) : (
          <>
            비밀번호 확인
            {passwordConfirmTouched && isPasswordConfirmValid && (
              <Icon src={checkIcon} alt="Valid passwordConfirm" />
            )}
          </>
        )}
      </SignUpLabel>
      <SignUpInput
        type="password"
        placeholder="비밀번호 확인"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
      />
      <NewButton onClick={handleSignUp}>
        회원가입
      </NewButton>
      <TextContainer>
        <P>
          이미 계정이 있으신가요?
          <span onClick={() => navigate("/login")}>로그인</span> 하기
        </P>
      </TextContainer>
    </SignUpContainer>
  );
}

export default SignUpForm;
