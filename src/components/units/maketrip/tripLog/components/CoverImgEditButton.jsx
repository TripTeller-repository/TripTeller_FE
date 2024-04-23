import styled from "styled-components";
import Button from "/src/components/commons/buttons/Button";

const NewButton = styled(Button)`
  width: 112px;
  margin: 0 32px 32px 0;

  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: var(--darker-shadow);

  transition: border 0.2s;

  &:hover {
    border: 1px solid var(--main-color);
    transition-duration: 0.2s;
  }
`;

const CoverImgButton = () => {
  return <NewButton>커버 변경</NewButton>;
};

export default CoverImgButton;
