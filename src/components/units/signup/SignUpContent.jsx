import SinUpForm from "/src/components/units/signup/components/SignUpForm";
import styled from "styled-components";

const CenteredContainer = styled.div`
  width: 100%;
  height: 100%;
`


const SinUpContent = () => {
  return (
    <CenteredContainer>
      <SinUpForm />
    </CenteredContainer>
  );
};

export default SinUpContent;