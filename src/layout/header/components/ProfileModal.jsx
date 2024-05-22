import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "/src/hooks/useUserState";
import styled from "styled-components";
import NicknameModal from "/src/layout/header/components/NicknameModal";
import Swal from "sweetalert2";
import Button from "/src/components/commons/buttons/Button";
import ImgUploadModal from "/src/components/commons/modals/ImgUploadModal";
import { URL } from "/src/api/API";

const ModalContent = styled.div`
  background-color: var(--white-color);
  width: 270px;
  height: 380px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  z-index: 100;
  position: fixed;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 95, 95, 0.3);
  margin-bottom: 20px;
`;

const ProfileContent = styled.div`
  margin-top: 5px;
  text-align: center;
  margin: 14px;
  h1 {
    font-size: 18px;
    font-family: "PretendardSemibold";
  }
  p {
    font-size: 12px;
    color: var(--placeholder-color);
    text-decoration: underline;
    margin-top: 10px;
    margin-bottom: 8px;
  }
`;

const ProfileImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-top: 20px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
  }

  &:hover > button {
    display: flex;
    z-index: 1;
  }
`;

const AddButton = styled.button`
  width: 25px;
  height: 25px;
  background-image: url("/icon/add_photo.svg");
  background-size: cover;
  display: none;
  border: none;
  outline: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const NewButton = styled(Button)`
  width: 220px;
`;

const ProfileModal = ({ position, closeModal }) => {
  const { user, setUser } = useUserState();
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showImgUploadModal, setShowImgUploadModal] = useState(false);

  const navigate = useNavigate();

  const updateProfileImage = (newImageUrl) => {
    setUser({ ...user, profileImage: newImageUrl });
  };

  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "로그아웃이 완료되었습니다.",
    }).then(() => {
      localStorage.removeItem("accessToken");
      navigate("/");
      closeModal();
    });
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "정말 탈퇴 하시겠습니까?",
      html: "<div style='color: var(--text-color); font-size: 14px;'>회원정보&내역은 3일 후 삭제됩니다.</div>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--main2-color)",
      cancelButtonColor: "var(--main2-color)",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
      buttonsStyling: false,
      customClass: {
        confirmButton: "my-swal-button",
        cancelButton: "my-swal-button",
        icon: "my-swal-icon",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${URL}/auth/withdraw`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
          .then(() => {
            Swal.fire("탈퇴 완료!", "계정이 성공적으로 삭제되었습니다.", "success").then(() => {
              localStorage.removeItem("accessToken");
              navigate("/");
              closeModal();
            });
          })
          .catch((error) => {
            console.error("회원 탈퇴 처리 중 에러 발생:", error);
          });
      }
    });
  };

  const handleAddPhotoClick = () => {
    setShowImgUploadModal(true);
  };

  const handleModalClose = () => {
    setShowImgUploadModal(false);
  };

  return (
    <ModalContent top={position.top} left={position.left}>
      <ProfileContainer>
        <ProfileImageContainer src={user.profileImage}>
          <AddButton onClick={handleAddPhotoClick} label="Add photo" />
        </ProfileImageContainer>
        <ProfileContent>
          <h1>{user.nickname}</h1>
          <p>{user.email}</p>
        </ProfileContent>
      </ProfileContainer>
      {showImgUploadModal && (
        <ImgUploadModal
          onClose={handleModalClose}
          uploadType="profile"
          width="120px"
          height="120px"
          radius="50%"
          updateProfileImage={updateProfileImage}
        />
      )}
      <ButtonContainer>
        <NewButton onClick={() => setShowNicknameModal(true)}>닉네임 변경</NewButton>
        <NewButton onClick={handleLogout}>로그아웃</NewButton>
        <NewButton onClick={handleDeleteAccount}>회원탈퇴</NewButton>
      </ButtonContainer>
      {showNicknameModal && (
        <NicknameModal
          onClose={() => {
            setShowNicknameModal(false)
            closeModal()
          }}
          updateNickname={user.nickname}
        />
      )}
    </ModalContent>
  );
};

export default ProfileModal;