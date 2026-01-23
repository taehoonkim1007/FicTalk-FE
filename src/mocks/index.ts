import type { Character, Creator, HeroSlide, Story } from "@/types";

export const CATEGORIES = ["추천", "세계 문학", "한국 문학", "창작"];

// Common Character Data
const LITTLE_PRINCE_CHARS: Character[] = [
  {
    id: "lp-1",
    name: "어린왕자",
    role: "주인공",
    desc: "B612 소행성에서 온 순수한 영혼",
    image: "bg-sky-200",
  },
  {
    id: "lp-2",
    name: "여우",
    role: "친구",
    desc: "길들여짐의 의미를 알려주는 현명한 친구",
    image: "bg-orange-200",
  },
  {
    id: "lp-3",
    name: "장미",
    role: "연인",
    desc: "허영심 많지만 사랑스러운 존재",
    image: "bg-red-200",
  },
  {
    id: "lp-4",
    name: "조종사",
    role: "화자",
    desc: "사막에 불시착하여 왕자를 만난 어른",
    image: "bg-stone-300",
  },
];

const GATSBY_CHARS: Character[] = [
  {
    id: "g-1",
    name: "제이 개츠비",
    role: "주인공",
    desc: "과거를 되돌리고 싶은 남자",
    image: "bg-emerald-200",
  },
  {
    id: "g-2",
    name: "데이지 뷰캐넌",
    role: "히로인",
    desc: "개츠비의 영원한 사랑이자 꿈",
    image: "bg-rose-100",
  },
  {
    id: "g-3",
    name: "닉 캐러웨이",
    role: "관찰자",
    desc: "개츠비의 이웃이자 소설의 화자",
    image: "bg-stone-300",
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "새는 알을 깨고 나온다",
    storyTitle: "데미안",
    desc: "아프락사스에게로 날아가기 위한 투쟁.\n싱클레어의 내면으로 깊이 들어가보세요.",
    image: "bg-gradient-to-r from-stone-800 to-stone-950",
    tag: "성장소설",
    character: "데미안",
    firstMessage: "새는 알을 깨고 나오려 힘겹게 싸운다. 너의 세계는 안녕한가?",
  },
  {
    id: 2,
    title: "편견은 내가 다른 사람을 사랑하지 못하게 하고,",
    storyTitle: "오만과 편견",
    desc: "오만은 다른 사람이 나를 사랑할 수 없게 만든다.\n다아시 씨와의 오해를 풀고 진실한 대화를 나눠보세요.",
    image: "bg-gradient-to-r from-rose-900 to-stone-900",
    tag: "로맨스",
    character: "엘리자베스",
    firstMessage: "다아시 씨는 정말 오만한 사람이에요. 그렇지 않나요?",
  },
  {
    id: 3,
    title: "과거를 반복할 수 없다고? 천만에,",
    storyTitle: "위대한 개츠비",
    desc: "우리는 할 수 있어. 물론이고 말고.\n개츠비의 화려한 파티에 당신을 초대합니다.",
    image: "bg-gradient-to-r from-emerald-900 to-stone-900",
    tag: "미국문학",
    character: "제이 개츠비",
    firstMessage: "저기 초록 불빛이 보이는군. 데이지가 저기 있어. 내 말 들리나?",
  },
];

export const RECOMMENDED_STORIES: Story[] = [
  {
    id: 1,
    title: "변신",
    author: "프란츠 카프카",
    tags: ["#부조리", "#실존"],
    color: "bg-stone-800",
    summary:
      "어느 날 아침, 그레고르 잠자는 자신이 거대한 벌레로 변해버린 것을 발견한다. 가족과의 소외, 인간 존재의 불안을 다룬 카프카의 대표작.",
    characters: [
      {
        id: "k-1",
        name: "그레고르 잠자",
        role: "주인공",
        desc: "어느 날 벌레가 되어버린 세일즈맨",
        image: "bg-stone-600",
      },
      {
        id: "k-2",
        name: "그레테",
        role: "여동생",
        desc: "오빠를 돌보려 노력하는 여동생",
        image: "bg-stone-400",
      },
    ],
  },
  {
    id: 2,
    title: "1984",
    author: "조지 오웰",
    tags: ["#디스토피아", "#감시"],
    color: "bg-indigo-900",
    summary:
      "빅 브라더가 지배하는 감시 사회. 윈스턴 스미스는 당의 통제에 의문을 품고 금지된 사랑과 자유를 꿈꾼다.",
    characters: [
      {
        id: "o-1",
        name: "윈스턴 스미스",
        role: "주인공",
        desc: "진실을 기록하려는 하급 당원",
        image: "bg-blue-300",
      },
      {
        id: "o-2",
        name: "줄리아",
        role: "연인",
        desc: "당의 규율을 어기는 대담한 여성",
        image: "bg-rose-300",
      },
      {
        id: "o-3",
        name: "오브라이언",
        role: "내부당원",
        desc: "윈스턴에게 접근하는 미스터리한 인물",
        image: "bg-gray-700",
      },
    ],
  },
  {
    id: 3,
    title: "폭풍의 언덕",
    author: "에밀리 브론테",
    tags: ["#애증", "#복수"],
    color: "bg-rose-950",
    summary: "황량한 들판을 배경으로 펼쳐지는 히스클리프와 캐서린의 지독한 사랑과 복수의 대서사시.",
    characters: [
      {
        id: "wh-1",
        name: "히스클리프",
        role: "주인공",
        desc: "복수심에 불타는 열정적인 남자",
        image: "bg-stone-800",
      },
      {
        id: "wh-2",
        name: "캐서린 언쇼",
        role: "히로인",
        desc: "자유분방하고 이기적인 영혼",
        image: "bg-rose-800",
      },
    ],
  },
  {
    id: 4,
    title: "어린 왕자",
    author: "생텍쥐페리",
    tags: ["#동화", "#철학"],
    color: "bg-sky-900",
    summary:
      "사막에 불시착한 조종사가 B612 행성에서 온 신비로운 소년을 만나 겪는 이야기. '중요한 것은 눈에 보이지 않아.'",
    characters: LITTLE_PRINCE_CHARS,
  },
];

