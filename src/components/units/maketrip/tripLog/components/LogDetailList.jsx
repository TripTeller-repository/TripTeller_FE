import styled from "styled-components";
import { useState, useEffect } from "react";
import LogDetailCard from "/src/components/units/maketrip/tripLog/components/LogDetailCard";
import LogImgUploadModal from "/src/components/commons/modals/LogImgUploadModal";
import useModalOpenClose from "/src/hooks/useModalOpenClose";
import { URL } from "/src/api/API";
const token = localStorage.getItem("accessToken");

const Ul = styled.ul`
  flex-direction: column;
  display: flex;

  li {
    margin-bottom: 10px;
  }

  & > li:last-child {
    margin-bottom: 0;

    li:last-child {
      margin-bottom: 2px;
    }
  }
`;
const ScrollContainer = styled.div``;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
`;

// card 컴포넌트들을 데이터에 맞게 map으로 뿌려주는 역할
const LogDetailList = ({
  dailyPlanList,
  onSaveText,
  readOnly,
  feedId,
  coverImage,
}) => {
  const [dailyScheduleId, setDailyScheduleId] = useState(null);

  const { openModal, closeModal, modalOpen } = useModalOpenClose();
  // 각 scheduleId에 대한 이미지 URL 저장
  const [imageUrls, setImageUrls] = useState({});

  const openModalwithId = (id) => {
    setDailyScheduleId(id);
    openModal();
  };
  //이미지 업로드
  const handleImageUpload = (scheduleId, url) => {
    setImageUrls((prevUrls) => ({ ...prevUrls, [scheduleId]: url }));
  };

  const [thumbnailChecked, setThumbnailChecked] = useState(false);

  useEffect(() => {
    // 페이지가 처음 렌더링될 때, coverImage 값과 imageUrl이 일치하는 카드가 있는지 확인
    const cardWithCoverImage = dailyPlanList.find((dailyPlan) =>
      dailyPlan.dailySchedules.some(
        (dailySchedule) => dailySchedule.imageUrl === coverImage,
      ),
    );

    // 해당 카드가 있을 경우 썸네일 상태를 true로 설정
    if (cardWithCoverImage) {
      // 해당 카드의 dailyScheduleId와 imageUrl을 가져와서 썸네일 상태 변경 함수 호출
      handleCheckbox(
        feedId,
        cardWithCoverImage._id,
        cardWithCoverImage.imageUrl,
      );
    }
  }, [coverImage, dailyPlanList, feedId]);

  // 토글 버튼의 상태를 변경하는 함수
  const handleCheckbox = async (feedId, imageUrl) => {
    try {
      // 서버에 check된 카드의 imageUrl을 전송
      const response = await fetch(`${URL}/feed/${feedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coverImage: imageUrl }),
      });

      if (!response.ok) {
        throw new Error("네트워크 응답이 올바르지 않습니다.");
      }

      // 성공적으로 변경되었음을 콘솔에 표시

      // 썸네일 상태 변경
      setThumbnailChecked(true);
    } catch (error) {
      console.error("데이터를 업데이트하는데 실패했습니다:", error.message);
    }
  };

  return (
    <Ul>
      {dailyPlanList.map((dailyPlan, index) => (
        <li key={dailyPlan._id}>
          <ScrollContainer id={index}>
            <Title>
              <h3>Day {index + 1}</h3>
            </Title>
          </ScrollContainer>
          <ul>
            {dailyPlan.dailySchedules.map((dailySchedule, scheduleIndex) => (
              <LogDetailCard
                key={dailySchedule._id}
                id={`${index}-${scheduleIndex}`}
                // 업로드된 새 이미지 또는 기존 이미지
                ScheduleInfo={{
                  ...dailySchedule,
                  imageUrl:
                    imageUrls[dailySchedule._id] || dailySchedule.imageUrl,
                }}
                onSaveText={(text) => onSaveText(dailySchedule._id, text)}
                readOnly={readOnly}
                onClick={() => openModalwithId(dailySchedule._id)}
                handleCheckbox={() =>
                  // 썸네일 체크 상태를 부모 컴포넌트에서 관리하지 않고,
                  // 각각의 카드 컴포넌트에서 독립적으로 관리하기 위해
                  // 해당 dailyScheduleId와 이미지 URL을 전달
                  handleCheckbox(feedId, dailySchedule.imageUrl)
                }
                isThumbnail={
                  thumbnailChecked && dailySchedule.imageUrl === coverImage
                }
              ></LogDetailCard>
            ))}
          </ul>
        </li>
      ))}
      {modalOpen && (
        <LogImgUploadModal
          dailyScheduleId={dailyScheduleId}
          onClose={closeModal}
          onImageUpload={handleImageUpload}
        >
          여행 이미지 등록하기
        </LogImgUploadModal>
      )}
    </Ul>
  );
};

export default LogDetailList;
