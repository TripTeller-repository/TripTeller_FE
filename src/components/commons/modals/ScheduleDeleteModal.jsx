import styled from "styled-components";

  // 모달이뜨면 배경화면 어두워지는
  const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex; /* 여기에 flexbox를 적용합니다 */
    justify-content: center; /* 수평 정렬 */
    align-items: center; /* 수직 정렬 */
    z-index: 1000; /* z-index 값을 충분히 높게 설정합니다 */
`;

const ModalContent = styled.div`
  width: 560px;
  height: 350px;
  background-color: white;
  border-radius: 30px;
  border: 1px solid var(--main-color);

  display: flex;
  align-items: center;
  flex-direction: column;

  h1 {
    font-family: "PretendardSemibold";
    font-size: 32px;
    margin-bottom: 4px;
  }
  p {
    font-family: "Pretendard";
    font-size: 12px;
    color: var(--placeholder-color);
    margin-bottom: 40px;
  }
`;
const DeleteImg = styled.img`
  margin-top: 28px;
  margin-bottom: 20px;
`;
const ButtonContainer = styled.div`
  width: 340px;
  height: 50px;

  display: flex;
  justify-content: space-between;
  }
`;

const Button = styled.button`
  width: 160px;
  height: 48px;
  background-color: var(--main2-color);
  border-radius: 10px;
  color: var(--white-color);

  &:hover {
    background-color: var(--main-color);
  }
`;

const ScheduleDeleteModal = ({ onClose, onDelete, scheduleId }) => {
  // 삭제 로직을 실행하는 함수
  const handleDelete = () => {
    onDelete(scheduleId);
    onClose();
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <DeleteImg src={"/icon/error-message.svg"} />
        <h1>정말 삭제 하시겠습니까?</h1>
        <p>삭제된 기록은 불러올 수 없습니다.</p>
        <ButtonContainer>
          <Button onClick={onClose}>아니요</Button>
          <Button onClick={handleDelete}>예</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ScheduleDeleteModal;