export const RISING_CREATORS: Creator[] = [
  {
    id: 1,
    name: "셰익스피어",
    title: "햄릿",
    desc: "죽느냐 사느냐 그것이 문제로다",
    color: "bg-slate-800",
  },
  {
    id: 2,
    name: "도스토옙스키",
    title: "죄와 벌",
    desc: "선택받은 자의 권리란 무엇인가",
    color: "bg-red-900",
  },
  {
    id: 3,
    name: "괴테",
    title: "파우스트",
    desc: "멈추어라, 너는 정말 아름답구나",
    color: "bg-yellow-900",
  },
  {
    id: 4,
    name: "알베르 카뮈",
    title: "이방인",
    desc: "오늘 엄마가 죽었다",
    color: "bg-stone-600",
  },
  { id: 5, name: "생텍쥐페리", title: "어린 왕자", desc: "나를 길들여줘", color: "bg-sky-700" },
  { id: 6, name: "제인 오스틴", title: "엠마", desc: "내 짝은 내가 정해요", color: "bg-pink-900" },
];

export const WORLD_LIT_STORIES: Story[] = [
  {
    id: 1,
    title: "위대한 개츠비",
    author: "F. 스콧 피츠제럴드",
    tags: ["#미국문학", "#사랑"],
    color: "bg-emerald-900",
    summary: "1920년대 뉴욕, 신비로운 백만장자 제이 개츠비의 꿈과 사랑, 그리고 비극적인 최후.",
    characters: GATSBY_CHARS,
  },
  {
    id: 2,
    title: "오만과 편견",
    author: "제인 오스틴",
    tags: ["#로맨스", "#고전"],
    color: "bg-rose-900",
    characters: [
      {
        id: "op-1",
        name: "엘리자베스",
        role: "주인공",
        desc: "지적이고 편견을 가진 여성",
        image: "bg-yellow-100",
      },
      {
        id: "op-2",
        name: "다아시",
        role: "남주인공",
        desc: "오만하지만 속이 깊은 신사",
        image: "bg-blue-900",
      },
    ],
  },
  {
    id: 3,
    title: "1984",
    author: "조지 오웰",
    tags: ["#디스토피아", "#감시"],
    color: "bg-indigo-900",
    characters: RECOMMENDED_STORIES[1].characters,
  },
  {
    id: 4,
    title: "제인 에어",
    author: "샬롯 브론테",
    tags: ["#성장", "#로맨스"],
    color: "bg-slate-800",
  },
  {
    id: 5,
    title: "폭풍의 언덕",
    author: "에밀리 브론테",
    tags: ["#애증", "#복수"],
    color: "bg-rose-950",
    characters: RECOMMENDED_STORIES[2].characters,
  },
  {
    id: 6,
    title: "노인과 바다",
    author: "어니스트 헤밍웨이",
    tags: ["#인간", "#의지"],
    color: "bg-sky-900",
  },
  {
    id: 7,
    title: "호밀밭의 파수꾼",
    author: "J.D. 샐린저",
    tags: ["#청춘", "#방황"],
    color: "bg-amber-900",
  },
  {
    id: 8,
    title: "작은 아씨들",
    author: "루이자 메이 올콧",
    tags: ["#가족", "#성장"],
    color: "bg-orange-900",
  },
  {
    id: 9,
    title: "모비 딕",
    author: "허먼 멜빌",
    tags: ["#모험", "#고래"],
    color: "bg-blue-900",
  },
  {
    id: 10,
    title: "동물 농장",
    author: "조지 오웰",
    tags: ["#풍자", "#우화"],
    color: "bg-stone-700",
  },
  {
    id: 11,
    title: "햄릿",
    author: "윌리엄 셰익스피어",
    tags: ["#비극", "#고뇌"],
    color: "bg-violet-900",
  },
  {
    id: 12,
    title: "프랑켄슈타인",
    author: "메리 셸리",
    tags: ["#SF", "#창조"],
    color: "bg-teal-900",
  },
];

