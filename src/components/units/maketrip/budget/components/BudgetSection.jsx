import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import BudgetModal from "/src/components/commons/modals/BudgetModal";
import DeleteBudgetModal from "/src/components/commons/modals/DeleteBudgetModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const SectionContainer = styled.div`
  width: 880px;
  margin-bottom: 60px;
  margin-left: 60px;
`;

const SectionHeader = styled.div`
  width: 100%;
  font-family: "PretendardSemiBold";
  font-size: 18px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
`;

const SectionDays = styled.div`
  font-family: "PretendardSemiBold";
  font-size: 18px;
`;

const ExpenseList = styled.ul`
  padding: 0;
  margin: 0;
`;

const ExpenseItemContainer = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--backgray-color);
  margin-bottom: 30px;
  padding: 10px;
  border-radius: 20px;
`;

const ExpenseInfo = styled.div`
  flex-grow: 1;
  display: flex;

  img {
    margin-left: 24px;
    margin-right: 20px;
  }
`;

const ExpenseText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: "PretendardSemiBold";
  font-size: 18px;
  margin-left: 20px;
  gap: 16px;
  padding: 0px;

  p {
    margin-left: 48px;
    font-size: 14px;
  }
`;

const ExpensePrice = styled.div`
  font-family: "Pretendard";
  font-size: 18px;
  margin-right: 40px;
`;

const ActionsContainer = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;

  img {
    width: 24px;
  }

  img:first-child {
    margin-bottom: 20px;
  }
`;

const AddExpenseContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 0;
  border-bottom: 1px solid var(--main-color);
`;

const AddExpenseButton = styled.button`
  display: flex;
  align-items: center;
  background-color: var(--white-color);
  cursor: pointer;
  padding: 0;
`;

//카테고리 값 받아서 이미지로 변경
const categoryImages = {
  Food: "/icon/food.svg",
  Vehicle: "/icon/transport.svg",
  Shopping: "/icon/shopping.svg",
  Accommodation: "/icon/hotel.svg",
  Tour: "/icon/tour.svg",
};

const BudgetSection = ({ dailyPlan, onUpdateExpenses }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const openModal = (expense = null) => {
    setCurrentExpense(expense);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentExpense(null);
  };

  const openDeleteModal = (expense) => {
    setCurrentExpense(expense);
    setDeleteModalOpen(true);
  };

  //생성 및 수정 상태 업데이트
  const handleExpenseChange = (expense) => {
    setExpenses((prevExpenses) => {
      const index = prevExpenses.findIndex((exp) => exp._id === expense._id);
      const newExpenses =
        index !== -1
          ? prevExpenses.map((exp) => (exp._id === expense._id ? expense : exp))
          : [...prevExpenses, expense];
      onUpdateExpenses(newExpenses);
      return newExpenses;
    });
  };
  //삭제 상태 업데이트
  const updateExpensesAfterDelete = (expenseId) => {
    setExpenses((prevExpenses) => {
      const newExpenses = prevExpenses.filter((exp) => exp._id !== expenseId);
      onUpdateExpenses(newExpenses);
      return newExpenses;
    });
  };

  const totalCurrent = useMemo(() => {
    return expenses.reduce((total, expense) => total + expense.expense, 0);
  }, [expenses]);

  useEffect(() => {
    setExpenses(dailyPlan.expenses);
  }, []);

  const date = useMemo(() => {
    switch (dailyPlan.dateType) {
      case "STRING":
        return dailyPlan.dateString;
      case "DATE":
        return dayjs(dailyPlan.date).tz("Asia/Seoul").format("MM월 DD일");
      default:
        return "날짜 없음";
    }
  }, [dailyPlan]);

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionDays>{date}</SectionDays>
        {totalCurrent.toLocaleString()}원
      </SectionHeader>
      <ExpenseList>
        {expenses.map((expense) => (
          <ExpenseItemContainer key={expense._id}>
            <ExpenseInfo>
              <img
                src={categoryImages[expense.expenseCategory]}
                alt="카테고리"
              />
              <ExpenseText>
                {expense.title}
                <p>{expense.expenseMemo}</p>
              </ExpenseText>
            </ExpenseInfo>
            <ExpensePrice>{expense.expense.toLocaleString()}원</ExpensePrice>
            <ActionsContainer>
              <img
                src="/icon/edit.svg"
                alt="수정"
                onClick={() => openModal(expense, dailyPlan._id)}
              />
              <img
                src="/icon/delete.svg"
                alt="삭제"
                onClick={() => openDeleteModal(expense, dailyPlan._id)}
              />
            </ActionsContainer>
          </ExpenseItemContainer>
        ))}
      </ExpenseList>
      <AddExpenseContainer>
        <AddExpenseButton onClick={() => openModal()}>
          <img src="/icon/add.svg" alt="추가" />
        </AddExpenseButton>
      </AddExpenseContainer>
      {modalOpen && (
        <BudgetModal
          expense={currentExpense}
          dailyPlanId={dailyPlan._id}
          onClose={closeModal}
          onUpdate={handleExpenseChange}
        />
      )}

      {deleteModalOpen && (
        <DeleteBudgetModal
          expense={currentExpense}
          dailyPlanId={dailyPlan._id}
          onClose={() => setDeleteModalOpen(false)}
          onUpdate={updateExpensesAfterDelete}
        />
      )}
    </SectionContainer>
  );
};

export default BudgetSection;
