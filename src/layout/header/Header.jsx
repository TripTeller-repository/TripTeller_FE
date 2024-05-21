import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import logo from "/img/logo.gif";
import ProfileModal from "/src/layout/header/components/ProfileModal";
import UserProfileIcon from "/src/layout/header/components/UserProfileIcon";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  background-color: var(--back-color);
  border-bottom: 1px solid var(--main2-color);
  position: sticky;
  z-index: 1000;

  top: 0px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;

  :hover {
    background-color: var(--back-color);
  }
`;

const StyledLogo = styled.img`
  width: 200px;
  height: auto;
  margin-right: auto;
`;
const HeaderIcon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: var(--main-color);
  font-size: 20px;
  font-weight: 600;
  margin: 0 34px;
`;

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  //토큰이 있는지 확인하고 모달창을 띄우거나 로그인 페이지로 이동
  const openModal = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsModalOpen(true);
    } else {
      navigate("/login");
    }
  };
  const openModalOrRedirect = (path) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <HeaderContainer>
      <Container>
        <Link to="/">
          <StyledLogo src={logo} alt="logo" />
        </Link>
        <ButtonContainer>
          <LinkButton onClick={() => openModalOrRedirect("/mytrip")}>
            나의 여행
          </LinkButton>
          <Link to="/ourtrip">
            <LinkButton>우리의 여행</LinkButton>
          </Link>
          <HeaderIcon>
            <UserProfileIcon openModal={openModal} />
          </HeaderIcon>
        </ButtonContainer>
      </Container>
      {isModalOpen && <ProfileModal closeModal={closeModal} />}
    </HeaderContainer>
  );
}

export default Header;
