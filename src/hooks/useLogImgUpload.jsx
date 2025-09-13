import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { useAPI } from "/src/api/API";

function useLogImgUpload() {
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
      setResizedFile(
        new File([resizedImage], file.name, { type: "image/jpeg" }),
      );
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

  const fetchSignedUrl = async (fileName, contentType) => {
    try {
      // useAPI를 사용하여 서명된 URL 요청
      const response = await request(
        `/travel-log-image-signed-url/${fileName}?contentType=${contentType}`,
      );
      console.log("=========signed url response:", response);
      const { uploadUrl, downloadUrl, key } = response.data.signedUrl;

      return { uploadUrl, downloadUrl, key };
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
      const urls = await fetchSignedUrl(selectedFile.name, resizedFile.type);
      if (!urls) throw new Error("Failed to get signed URL");

      const { uploadUrl, downloadUrl } = urls;

      console.log("==========resizedFile.type", resizedFile.type);

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: resizedFile,
        headers: {
          "Content-Type": resizedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        const responseBody = await uploadResponse.text(); // 응답 본문 가져오기
        console.error("Upload failed with status:", uploadResponse.status);
        console.error("Response body:", responseBody);
        throw new Error("Upload failed");
      }

      setUploadedUrl(downloadUrl);
      return downloadUrl;
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

export default useLogImgUpload;
