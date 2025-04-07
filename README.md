# TripTeller Front-end

- [배포 아키텍쳐](#배포-아키텍처)
- [담당](#담당)
- [기술 스택](#기술-스택)
- [폴더 구조](#폴더-구조)
- [CSS 스타일링](#css-스타일링)
- [ESLint Rules](#eslint-rules)

---

## 배포 아키텍처

- AWS S3, CloudFront, GitHub Actions를 활용한 자동화된 배포 시스템을 구축

    ![Image](https://github.com/user-attachments/assets/e612353c-b2c6-401b-bc21-d6bbd21c037c)

### 주요 구성요소

#### AWS S3

- 정적 웹 호스팅 (버킷: tripteller-frontend)
- index.html을 기본 문서로 설정

#### AWS CloudFront

- S3 버킷을 오리진으로 하는 CDN 서비스
- HTTPS 지원 및 전역 배포

#### GitHub Actions CI/CD

- master 브랜치 푸시 시 자동 배포
- 빌드 후 S3 업로드 및 CloudFront 캐시 무효화

### 배포 흐름

개발자 코드 푸시 → GitHub Actions 실행 → React 빌드 → S3 업로드 → CloudFront 갱신 → 사용자에게 전달

---

## 담당

- 4명 <br>
  | 이름  | 담당 업무 |
  |----------------------------|--------------------------|
  | 손민혁 | • 로그인 및 회원가입, 회원정보수정, 예산/지출페이지 |
  | 이가린 | • 클라이언트 배포 |
  | 이보미 | • 우리의여행, 여행로그 상세페이지, 여행로그 작성페이지 |
  | 이유림 | • 메인페이지, 나의 여행 페이지 |
  | 임기택 | • 일정/관리 페이지, Kakao지도 API 활용 |

## 기술 스택

- React + vite
- styled-components
- recoil
- ESLint
- prettier
- createBrowserRouter
- fetch
- gitmessage

## 폴더 구조

- assets / components / layouts / pages 구조

## css 스타일링

- reset.css : 기본 css 초기화 (출처 http://meyerweb.com/eric/tools/css/reset)
- global.css : 공통컬러 변수 지정 / font, button, input default값 설정
- font.css : Pretendard 연결 (Black / ExtraBold / SemiBold / Medium / Regular(default))

## ESLint rules

- React 17+ 문법 지원 (react/react-in-jsx-scope 해제)
- 중복 import 방지
- 사용하지 않는 변수 감지
- React Hooks 규칙 적용
- prop-types 검증 비활성화

## 초기세팅 완료 사항 (24.04.04)

1. App.jsx에 전역 css파일 import와 라우팅 완료

- reset.css
- global.css
- font.css

2. layouts 안에 header + childeren + footer 형태의 Layout 컴포넌트 생성 완료

3. React Router - 페이지들 정의, 라우팅 등록(url 리스트업) 완료
