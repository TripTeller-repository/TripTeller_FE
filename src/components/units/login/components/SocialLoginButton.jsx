import styled from "styled-components";

const ButtonContainer = styled.button`
  font-family: "PretendardSemiBold";
  font-size: 16px;
  width: 360px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 10px;
  border: ${({ $borderColor }) =>
    $borderColor ? `1px solid ${$borderColor}` : "none"};

  span {
    font-family: "PretendardSemiBold";
    font-size: 16px;
    color: ${({ $textColor }) => $textColor || "white"};
  }

  &:hover {
    background-color: ${({ $hoverColor }) => $hoverColor};
  }

  img {
    margin-right: 20px;
  }
`;
const SocialLoginButton = ({
  icon,
  text,
  bgColor,
  hoverColor,
  borderColor,
  textColor,
  onClick,
}) => {
  return (
    <ButtonContainer
      $bgColor={bgColor}
      $hoverColor={hoverColor}
      $borderColor={borderColor}
      $textColor={textColor}
      onClick={onClick}
    >
      <img src={icon} alt={text} />
      <span>{text}</span>
    </ButtonContainer>
  );
};

export default SocialLoginButton;
