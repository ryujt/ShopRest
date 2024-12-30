# ShoppingMall API

**ShoppingMall API**는 JSONL 파일을 로컬 데이터베이스로 사용하는 간단한 쇼핑몰 REST API 서버입니다. 사용자 가입, 로그인, 상품 관리, 장바구니 기능을 제공합니다.

## 디렉토리 구조

```
.
├── README.md          # 프로젝트 설명 문서
├── index.js           # 메인 애플리케이션 코드
├── package-lock.json  # 종속성 잠금 파일
├── package.json       # Node.js 설정 파일
├── users.jsonl        # 사용자 데이터 파일 (JSONL 형식)
├── products.jsonl     # 상품 데이터 파일 (JSONL 형식)
└── images/            # 상품 이미지 폴더
    ├── 1.webp
    ├── 2.webp
    ├── 3.webp
    ├── 4.webp
    ├── 5.webp
    └── 6.webp
```

---

## 주요 기능

### 사용자
- **POST /users/signup**: 사용자 가입
- **POST /users/login**: 사용자 로그인

### 상품
- **GET /products**: 모든 상품 조회
- **POST /products**: 새 상품 추가
- **GET /products/:id**: 특정 상품 조회
- **PUT /products/:id**: 상품 수정
- **DELETE /products/:id**: 상품 삭제

### 장바구니
- **GET /cart?userId=**: 사용자의 장바구니 조회
- **POST /cart**: 장바구니에 상품 추가
- **PUT /cart/:id**: 장바구니 상품 수량 수정
- **DELETE /cart/:id**: 장바구니 상품 삭제

---

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/username/ShoppingMallAPI.git
cd ShoppingMallAPI
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 서버 실행
```bash
node index.js
```

**기본 포트**는 `3000`으로 설정되어 있습니다.

---

## API 사용 예시

### 1. 사용자 가입
```bash
curl -X POST http://localhost:3000/users/signup \
-H "Content-Type: application/json" \
-d '{"username": "류도영", "password": "1234"}'
```

### 2. 사용자 로그인
```bash
curl -X POST http://localhost:3000/users/login \
-H "Content-Type: application/json" \
-d '{"username": "류도영", "password": "1234"}'
```

### 3. 모든 상품 조회
```bash
curl -X GET http://localhost:3000/products
```

### 4. 특정 상품 조회
```bash
curl -X GET http://localhost:3000/products/1
```

### 5. 장바구니 조회
```bash
curl -X GET http://localhost:3000/cart?userId=do
```

### 6. 장바구니에 상품 추가
```bash
curl -X POST http://localhost:3000/cart \
-H "Content-Type: application/json" \
-d '{"userId": "do", "productId": "1", "quantity": 2}'
```

---

## 초기 데이터

### 상품 데이터 (`products.jsonl`)
```jsonl
{"id":"1","name":"자전거","price":100000,"image":"/images/1.webp","createdAt":"2024-12-30T00:00:00.000Z"}
{"id":"2","name":"핸드폰","price":200000,"image":"/images/2.webp","createdAt":"2024-12-30T00:00:00.000Z"}
{"id":"3","name":"노트북","price":300000,"image":"/images/3.webp","createdAt":"2024-12-30T00:00:00.000Z"}
{"id":"4","name":"키보드","price":40000,"image":"/images/4.webp","createdAt":"2024-12-30T00:00:00.000Z"}
{"id":"5","name":"마우스","price":20000,"image":"/images/5.webp","createdAt":"2024-12-30T00:00:00.000Z"}
{"id":"6","name":"헤드폰","price":80000,"image":"/images/6.webp","createdAt":"2024-12-30T00:00:00.000Z"}
```

### 사용자 데이터 (`users.jsonl`)
```jsonl
{"id":"do","username":"류도영","password":"1234","createdAt":"2024-12-30T00:00:00.000Z"}
```

---

## 개발 환경

- Node.js (v14 이상)
- Express (최신 버전)

---

## 라이센스

MIT
