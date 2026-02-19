# 🖋️ FicTalk

<p align="center">
  <img src="./public/fictalk-icon.png" alt="FicTalk Logo" width="120" />
</p>

<div align="center">
  <p>
    FicTalk은 사용자가 좋아하는 소설이나 웹소설의 등장인물과 실제로 대화할 수 있는 <strong>AI 채팅 플랫폼</strong>입니다.
  </p>
  <p>
    캐릭터를 선택하면 AI가 해당 캐릭터의 <strong>성격</strong>과 <strong>원작 줄거리</strong>를 바탕으로 자연스러운 대화를 이어갑니다.
  <p>
    원작에 있는 내용은 정확하게, 원작에 없는 내용은 캐릭터답게 창의적으로 응답합니다.
  </p>
</div>

# 🔗 Links

<p align="center">
  <a href="https://www.fictalk.site">배포 사이트</a>
  &nbsp;|&nbsp;
  <a href="https://github.com/taehoonkim1007/FicTalk-FE">프론트엔드 서버</a>
  &nbsp;|&nbsp;
  <a href="https://github.com/ytaehoonkim1007/FicTalk-BE">백엔드 서버</a>
  &nbsp;|&nbsp;
  <a href="https://github.com/taehoonkim1007/FicTalk-AI">AI 서버</a>
</p>

# 📖 Contents

