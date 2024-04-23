import React, { useState } from 'react';
import styled from 'styled-components';
import DaumPostcode from 'react-daum-postcode';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const MapModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; // 다른 컴포넌트 위에 표시
`;

const MapModalContent = styled.div`
  position: relative; // 상대 위치 설정
  width: 800px;  // 모달 내 지도의 너비
  height: 600px; // 모달 내 지도의 높이
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden; // 지도가 모달 밖으로 넘치는 것을 방지
`;

const PostcodeModal = styled.div`
  display: block; // 레이어가 보이도록 설정
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); // 화면 중앙에 표시
  width: 500px; // 검색창의 너비
  height: 460px; // 검색창의 높이
  border: 1px solid #000000; // 검색창의 테두리
  background-color: white; // 배경색
  z-index: 100; // 지도 위에 표시되도록 z-index 설정
`;

const SearchButton = styled.button`
  width: 100px;
  height: 50px;
  color: var(--white-color); // 폰트 색상
  font-size: 14px; // 폰트 사이즈
  font-family: "PretendardSemiBold"; // 폰트 굵기
  background-color: var(--main2-color);

  border-radius: 8px;
  position: absolute; // 절대 위치 사용
  top: 10px; // 상단으로부터 20px 떨어진 위치에 배치
  left: 50%; // 컨테이너의 가로 중앙에 위치
  transform: translateX(-50%); // 왼쪽으로 50% 만큼 이동하여 정확히 중앙에 위치
  z-index: 101; // 다른 요소들 위에 보이도록 z-index 설정
`;

const KakaoMapModal = ({ onClose, onSelectLocation }) => {
  const [position, setPosition] = useState({ lat: 37.5665, lng: 126.9780 });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [markerInfo, setMarkerInfo] = useState('');

  const handleComplete = (data) => {
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(data.address, function(results, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const newCoords = new kakao.maps.LatLng(results[0].y, results[0].x);
        setPosition({ lat: results[0].y, lng: results[0].x });
        setIsPostcodeOpen(false); // 검색 완료 후 우편번호 찾기 창 닫기

        // 검색된 주소 정보를 부모 컴포넌트인 ScheduleNewModal로 전달합니다.
        setMarkerInfo(data.buildingName || data.address);
      } else {
        alert("주소 검색 결과가 없습니다.");
      }      
    });
  };

  const handleMarkerClick = () => {
    onSelectLocation(markerInfo);
    onClose(); // 지도 모달 닫기
  };

  return (
    <MapModalOverlay onClick={onClose}>
      <MapModalContent onClick={(e) => e.stopPropagation()}>
        <SearchButton onClick={() => setIsPostcodeOpen(true)}>
          주소 검색
        </SearchButton>
        {isPostcodeOpen && (
          <PostcodeModal>
            <DaumPostcode onComplete={handleComplete} />
          </PostcodeModal>
        )}
        <Map center={position} style={{ width: '100%', height: '530px' }} level={3}>
          {position && (
            <MapMarker position={position} onClick={handleMarkerClick}>
            {/* 마커 클릭 시 표시될 정보 창 내용 */}
            
              <div style={{
                padding: "5px",
                borderRadius: "5px",
                background: "var(--main2-color)",
                color: "var(--text-color)",
              }}>
                {markerInfo}
              </div>
            
            </MapMarker>
          )}
        </Map>
      </MapModalContent>
    </MapModalOverlay>
  );
};

export default KakaoMapModal;