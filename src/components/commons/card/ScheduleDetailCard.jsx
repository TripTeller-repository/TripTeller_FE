import React, { useState } from "react";
import styled from "styled-components";
import ScheduleCard from "/src/components/commons/card/ScheduleCard"; //📌 요거가 원본 컴포넌트
import ScheduleEditModal from "/src/components/commons/modals/ScheduleEditModal";
import ScheduleDeleteModal from "/src/components/commons/modals/ScheduleDeleteModal";

// 📌일정관리 창에서는 그림자를 주고있어서, 추가 css 스타일링을 할 수 있는 코드입니다.
const NewCard = styled(ScheduleCard)`
  box-shadow: var(--box-shadow);
  border: 1px solid var(--main-color);

  p:last-child {
    color: var(--text-color);
  }
  //   원하는 스타일링 추가 가능
`;

const ScheduleDetailCard = ({ scheduleInfo, onUpdate, onDelete, planId }) => {
  // 📌아래는 기택님이 작성하셨던 모달 관련 코드입니다.
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 수정 모달에 사용할 데이터 상태 추가
  const [editData, setEditData] = useState({
    location: '',
    // time: '',
    memo: ''
  });

  // 수정 모달을 여는 함수
  const handleOpenEditModal = () => {
    setEditData({
      location: scheduleInfo.location,
      // time: scheduleInfo.time,
      memo: scheduleInfo.memo,
    });
    setIsEditModalOpen(true);
  };

  // 수정 모달을 닫는 함수
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  // 삭제 모달을 여는 함수
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);

  // 삭제 모달을 닫는 함수
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <>
      <NewCard ScheduleInfo={scheduleInfo}>
        {/* 📌이부분은 children으로 남겨놔서 버튼아이콘을 넣을 수 있는 자리입니다. */}
        <img
          src="/icon/edit.svg"
          alt="Edit"
          onClick={handleOpenEditModal}
        />
        <img
          src="/icon/delete.svg"
          alt="Delete"
          onClick={handleOpenDeleteModal}
        />
      </NewCard>
      {/* 📌마찬가지로 기택님이 작성하셨던 모달관련 코드 위치 그대로 넣을 수 있습니다. */}
      {isEditModalOpen && 
        <ScheduleEditModal 
        editData={editData}
        scheduleInfo={scheduleInfo}
        onClose={handleCloseEditModal}
        onUpdate={(updatedData) => onUpdate(updatedData, scheduleInfo._id, planId)}
        planId={planId}
      />}
      {isDeleteModalOpen && (
        <ScheduleDeleteModal 
          onClose={handleCloseDeleteModal} 
          onDelete={() => onDelete(scheduleInfo._id, planId)}
          scheduleId={scheduleInfo._id}  
      />
      )}
    </>
  );
};

export default ScheduleDetailCard;
