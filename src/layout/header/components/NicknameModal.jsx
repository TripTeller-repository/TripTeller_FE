import { useState } from "react";
import { useUserState } from "/src/hooks/useUserState";
import { URL } from "/src/api/API"
import styled from "styled-components";
import Swal from "sweetalert2";


const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalBox = styled.div`
  position: fixed;
  width: 560px;
  flex-direction: column;
  gap: 40px;

  background-color: var(--white-color);
  padding: 48px 0;
  border-radius: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const ModalText = styled.div`
  height: auto;
  display: flex;
  align-items: center;
  jusuwify-content: center;
  flex-direction: column;
  h1 {
    font-size: 32px;
    margin-bottom: 24px;
  }
  h2 {
    font-size: 32px;
    margin-bottom: 32px;
  }
`; 

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  width: 300px;
  height: 40px;
  color: white;
  border-radius: 10px;
  background-color: var(--main2-color);

  &:hover {
    background-color: var(--main-color);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;


const NicknameModal = ({ onClose }) => {
  const { user, setUser } = useUserState();
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    if (newNickname.length === 0) {
      setErrorMessage("닉네임을 입력해주세요.");
    } else if (!newNickname.match(/^[가-힣a-zA-Z0-9]*$/) || newNickname.length > 6) {
      setErrorMessage("한글, 영문, 숫자로만 6글자 이내로 적어주세요.");
    } else {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorMessage) return;
    try {
      const response = await fetch(`${ URL }/user/nickname`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ nickname })
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '닉네임 변경 실패');
      }
      setUser({ ...user, nickname: nickname });
      Swal.fire({
        icon: 'success',
        title: '성공!',
        text: '닉네임이 성공적으로 변경되었습니다.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류 발생!',
        text: error.message,
      });
    }
    
    onClose();
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalText>
          <h1>✏️</h1>
          <h2>닉네임을 알려주세요.</h2>
        </ModalText>
        <Form onSubmit={handleSubmit}>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Input
            name="nickname"
            type="text"
            placeholder="닉네임을 적어주세요.(6자 이내)"
            value={nickname}
            onChange={handleNicknameChange}
            autoFocus
          />
          <Button type="submit" disabled={!!errorMessage}>
            변경하기
          </Button>
        </Form>
      </ModalBox>
    </ModalBackdrop>
  );
};

export default NicknameModal;