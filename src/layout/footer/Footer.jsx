import styled from "styled-components";
import { Link } from "react-router-dom";
import GitIcon from "/icon/github.svg";
import YoutubeIcon from "/icon/youtube.svg";
import LogoImage from "/img/logo.png";
import TopButtonImage from "/icon/topbutton.png";

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  background-color: var(--back-color);
  border-top: 1px solid var(--main2-color);
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  height: 100%;
`;

const FooterInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 600px;
  height: 80%;
`;

const CopyRightText = styled.div`
  font-size: 16px;
  text-align: left;
  line-height: 1.5;
  margin-left: 40px;
  margin-top: 12px;
`;

const FooterIcons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 28px;
`;

const StyledIcon = styled.img`
  margin: 10px 0;
`;

const StyledLogo = styled.img`
  height: 30px;
  margin-top: 16px;
`;

const TopButton = styled.img`
  width: 50px;
  height: 50px;
  position: fixed;
  bottom: 200px;
  right: 80px;
  cursor: pointer;
`;

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <FooterContainer>
      <FooterSection>
        <FooterInfo>
          <StyledLogo src={LogoImage} alt="logo" />
          <CopyRightText>
            BE: 이가린, 문채영
            <br />
            FE: 이보미, 손민혁, 이유림, 임기택
          </CopyRightText>
        </FooterInfo>
        <FooterIcons>
          <Link to="https://github.com/TripTeller-repository">
            <StyledIcon src={GitIcon} alt="깃허브로 이동" />
          </Link>
          <Link to="https://youtu.be/IOLBQCbE9PY?feature=shared">
            <StyledIcon src={YoutubeIcon} alt="유튜브로 이동" />
          </Link>
        </FooterIcons>
      </FooterSection>
      <TopButton src={TopButtonImage} alt="맨 위로 이동" onClick={scrollToTop} />
    </FooterContainer>
  );
}

export default Footer;
