import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { useAPI } from "/src/api/API";

function useImgUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [resizedFile, setResizedFile] = useState(null);
  const { request } = useAPI();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    try {
      const resizedImage = await resizeImage(file);
      const resizedImageUrl = URL.createObjectURL(resizedImage);
      setResizedFile(new File([resizedImage], file.name, { type: "image/jpeg" }));
      setImagePreview(resizedImageUrl);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file, // Blob 형식의 이미지 파일
        500, // maxWidth
        500, // maxHeight
        "JPEG", // 이미지 형식
        100, // 품질 (100은 최대 품질)
        0, // 회전 각도 (기본값: 0)
        (uri) => {
          resolve(uri); // 콜백 함수
        },
        "blob", // 출력 형식 (base64 | blob | file)
      );
    });
  };

  const fetchSignedUrl = async (fileName) => { 
    try {
      // useAPI를 사용하여 서명된 URL 요청
      const response = await request(`/user/profile-image-signed-url/${fileName}`);
      const signedUrl = response.data.signedUrl;
      
      return signedUrl;
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택해 주세요.");
      return;
    }

    try {
      const signedUrl = await fetchSignedUrl(selectedFile.name);
      if (!signedUrl) throw new Error("Failed to get signed URL");

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: resizedFile,
      });

      if (!uploadResponse.ok) {
        const responseBody = await uploadResponse.text(); // 응답 본문 가져오기
        console.error("Upload failed with status:", uploadResponse.status);
        console.error("Response body:", responseBody);
        throw new Error("Upload failed");
      } else {
        // 업로드 성공 후 URL을 상태에 저장
        const publicUrl = signedUrl.split('?')[0]; // 쿼리 파라미터 제거
        setUploadedUrl(publicUrl);
        return publicUrl;
      }
      
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  return {
    uploadedUrl,
    imagePreview,
    fileName: selectedFile ? selectedFile.name : "",
    handleFileChange,
    handleUpload,
  };
}

export default useImgUpload;
