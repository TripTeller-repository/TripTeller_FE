import styled from "styled-components";
import { useState } from "react";
import { URL } from "/src/api/API";

const GaugeContainer = styled.div`
  width: 180px;
  height: 700px;
  border-radius: 30px;
  background: var(--white-color);
  border: 2px solid var(--main-color);
  display: flex;
  box-shadow: var(--box-shadow);
  position: sticky;
  margin-right: 20px;
  top: 300px;
`;

const BudgetTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 90px;
  height: 670px;
  margin: 14px 10px;
`;
const TotalFilledGauge = styled.div`
  display: flex;
  width: 40px;
  height: 670px;
  border-radius: 25px;
  background: var(--backgray-color);
  margin: 20px;
  flex-direction: column-reverse;
`;

const FilledGauge = styled.div`
  background: var(--main-color);
  width: 100%;
  transition: height 0.5s ease-out;
  border-radius: 25px;
  height: ${({ height }) => height}%;
`;

const BudgetAmount = styled.div`
  top: 10px;
  left: 10px;
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.5;

  font-family: "PretendardSemiBold";
`;
const EditTotalInput = styled.input`
  width: 100px;
  height: 20px;
  border-radius: 10px;

  -webkit-appearance: none;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
`;
const TotalButton = styled.button`
  width: 20px;
  margin-left: 28px;

  img {
    width: 20px;
  }
`;

const Spending = styled.div`
  bottom: 10px;
  left: 10px;
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.5;
`;

const BudgetGauge = ({ totalBudget, currentSpending, travelPlanId, feedId, onUpdate}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTotalBudget, setEditableTotalBudget] = useState(
    totalBudget || 0,
  );

  const handleEditClick = () => {
    setEditableTotalBudget(totalBudget || 0);
    setIsEditing(true);
  };

  const handleBudgetChange = (e) => {
    setEditableTotalBudget(e.target.value);
  };

  const handleBudgetBlur = () => {
    setIsEditing(false);
    const updatedBudget = Number(editableTotalBudget) || 0;
    if (updatedBudget >= 10000000) {
      alert('예산은 천만 원 미만으로 설정해주세요.');
      setEditableTotalBudget(totalBudget || 0);
      return;
    }
    if (updatedBudget !== totalBudget) {
      onUpdateTotalBudget(updatedBudget);
    }
  };


  const onUpdateTotalBudget = (updatedBudget) => {
    fetch(`${URL}/feed/${feedId}/travelPlan/${travelPlanId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ totalExpense: updatedBudget }),
    });
    onUpdate(updatedBudget);
  };

  const safeTotalBudget = totalBudget || 0;
  const safeCurrentSpending = currentSpending || 0;
  const spendingHeight = safeTotalBudget > 0 ? (safeCurrentSpending / safeTotalBudget) * 100 : 0;

  return (
    <GaugeContainer>
      <TotalFilledGauge>
        <FilledGauge height={spendingHeight} />
      </TotalFilledGauge>
      <BudgetTextContainer>
        <BudgetAmount>
          예산
          {isEditing ? (
            <EditTotalInput
              type="number"
              value={editableTotalBudget}
              onChange={handleBudgetChange}
              onBlur={handleBudgetBlur}
              autoFocus
            />
          ) : (
            <TotalButton onClick={handleEditClick}>
              <img src="/icon/edit.svg" alt="예산수정" />
            </TotalButton>
          )}
          <br />
          {!isEditing && `${safeTotalBudget.toLocaleString()}원`}
        </BudgetAmount>
        <Spending>
          총 지출
          <br />
          {`${safeCurrentSpending.toLocaleString()}원`}
        </Spending>
      </BudgetTextContainer>
    </GaugeContainer>
  );
};

export default BudgetGauge;
