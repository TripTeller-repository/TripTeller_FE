import styled from "styled-components";

const MainButton = styled.button`
  font-family: "PretendardSemiBold";
  font-size: 14px;
  color: var(--white-color);
  border: none;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main2-color);
  transition: background-color;
  outline: none;
  height: 40px;

  &:hover {
    background-color: var(--main-color);
    transition-duration: 0.2s;
  }

  &:active {
    background-color: var(--back-color);
    color: var(--main-color);
    transition-duration: 0s;
    border: 1px solid var(--main-color);
  }

  &:focus {
    outline: none;
  }
`;

function Button({ children, onClick, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <MainButton {...props} onClick={handleClick}>
      {children}
    </MainButton>
  );
}

export default Button;
