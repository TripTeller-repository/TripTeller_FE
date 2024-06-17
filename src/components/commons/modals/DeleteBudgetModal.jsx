import styled from "styled-components";
import { URL } from "/src/api/API"
import Swal from "sweetalert2";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
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
  color: white;

  &:hover {
    background-color: var(--main-color);
  }
`;


const DeleteBudgetModal = ({ expense, onClose, dailyPlanId, onUpdate }) => {

  const onDelete = async (expense) => {
    
    const expenseId = expense._id;
    try {
      const url = `${URL}/daily-plan/${dailyPlanId}/expense/${expenseId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '삭제 실패');
      }
      onClose();
      // 성공 알림
      await Swal.fire({
        icon: 'success',
        title: '삭제 완료!',
        text: '지출 항목이 성공적으로 삭제되었습니다.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '확인'
      });

      onUpdate(expense._id);
    } catch (error) {
      console.error('삭제 오류:', error);

      // 에러 알림
      await Swal.fire({
        icon: 'error',
        title: '삭제 실패!',
        text: error.message,
        confirmButtonColor: '#d33',
        confirmButtonText: '닫기'
      });
    }
  };
  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <DeleteImg src={"/icon/error-message.svg"} />
        <h1>정말 삭제 하시겠습니까?</h1>
        <p>삭제된 기록은 불러올 수 없습니다.</p>
        <ButtonContainer>
          <Button onClick={onClose}>아니요</Button>
          <Button onClick={() => onDelete(expense)}>예</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteBudgetModal;