- [💡 Motivation](#-motivation)
- [🛠 Tech Stacks](#-tech-stacks)
- [🎯 Features](#-features)
- [🧩 Challenges](#-challenges)
  - [1. Self-RAG 기반 적응형 채팅](#1-self-rag-기반-적응형-채팅)
    - [1-1. 문제 인식](#1-1-문제-인식)
    - [1-2. Self-RAG 도입](#1-2-self-rag-도입)
    - [1-3. 한국어 검색 최적화](#1-3-한국어-검색-최적화)
  - [2. 게스트 사용자 Redis 세션 관리](#2-게스트-사용자-redis-세션-관리)
    - [2-1. 요구사항 분석](#2-1-요구사항-분석)
    - [2-2. PostgreSQL vs Redis 선택](#2-2-postgresql-vs-redis-선택)
    - [2-3. Redis 데이터 구조 설계](#2-3-redis-데이터-구조-설계)
  - [3. 캐릭터에 맞는 음성 자동 선택](#3-캐릭터에-맞는-음성-자동-선택)
    - [3-1. Voice Library 탐색](#3-1-voice-library-탐색)
    - [3-2. 가중치 기반 매칭 알고리즘](#3-2-가중치-기반-매칭-알고리즘)
  - [4. 다층 동시성 제어](#4-다층-동시성-제어)
    - [4-1. 문제 상황](#4-1-문제-상황)
    - [4-2. 해결책: Lock, ContextVar, Semaphore](#4-2-해결책-lock-contextvar-semaphore)
- [📅 Schedule](#-schedule)
- [💭 Memoir](#-memoir)

# 💡 Motivation

웹소설이나 소설을 읽다 보면, 등장인물에게 직접 말을 걸고 싶다는 생각이 들 때가 있습니다.

**"이 캐릭터라면 이 상황에서는 어떤 생각을 하고 있을까?"**

FicTalk은 이런 상상을 현실로 만들기 위해 시작되었습니다.

단순히 LLM에 캐릭터 설정을 주입하는 것이 아니라, **원작의 줄거리를 실제로 참조**하면서도 **캐릭터의 성격에 맞게 창의적으로 대답**할 수 있는 시스템을 만들고 싶었습니다.

이를 위해 RAG(Retrieval-Augmented Generation)와 LangGraph 상태 머신을 결합한 **Self-RAG 기반 적응형 채팅 시스템**을 설계했습니다.

# 🛠 Tech Stacks

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?logo=reactquery&logoColor=white)

### Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?logo=amazons3&logoColor=white)

### AI Server

![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?logo=langchain&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?logo=googlegemini&logoColor=white)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-000000?logo=elevenlabs&logoColor=white)
![pgvector](https://img.shields.io/badge/pgvector-336791?logo=postgresql&logoColor=white)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?logo=amazonec2&logoColor=white)
![AWS RDS](https://img.shields.io/badge/AWS_RDS-527FFF?logo=amazonrds&logoColor=white)

# 🎯 Features

### 1. AI 캐릭터 채팅

사용자가 캐릭터를 선택하면, AI가 해당 캐릭터의 말투와 성격으로 대화합니다.

- 원작 내용 질문 → RAG 모드로 정확한 답변
- 원작에 없는 질문 → Creative 모드로 캐릭터다운 답변

### 2. AI 콘텐츠 생성

스토리와 캐릭터를 AI가 자동으로 생성합니다.

- 제목과 한줄 요약만 입력하면 5단계 줄거리 생성
- 줄거리 기반으로 등장인물 자동 생성
- 프로필 이미지, 커버 이미지, 배경 이미지 생성

### 3. 캐릭터 음성

ElevenLabs TTS로 캐릭터의 목소리를 들을 수 있습니다.

- 캐릭터 성격에 맞는 Voice ID 자동 추천
- 음성 설정 커스터마이징 가능

### 4. 게스트 모드

로그인 없이도 채팅 기능을 체험할 수 있습니다.

- IP 기반 게스트 식별
- 일일 사용량 제한으로 무분별한 사용 방지

# 🧩 Challenges

## 1. Self-RAG 기반 적응형 채팅

### 1-1. 문제 인식

처음에는 단순한 RAG 시스템을 구현했습니다. 사용자 질문을 임베딩하고, pgvector로 유사한 원작 청크를 검색한 뒤, 그 컨텍스트를 LLM에 전달하는 방식이었습니다.

하지만 테스트 과정에서 문제가 드러났습니다.

**문제 1: 유사도 점수의 한계**

"주인공의 성격이 어때?"라는 질문과 "오늘 날씨 어때?"라는 질문 모두 비슷한 유사도 점수가 나왔습니다. 단순히 숫자만으로는 "이 컨텍스트로 답변 가능한가?"를 판단할 수 없었습니다.

**문제 2: 캐릭터다움의 상실**

RAG 컨텍스트가 있으면 LLM이 그 내용에만 의존했습니다. "어제 뭐 했어?"처럼 원작에 없는 일상적 질문에도 억지로 원작 내용을 끼워맞추려 했습니다.

### 1-2. Self-RAG 도입

이 문제를 해결하기 위해 **Self-RAG** 개념을 도입했습니다.

기존 RAG가 "검색 → 생성"의 단순 파이프라인이라면, Self-RAG는 **LLM이 스스로 컨텍스트의 관련성을 평가**하는 단계를 추가합니다.

**LangGraph 상태 머신 설계**

```
[사용자 메시지]
      ↓
[RAG 검색] → 유사도 상위 청크 추출
      ↓
[Self-RAG 평가] → "이 컨텍스트로 답변 가능한가?" (Yes/No)
      ↓
   ┌──┴──┐
   ↓     ↓
[RAG]  [Creative]
 모드    모드
```

- **RAG 모드**: 원작 컨텍스트를 참조하여 정확한 정보 전달
- **Creative 모드**: 캐릭터의 성격과 세계관만 참조하여 창의적 응답

이 구조 덕분에 "주인공은 어떤 능력을 가지고 있어?"에는 원작 기반으로 답하고, "오늘 기분 어때?"에는 캐릭터 성격에 맞게 자유롭게 답할 수 있게 되었습니다.

### 1-3. 한국어 검색 최적화

RAG 검색 정확도를 높이기 위해 한국어 특성에 맞는 최적화를 적용했습니다.

**조사 제거**

"주인공이", "주인공을", "주인공은" 모두 "주인공"으로 정규화합니다. 한국어의 조사가 임베딩 유사도에 불필요한 차이를 만드는 것을 방지했습니다.

**키워드 부스팅**

벡터 유사도만으로는 놓칠 수 있는 중요 키워드를 보완했습니다. 사용자 메시지에서 추출한 키워드가 청크에 정확히 포함되면 부스트 점수(0.08)를 추가합니다.

**결과**

같은 질문에 대해 관련 없는 청크가 상위에 오는 문제가 줄어들고, Self-RAG 평가의 정확도도 함께 향상되었습니다.

## 2. 게스트 사용자 Redis 세션 관리

### 2-1. 요구사항 분석

FicTalk의 핵심 기능인 AI 채팅을 체험하려면 로그인이 필수였습니다. 하지만 처음 방문한 사용자가 로그인 없이 서비스를 경험해볼 수 있어야 전환율이 높아집니다.

동시에 다음 제약사항을 고려해야 했습니다.

- AI API 비용이 발생하므로 무제한 사용 불가
- 게스트 데이터는 영구 저장할 필요 없음
- 악의적 사용자의 무한 토큰 발급 방지

### 2-2. PostgreSQL vs Redis 선택

처음에는 일반 사용자와 동일하게 PostgreSQL에 게스트 데이터를 저장하려 했습니다. 하지만 문제가 있었습니다.

**PostgreSQL의 한계**

- 게스트 세션 만료 시 별도 정리 작업(Batch Job) 필요
- 단기 데이터를 위한 불필요한 DB 부하
- 스키마 복잡도 증가

**Redis 선택 이유**

- TTL(Time-To-Live) 기능으로 자동 만료
- 메시지는 List, 캐릭터 목록은 Set으로 최적화된 자료구조 활용
- 게스트 사용량(3회)이 적어 메모리 부담 없음

### 2-3. Redis 데이터 구조 설계

**키 구조**

```
guest:chat:{guestId}:{characterId}     → List (메시지)
guest:chat:characters:{guestId}        → Set (캐릭터 ID 목록)
guest:usage:{guestId}                  → Hash (사용량)
guest:ip_limit:{hashedIP}              → Counter (IP당 토큰 발급 횟수)
```

**TTL 정책**

| 데이터      | TTL 갱신 시점 | 이유                        |
| ----------- | ------------- | --------------------------- |
| 메시지      | 저장 시마다   | 활성 대화 유지              |
| 캐릭터 목록 | 최초 1회만    | 캐릭터 추가로 TTL 연장 방지 |
| IP 제한     | 최초 1회만    | 토큰 재발급 악용 방지       |

**게스트 제한**

| 항목           | 값  | 설명                             |
| -------------- | --- | -------------------------------- |
| 캐릭터 추가    | 1개 | 동시에 1명만 대화 가능           |
| 메시지 사용량  | 3회 | AI 응답 생성 횟수                |
| IP당 토큰 발급 | 5회 | localStorage 삭제 후 재발급 제한 |
| 세션 TTL       | 7일 | 자동 만료                        |

## 3. 캐릭터에 맞는 음성 자동 선택

### 3-1. Voice Library 탐색

ElevenLabs는 수백 개의 Voice를 제공합니다. 캐릭터를 생성할 때마다 사용자가 직접 Voice를 선택하는 것은 번거롭습니다.

캐릭터의 설명과 성격을 분석하여 적합한 Voice를 자동으로 추천하고 싶었습니다.

### 3-2. 가중치 기반 매칭 알고리즘

**1단계: 캐릭터 분석**

Gemini API로 캐릭터 설명을 분석하여 음성 속성을 추출합니다.

```
입력: "냉정하고 이성적인 30대 여성 검사"
출력: {
  gender: "female",
  age: "middle_aged",
  tone: ["calm", "authoritative"],
  keywords: ["professional", "serious"]
}
```

**2단계: Voice 점수 계산**

각 Voice에 대해 매칭 점수를 계산합니다.

| 속성   | 가중치 | 설명                                 |
| ------ | ------ | ------------------------------------ |
| 성별   | 50     | 일치 시 +50, 불일치 시 -100 (페널티) |
| 나이대 | 15     | young, middle_aged, old 매칭         |
| 톤     | 10     | calm, energetic, warm 등 매칭        |
| 키워드 | 3      | 각 키워드 매칭당 +3                  |

성별 불일치에 큰 페널티(-100)를 부여하여, 여성 캐릭터에 남성 Voice가 선택되는 것을 방지했습니다.

**3단계: 최종 선택**

가장 높은 점수의 Voice ID를 반환합니다. 점수가 동일하면 ElevenLabs의 기본 추천 Voice를 사용합니다.

## 4. 다층 동시성 제어

### 4-1. 문제 상황

AI 서버는 FastAPI 기반 싱글톤 서비스로 구성되어 있습니다. 여러 사용자가 동시에 채팅을 요청하면 다음 문제가 발생했습니다.

**문제 1: 세션 캐시 Race Condition**

Python dict는 thread-safe하지 않습니다. 동시에 여러 요청이 같은 세션 캐시에 접근하면 데이터가 덮어쓰기되거나 손실되었습니다.

**문제 2: DB 세션 교차 오염**

싱글톤 서비스의 인스턴스 변수 `self._current_db`에 DB 세션을 저장했습니다. Request A가 저장한 DB 세션을 Request B가 덮어쓰면, Request A는 엉뚱한 DB 세션을 사용하게 됩니다.

**문제 3: API Rate Limit 경합**

Gemini API 무료 티어는 분당 요청 제한이 있습니다. 여러 사용자가 동시에 이미지를 생성하면 429 에러가 빈번하게 발생했습니다.

### 4-2. 해결책: Lock, ContextVar, Semaphore

**asyncio.Lock - 캐시 보호**

세션 캐시의 모든 읽기/쓰기 작업을 Lock으로 감쌌습니다.

```
async with self._lock:
    entry = self._cache.get(session_id)  # 원자적 읽기
```

**contextvars - 요청별 DB 세션 격리**

인스턴스 변수 대신 `ContextVar`를 사용하여 각 요청이 독립된 DB 세션을 갖도록 했습니다.

```
변경 전: self._current_db = db     # 모든 요청이 공유
변경 후: _current_db_context.set(db)  # 요청별 격리
```

**asyncio.Semaphore - API 동시 요청 제한**

Gemini API 호출을 Semaphore로 제한하여 Rate Limit을 예방했습니다.

| 서비스             | 동시 요청 제한 | 근거                 |
| ------------------ | -------------- | -------------------- |
| 임베딩 생성        | 5개            | 분당 제한 여유 확보  |
| 이미지/텍스트 생성 | 3개            | 더 엄격한 Rate Limit |

**아키텍처 변화**

```
변경 전:
Request A, B ──► ChatService(싱글톤) ──► self._current_db (충돌!)

변경 후:
Request A ──► ChatService ──► _current_db_context.get() ──► DB Session A
Request B ──► ChatService ──► _current_db_context.get() ──► DB Session B
                   │
                   └── self._lock ──► 원자적 캐시 접근
```

# 📅 Schedule

**2025.01 ~ 2025.02 (약 6주)**

| 주차  | 내용                                   |
| ----- | -------------------------------------- |
| 1주차 | 프로젝트 기획, 기술 스택 선정, DB 설계 |
| 2주차 | BE 인증 시스템, FE 기본 구조           |
| 3주차 | AI 서버 구축, RAG 파이프라인           |
| 4주차 | 채팅 기능, Self-RAG 구현               |
| 5주차 | 이미지/TTS 생성, 게스트 시스템         |
| 6주차 | 배포, 버그 수정, 최적화                |

# 💭 Memoir

이 프로젝트를 통해 가장 많이 배운 것은 **"완벽한 기술보다 적절한 기술"** 의 중요성입니다.

처음에는 RAG 정확도를 100%에 가깝게 만들려고 했습니다. 하지만 캐릭터 채팅이라는 도메인에서는 "정확함"보다 "캐릭터다움"이 더 중요하다는 것을 깨달았습니다.

Self-RAG를 도입하면서 "모든 질문에 정확히 답해야 한다"는 강박에서 벗어났습니다. 원작에 없는 내용은 캐릭터가 상상해서 답해도 괜찮다는 것, 그것이 오히려 더 자연스러운 대화라는 것을 배웠습니다.

또한 LangGraph를 사용하면서 복잡한 AI 워크플로우를 상태 머신으로 관리하는 방법을 익혔습니다. 조건부 분기와 상태 전이를 명시적으로 정의하니, 디버깅도 쉬워지고 확장도 용이해졌습니다.

앞으로 더 다양한 캐릭터와 스토리를 지원하고, 사용자들이 직접 만든 콘텐츠를 더 많은 사용자들에게 공유할 수 있는 기능도 추가해보고 싶습니다.
