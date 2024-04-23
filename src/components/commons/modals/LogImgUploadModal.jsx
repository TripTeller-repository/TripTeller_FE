import styled from "styled-components";
import Button from "/src/components/commons/buttons/Button";
import useLogImgUpload from "/src/hooks/useLogImgUpload";
import { URL } from "/src/api/API";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;,
  z-index: 1000;
`;
const ModalBox = styled.div`
  position: fixed;
  width: auto;
  display: flex;
  flex-direction: column;

  background-color: var(--white-color);
  border-radius: 30px;
  border: 1px solid var(--main2-color);
  box-shadow: var(--box-shadow);
  padding: 48px 80px;
  gap: 18px;

  z-index: 2000;
`;
const ModalText = styled.div`
  height: auto;
  width: 100%;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--main2-color);
  font-size: 32px;

  display: flex;
  justify-content: center;
`;
const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;

  p:first-child {
    font-family: PretendardSemiBold;
  }
  button {
    width: 100%;
  }
`;
const Preview = styled.div`
  width: ${(props) => props.$width || "320px"};
  height: ${(props) => props.$height || "188px"};
  border-radius: ${(props) => props.$radius || "10px"};
  background-color: var(--backgray-color);

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const FileName = styled.p`
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--subtext-color);
`;
const Input = styled.input`
  display: none;
`;
const Label = styled.label`
  font-family: "PretendardSemiBold";
  font-size: 14px;
  color: var(--white-color);
  border: none;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--main2-color);
  transition: background-color;
  outline: none;
  height: 40px;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: var(--main-color);
    transition-duration: 0.2s;
    cursor: pointer;
  }

  &:active {
    background-color: var(--back-color);
    color: var(--main-color);
    transition-duration: 0s;
    border: 1px solid var(--main-color);
  }

  &:focus {
    outline: none;
  }
`;
const SubmitButton = styled(Button)`
  background-color: var(--back-color);
  color: var(--main-color);
  border: 1px solid var(--main2-color);
  &:hover {
    color: var(--white-color);
    border-color: var(--main-color);
  }
  &:active {
    color: var(--main-color);
  }
`;

const LogImgUploadModal = ({
  onClose,
  children,
  width,
  height,
  radius,
  dailyScheduleId,
  onImageUpload,
}) => {
  const {
    uploadedUrl,
    imagePreview,
    fileName,
    handleFileChange,
    handleUpload,
  } = useLogImgUpload(dailyScheduleId);

  const handleSubmit = async () => {
    try {
      // 업로드 후 URL 반환받기, 변경
      const url = await handleUpload();
      if (url) {
        onImageUpload(dailyScheduleId, url);
        // 이미지 등록 API 호출
        const response = await fetch(
          `${URL}/dailySchedule/${dailyScheduleId}/travelLog/image`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              imageUrl: url,
            }),
          },
        );

        if (response.ok) {
          console.log("Log image updated successfully.");
        } else {
          console.error("Failed to update Log image");
          throw new Error("Failed to update Log image");
        }

        onClose();
      } else {
        throw new Error("Uploaded URL is missing");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <ModalBackdrop onMouseDown={onClose}>
      <ModalBox onMouseDown={(e) => e.stopPropagation()}>
        <ModalText>
          <h2>
            {/* 모달 제목 입력하기 */}
            {children ? children : "이미지 등록하기"}
          </h2>
        </ModalText>
        <Form>
          <p>미리보기</p>
          {/* 원하는 미리보기 이미지의 사이즈 입력하기 */}
          <Preview $width={width} $height={height} $radius={radius}>
            {imagePreview && (
              <>
                <img src={imagePreview} alt="Preview" />
              </>
            )}
          </Preview>
          <FileName>{fileName}</FileName>
          <Label>
            업로드할 이미지 선택
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Label>
          <SubmitButton type="submit" onClick={handleSubmit}>
            등록하기
          </SubmitButton>
          {uploadedUrl && console.log(uploadedUrl)}
        </Form>
      </ModalBox>
    </ModalBackdrop>
  );
};

export default LogImgUploadModal;

// 📌사용 예시
// <ImgUploadModal
//   width="" <= 미리보기 가로
//   height="" <= 미리보기 세로
//   radius="" <= 미리보기 모서리둥글기
//   onClose={closeModal} <= "useModalOpenClose" hook import해서 쓰기
// >
// 여행 이미지 등록하기 <= 모달 제목
// </ImgUploadModal>;
