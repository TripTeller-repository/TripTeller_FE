import styled from "styled-components";

const MainInput = styled.input`
  font-family: "Pretendard";
  font-size: 16px;
  color: var(--text-color);
  height: 40px;
  box-sizing: border-box;
  border: 1px solid var(--main2-color);
  border-radius: 10px;
  padding-left: 20px;

  &::placeholder {
    font-family: "Pretendard";
    font-size: 14px;
    color: var(--placeholder-color);
  }
  &:focus {
    border: 1px solid var(--main-color);
    outline: none;
  }
`;

function Input(props) {
  return <MainInput {...props} />;
}

export default Input;
