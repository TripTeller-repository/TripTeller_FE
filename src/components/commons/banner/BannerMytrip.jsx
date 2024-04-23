import React, { useState } from "react";
import styled from "styled-components";
import NewTripMakeModal from "/src/components/commons/modals/NewTripMakeModal";
import { useUserState } from "/src/hooks/useUserState";
import { useNavigate } from "react-router-dom";

const BannerText1 = styled.div`
  font-size: 40px;
  font-weight: 100;
  font-family: "PretendardMedium";
  color: var(--text-color);
  text-align: center;
  margin-top: 20px;
  margin-bottom: 5px;
  height: 50px;
  span {
    font-family: "PretendardExtraBold";
    // box-shadow: 0 -10px inset var(--main2-color);
  }
`;

const BannerText2 = styled.div`
  font-size: 40px;
  font-weight: 100;
  font-family: "PretendardMedium";
  color: var(--text-color);
  text-align: center;
  margin-bottom: 10px;
  height: 50px;

  display: flex;
  align-items: center;
  img {
    height: 44px;
    margin: 6px 4px 0 0;
  }
`;

const ButtonContainer = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
  width: 230px;
  height: 60px;
  font-size: 20px;
`;

const Button = styled.button`
  font-family: "PretendardSemiBold";
  color: var(--white-color);
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  background-color: var(--main-color);

  box-shadow: var(--box-shadow);
  margin-top: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 230px;
  height: 60px;
  font-size: 20px;

  &:hover {
    background-color: var(--main2-color);
    transition: background-color 0.2s;
  }
  &:active {
    background-color: var(--back-color);
    color: var(--main-color);
    border: 1px solid var(--main-color);
  }
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(to right, var(--back-color), var(--sub-color));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function BannerMytrip() {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const { user } = useUserState();
  const navigate = useNavigate();

  const handleNewTripClick = () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <BannerContainer>
        <BannerText1>
          <span>{user?.nickname ?? ""}</span>님,
        </BannerText1>

        <BannerText2>
          <img src="/img/logo.png" alt="logo" />와 함께 여행해 보세요!
        </BannerText2>

        <ButtonContainer>
          <Button onClick={handleNewTripClick}>새로운 여행 만들기</Button>
        </ButtonContainer>
      </BannerContainer>

      {showModal && <NewTripMakeModal closeModal={closeModal} />}
    </>
  );
}

export default BannerMytrip;
