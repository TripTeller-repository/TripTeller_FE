import styled from "styled-components";
import { useState } from "react";
import Swal from "sweetalert2";
import { URL } from "/src/api/API"

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
  width: 600px;
  height: 480px;
  background-color: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 28px 28px 48px 28px;

  h1 {
    width: 540px;
    height: 70px;
    font-family: "pretendardBold";
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 38px;
  }
`;

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 330px;
  height: 90px;
  margin-bottom: 8px;
`;
const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const CategoryIcon = styled.button`
  width: 50px;
  margin-bottom: 10px;
  border-radius: 20%;
  background-color: ${(props) =>
    props.selected ? "var(--back-color)" : "transparent"};
  border: ${(props) =>
    props.selected ? "solid 1px var(--main2-color)" : "transparent"};
`;

const InputContainer = styled.div`
  width: 400px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  margin-bottom: 38px;

  input {
    margin-left: 30px;
    width: 300px;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none; /* WebKit browsers like Safari and Chrome */
    margin: 0;
  }

  label {
    font-family: "pretendardSemiBold";
    font-size: 20px;
  }

  label:last-of-type input {
    width: 150px;
  }
`;

const Button = styled.button`
  width: 150px;
  height: 50px;
  background-color: var(--main2-color);
  border-radius: 10px;
  color: white;

  &:hover {
    background-color: var(--main-color);
  }
`;
const CategoryComment = styled.p`
  color: var(--placeholder-color);
  font-size: 12px;
  margin: 0 0 40px 0;
  padding-top: 8px;
  border-top: solid 1px var(--main2-color);
  width: 330px;
  text-align: center;
`;

const BudgetModal = ({ expense, dailyPlanId ,onClose, onUpdate }) => {
  const isEditMode = Boolean(expense);
  const [selectedCategory, setSelectedCategory] = useState(
    expense ? expense.expenseCategory : "",
  );
  const [title, setTitle] = useState(expense ? expense.title : "");
  const [memo, setMemo] = useState(expense ? expense.expenseMemo : "");
  const [price, setPrice] = useState(expense ? expense.expense : "");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  const handleContentChange = (e) => {
    setTitle(e.target.value);
  };

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  //수정하기
  const handleEdit = async () => {
    try {
      const payload = {
        expenseCategory: selectedCategory,
        title: title,
        expenseMemo: memo,
        expense: price,
      };
  
      const expenseId = expense._id; 
      const response = await fetch(`${URL}/daily-plan/${dailyPlanId}/expense/${expenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '수정에 실패했습니다.');
      }
      const updatedExpense = await response.json();
      Swal.fire({
        icon: 'success',
        title: '성공!',
        text: '항목이 성공적으로 수정되었습니다.'
      });
      onUpdate(updatedExpense);
      onClose();
    } catch (error) {
      console.error('수정 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '오류 발생!',
        text: error.message,
      });
    }
  };

  //생성하기
  const handleCreate = async () => {
    //입력값 검증
    if (title.length > 15) {
      alert('지출 제목은 15자 이내로 입력해주세요.');
      return;
    }
    if (memo.length > 15) {
      alert('메모는 15자 이내로 입력해주세요.');
      return;
    }
    if (memo.length > 9999999) {
      alert('금액은 9999999 이하로 입력해주세요.');
      return;
    }
    const newExpense = {
      expenseCategory: selectedCategory,
      title: title,
      expenseMemo: memo,
      expense: price,
    };
  
    try {
      const response = await fetch(`${URL}/daily-plan/${dailyPlanId}/expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
        },
        body: JSON.stringify(newExpense)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '생성 실패');
      }
      
      const createdExpense = await response.json();
      Swal.fire({
        icon: 'success',
        title: '성공!',
        text: '새 지출 항목이 성공적으로 추가되었습니다.'
      });
      onUpdate(createdExpense);

    } catch (error) {
      console.error('생성 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '오류 발생!',
        text: error.message,
      });
    }
  
    onClose();
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <h1>{isEditMode ? "지출내역 수정" : "지출내역 생성"}</h1>

        <CategoryContainer>
          <CategoryItem onClick={() => handleCategoryClick("Food")}>
            <CategoryIcon selected={selectedCategory === "Food"}>
              <img src="/icon/food.svg" alt="식비" />
            </CategoryIcon>
            <p>식비</p>
          </CategoryItem>
          <CategoryItem onClick={() => handleCategoryClick("Accommodation")}>
            <CategoryIcon selected={selectedCategory === "Accommodation"}>
              <img src="/icon/hotel.svg" alt="숙박" />
            </CategoryIcon>
            <p>숙박</p>
          </CategoryItem>
          <CategoryItem onClick={() => handleCategoryClick("Vehicle")}>
            <CategoryIcon selected={selectedCategory === "Vehicle"}>
              <img src="/icon/transport.svg" alt="교통" />
            </CategoryIcon>
            <p>교통</p>
          </CategoryItem>
          <CategoryItem onClick={() => handleCategoryClick("Shopping")}>
            <CategoryIcon selected={selectedCategory === "Shopping"}>
              <img src="/icon/shopping.svg" alt="쇼핑" />
            </CategoryIcon>
            <p>쇼핑</p>
          </CategoryItem>
          <CategoryItem onClick={() => handleCategoryClick("Tour")}>
            <CategoryIcon selected={selectedCategory === "Tour"}>
              <img src="/icon/tour.svg" alt="관광" />
            </CategoryIcon>
            <p>관광</p>
          </CategoryItem>
        </CategoryContainer>
        <CategoryComment> {selectedCategory === "" && "카테고리를 선택하세요."} </CategoryComment>

        <InputContainer>
          <label>
            제목
            <input
              type="text"
              placeholder="지출 제목을 15자 이내로 입력해주세요."
              value={title}
              onChange={handleContentChange}
            />
          </label>
          <label>
            메모
            <input
              type="text"
              placeholder="(선택) 메모를 15자 이내로 입력해주세요."
              value={memo}
              onChange={handleMemoChange}
            />
          </label>
          <label>
            금액
            <input
              type="number"
              placeholder="사용금액"
              value={price}
              onChange={handlePriceChange}
            />
          </label>
        </InputContainer>
        <Button onClick={isEditMode ? handleEdit : handleCreate}>
          {isEditMode ? "수정하기" : "생성하기"}
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BudgetModal;