export const KOREAN_LIT_STORIES: Story[] = [
  {
    id: "k-1",
    title: "소나기",
    author: "황순원",
    tags: ["#순수", "#첫사랑"],
    color: "bg-violet-900",
    desc: "소년과 소녀의 짧고 슬픈 사랑 이야기",
  },
  {
    id: "k-2",
    title: "날개",
    author: "이상",
    tags: ["#모더니즘", "#자아"],
    color: "bg-stone-800",
    desc: "박제가 되어버린 천재를 아시오?",
  },
  {
    id: "k-3",
    title: "운수 좋은 날",
    author: "현진건",
    tags: ["#사실주의", "#비극"],
    color: "bg-slate-700",
    desc: "설렁탕을 사왔는데 왜 먹지를 못하니",
  },
  {
    id: "k-4",
    title: "광장",
    author: "최인훈",
    tags: ["#이념", "#분단"],
    color: "bg-blue-900",
    desc: "남한과 북한, 그리고 중립국",
  },
];

export const CREATIVE_STORIES: Story[] = [
  {
    id: "c-1",
    title: "사이버펑크 서울 2077",
    author: "User123",
    tags: ["#SF", "#창작"],
    color: "bg-purple-900",
    desc: "네온사인이 꺼지지 않는 미래의 서울.",
  },
  {
    id: "c-2",
    title: "환생했더니 슬라임?",
    author: "Writer_K",
    tags: ["#판타지", "#이세계"],
    color: "bg-emerald-800",
    desc: "눈을 떠보니 숲속의 슬라임이 되어 있었다.",
  },
  {
    id: "c-3",
    title: "나의 AI 여자친구",
    author: "TechLover",
    tags: ["#로맨스", "#AI"],
    color: "bg-pink-900",
    desc: "완벽한 이상형을 프로그래밍했다.",
  },
  {
    id: "c-4",
    title: "조선 좀비 실록",
    author: "Historian",
    tags: ["#대체역사", "#호러"],
    color: "bg-stone-800",
    desc: "한양 한복판에 나타난 괴물들.",
  },
];

export const RANKING_STORIES: Story[] = [
  {
    id: 1,
    title: "오만과 편견",
    author: "제인 오스틴",
    tags: ["#로맨스", "#고전"],
    color: "bg-rose-900",
    characters: WORLD_LIT_STORIES[1].characters,
  },
  {
    id: 2,
    title: "셜록 홈즈: 주홍색 연구",
    author: "아서 코난 도일",
    tags: ["#추리", "#탐정"],
    color: "bg-stone-800",
  },
  {
    id: 3,
    title: "데미안",
    author: "헤르만 헤세",
    tags: ["#성장", "#자아"],
    color: "bg-stone-900",
  },
  {
    id: 4,
    title: "위대한 개츠비",
    author: "F. 스콧 피츠제럴드",
    tags: ["#미국문학", "#사랑"],
    color: "bg-emerald-900",
    characters: GATSBY_CHARS,
  },
  {
    id: 5,
    title: "지킬 박사와 하이드 씨",
    author: "로버트 스티븐슨",
    tags: ["#스릴러", "#인격"],
    color: "bg-purple-900",
  },
  {
    id: 6,
    title: "프랑켄슈타인",
    author: "메리 셸리",
    tags: ["#SF", "#공포"],
    color: "bg-slate-800",
  },
  {
    id: 7,
    title: "오페라의 유령",
    author: "가스통 르루",
    tags: ["#음악", "#비극"],
    color: "bg-red-950",
  },
  {
    id: 8,
    title: "젊은 베르테르의 슬픔",
    author: "괴테",
    tags: ["#짝사랑", "#서간체"],
    color: "bg-yellow-900",
  },
  {
    id: 9,
    title: "레 미제라블",
    author: "빅토르 위고",
    tags: ["#혁명", "#구원"],
    color: "bg-blue-900",
  },
  {
    id: 10,
    title: "작은 아씨들",
    author: "루이자 메이 올콧",
    tags: ["#가족", "#성장"],
    color: "bg-orange-900",
  },
];

export const CHAT_LIST_MOCK = [
  ...HERO_SLIDES.map((s) => ({ ...s, id: `h-\${s.id}`, title: s.storyTitle, active: false })), // Changed title map to use storyTitle
  ...RISING_CREATORS.map((c) => ({
    ...c,
    id: `r-\${c.id}`,
    character: c.name,
    firstMessage: `반가워요, \${c.title}의 작가 \${c.name}입니다.`,
    active: false,
  })),
];
