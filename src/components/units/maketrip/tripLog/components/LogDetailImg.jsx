// import { useState } from "react";
import styled from "styled-components";

const flexStyles = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgCard = styled.div`
  width: 334px;
  height: 188px;
  border-radius: 8px;
  background-image: url(${(props) =>
    props.$imgUrl || "/img/triplog_default.jpg"});
  background-size: cover;
  background-position: center;
`;
const Overlay = styled.div`
  ${flexStyles}
  position: relative;
  width: 100%;
  height: inherit;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0%;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 100%;
  }

  & > * {
    background-color: transparent;
  }
`;

const Input = styled.input`
  height: auto;
  margin-right: 2px;
  accent-color: var(--main-color);
`;
const Label = styled.label`
  position: absolute;
  top: 16px;
  left: 16px;

  font-size: 12px;
  color: var(--white-color);
  display: flex;
  align-items: flex-end;
`;
const addButtonImg = "/icon/add_photo.svg";
const AddButton = styled.button`
  width: 25px;
  height: 25px;
  background-image: url(${addButtonImg});
`;

const LogDetailImg = ({
  id,
  imageUrl,
  readOnly,
  onClick,
  isThumbnail,
  handleCheckbox,
}) => {
  return (
    <>
      <ImgCard $imgUrl={imageUrl} alt="log_image">
        {!readOnly && (
          <Overlay>
            <Label htmlFor={id}>
              <Input
                type="checkbox"
                id={id}
                checked={isThumbnail}
                onChange={handleCheckbox}
              />
              대표 이미지
            </Label>
            <AddButton onClick={onClick} />
          </Overlay>
        )}
      </ImgCard>
    </>
  );
};

export default LogDetailImg;
