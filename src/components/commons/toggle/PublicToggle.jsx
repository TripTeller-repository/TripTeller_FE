import styled from "styled-components";

const SwitchContainer = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 84px;
  height: 34px;
  & > * {
    color: white;
    font-family: PretendardSemiBold;
  }
  &,
  & > *,
  & > *::before,
  & > *::after {
    box-sizing: border-box;
  }
`;

const SliderInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: relative;
  display: inline-block;
  width: inherit;
  height: inherit;
  background-color: var(--placeholder-color);
  border-radius: 20px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
  &:after {
    position: absolute;
    left: -52px;
    height: inherit;
    width: 200px;
    content: "공개\u2003\u2003\u2003\u00A0비공개";
    display: flex;
    align-items: center;
    text-align: center;
    padding: 0 8px;
    transition: 0.4s;
  }

  ${SliderInput}:checked + & {
    background-color: var(--main-color);
  }
  ${SliderInput}:checked + &:after {
    transform: translateX(60px);
  }

  ${SliderInput}:checked + &:before {
    transform: translateX(50px);
  }
`;

//Toggle 스위치 정의
const PublicToggle = ({ checked, onChange, className }) => {
  return (
    <SwitchContainer className={className}>
      <SliderInput type="checkbox" checked={checked} onChange={onChange} />
      <Slider />
    </SwitchContainer>
  );
};

export default PublicToggle;
