import BudgetGauge from "/src/components/units/maketrip/budget/components/BudgetGauge";
import BudgetSection from "/src/components/units/maketrip/budget/components/BudgetSection";
import styled from "styled-components";
import { useState, useEffect} from 'react';
import { useAPI } from "/src/api/API";
import { useLocation } from "react-router-dom";

const SectionContainer = styled.section`
  display: flex;
  justify-content: center;
`;

const DateSection = styled.div``;


const BudgetContent = () => {
  const [dailyPlans, setDailyPlans] = useState([]);
  const [travelPlanId, setTravelPlanId] = useState("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(0);
  const location = useLocation();
  const { request } = useAPI()

  //url에서 feedId, travelPlanId 가져오기
  const searchParams = new URLSearchParams(location.search);
  const feed_Id = searchParams.get('feedId');
  const travelPlan_Id = searchParams.get('travelPlanId');
  
  useEffect(() => {
    const onMounted = async () => {
      const response = await request(`/feed/${feed_Id}/travelPlan/${travelPlan_Id}`)
      const fetchedTravelPlanId = response.data._id
      setTravelPlanId(fetchedTravelPlanId);

      const dailyPlans = response.data.dailyPlans
      setDailyPlans(dailyPlans)
      
      //예산 저장된걸 불러오는 api
      const budgetResponse = await request(`/feed/${feed_Id}/travelPlan/${fetchedTravelPlanId}`);
      setTotalBudget(budgetResponse.data.totalExpense ?? 0);
    }

    onMounted()
  }, [])

  // 예산 상태 업데이트
  const onBudgetUpdate = (newBudget) => {
    setTotalBudget(newBudget);
  };

  const handleExpensesChange = (planId, updatedExpenses) => {
    setDailyPlans((prevPlans) => 
      prevPlans.map(plan => 
        plan._id === planId ? { ...plan, expenses: updatedExpenses } : plan
      )
    );
  };
  
  useEffect(() => {
    const newSpending = dailyPlans.reduce((total, dailyPlan) => {
      return total + dailyPlan.expenses.reduce((totalExpense, expense) => totalExpense + expense.expense, 0);
    }, 0);
    setCurrentSpending(newSpending);
  }, [dailyPlans]);

  return (
    <SectionContainer>
      <BudgetGauge totalBudget={totalBudget} currentSpending={currentSpending} feedId={feed_Id} travelPlanId={travelPlanId} onUpdate={onBudgetUpdate}/>
      <DateSection>
        {dailyPlans.map((dailyPlan) => (
          <BudgetSection key={dailyPlan._id} dailyPlan={dailyPlan} onUpdateExpenses={(updatedExpenses) => handleExpensesChange(dailyPlan._id, updatedExpenses)}
          />
        ))}
      </DateSection>
    </SectionContainer>
  );
};

export default BudgetContent;
