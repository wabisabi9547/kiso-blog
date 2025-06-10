---
title: "React Wizard와 Portal: 복잡함을 숨기는 아름다운 거짓말"
date: "2025-04-27"
category: "tech"
tags: ["React", "Wizard", "Portal", "UX", "Complexity", "Reality"]
excerpt: "단계별 폼과 모달이 이렇게 복잡할 줄 몰랐다. 3년간 대규모 React 애플리케이션에서 Wizard와 Portal 패턴을 구현해본 뼈아픈 경험담. 겉보기엔 우아하지만 속은 지옥인 패턴들의 진실을 파헤친다."
author: "KISO"
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/The_future_%28Unsplash%29.jpg/1599px-The_future_%28Unsplash%29.jpg?20170831100448"
---

# React Wizard와 Portal: 복잡함을 숨기는 아름다운 거짓말

"단계별 폼 같은 건 Wizard 패턴으로 쉽게 만들 수 있어요!"
"모달은 Portal 쓰면 간단하죠!"

React 개발자들이 흔히 하는 말이다. 온라인 튜토리얼을 보면 정말 간단해 보인다. 몇 줄의 코드로 우아한 단계별 폼이 완성되고, createPortal 한 줄로 완벽한 모달이 만들어진다.

하지만 정말 그럴까? 3년간 이커머스, 온보딩, 설문조사 시스템 등에서 수십 개의 Wizard와 Portal을 구현해본 결과, 한 가지 확실한 사실을 깨달았다. **이 패턴들은 데모에서는 우아하지만, 실제로는 복잡성의 덩어리다.**

## Wizard 패턴: 단순함의 환상

### 튜토리얼 vs 현실

온라인 튜토리얼의 Wizard는 참 아름답다. 3단계 정도의 간단한 폼에 Previous/Next 버튼이 있고, 상태 관리도 useState 몇 개면 충분해 보인다.

```typescript
// 튜토리얼에서 보는 "간단한" Wizard
const [currentStep, setCurrentStep] = useState(0)
const [formData, setFormData] = useState({})

const nextStep = () => setCurrentStep(prev => prev + 1)
const prevStep = () => setCurrentStep(prev => prev - 1)
```

하지만 실제 프로덕션에서는? 20단계가 넘는 온보딩 플로우, 조건부 단계, 동적 검증, 서버 연동, 진행률 저장, 뒤로가기 처리... 갑자기 "간단한" Wizard가 몇천 줄의 괴물이 된다.

### 상태 관리의 지옥

가장 큰 문제는 상태 관리다. 단순한 useState로 시작했다가 금세 한계에 부딪힌다.

**현실에서 마주치는 상태들:**
- 각 단계별 폼 데이터
- 검증 상태와 에러 메시지
- 로딩 상태 (각 단계마다 다른 API 호출)
- 조건부 단계 표시 여부
- 진행률과 완료 상태
- 서버에서 받아온 기존 데이터
- 임시 저장 상태

```typescript
// 현실의 Wizard 상태
interface WizardState {
  currentStep: number
  totalSteps: number
  formData: Record<string, any>
  validationErrors: Record<string, string[]>
  loadingStates: Record<string, boolean>
  stepVisibility: Record<string, boolean>
  serverData: any
  isDirty: boolean
  lastSavedStep: number
  // ... 그리고 계속해서 추가되는 상태들
}
```

### 검증의 악몽

단계별 검증이 정말 까다롭다. 언제 검증할 것인가? 어떻게 에러를 표시할 것인가?

**검증 시점의 딜레마:**
- 실시간 검증: 사용자 경험을 해치고 성능 문제 야기
- Next 버튼 클릭시: 사용자가 모든 필드를 작성한 후에야 에러 발견
- 포커스 아웃시: 가장 자연스럽지만 구현이 복잡

더 복잡한 것은 **크로스 스텝 검증**이다. 3단계에서 입력한 값이 1단계 값과 일치해야 한다면? 전체 폼 데이터를 항상 동기화하고 검증해야 한다.

### 네비게이션의 함정

브라우저 뒤로가기 버튼을 누르면 어떻게 될까? 대부분의 Wizard 구현에서는 전체 페이지가 벗어나버린다. 사용자가 20단계 중 19단계까지 와서 실수로 뒤로가기를 누르면? 모든 데이터가 날아간다.

**URL 동기화 문제:**
```typescript
// URL과 Wizard 상태를 동기화하려면...
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const stepFromUrl = params.get('step')
  if (stepFromUrl && isValidStep(stepFromUrl)) {
    setCurrentStep(parseInt(stepFromUrl))
  }
}, [])

useEffect(() => {
  const url = new URL(window.location.href)
  url.searchParams.set('step', currentStep.toString())
  window.history.replaceState({}, '', url)
}, [currentStep])
```

하지만 이것만으로는 부족하다. 새로고침하면? 페이지를 벗어났다가 다시 오면? 각 단계의 데이터는 어떻게 복원할 것인가?

## Portal 패턴: DOM의 탈출구가 주는 착각

### createPortal의 단순한 매력

React Portal은 정말 우아해 보인다. DOM 계층구조를 벗어나 원하는 곳에 컴포넌트를 렌더링할 수 있다. 모달, 툴팁, 드롭다운에 완벽해 보인다.

```typescript
// 튜토리얼의 "간단한" Portal
function Modal({ children, isOpen }) {
  if (!isOpen) return null
  
  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.body
  )
}
```

보기에는 완벽하다. 하지만 실제로 사용해보면?

### 이벤트 버블링의 혼란

Portal로 렌더링된 요소는 DOM 트리에서는 다른 곳에 있지만, React 이벤트 시스템에서는 여전히 부모 컴포넌트의 자식이다. 이는 예상치 못한 동작을 만든다.

```typescript
function App() {
  return (
    <div onClick={() => console.log('App clicked')}>
      <Modal isOpen={true}>
        <button onClick={() => console.log('Modal button clicked')}>
          Click me
        </button>
      </Modal>
    </div>
  )
}
```

모달의 버튼을 클릭하면 두 핸들러가 모두 실행된다. DOM 상에서는 Modal이 document.body에 있지만, React 이벤트는 여전히 App까지 버블링된다.

### 스타일링의 지옥

Portal 안의 컴포넌트는 CSS 상속을 받지 않는다. 부모 컴포넌트의 CSS 변수, 테마, 글꼴 설정 등이 적용되지 않는다.

**CSS-in-JS 라이브러리 문제:**
- Styled Components: Portal 안에서 ThemeProvider 접근 불가
- Emotion: CSS 변수 상속 문제
- Tailwind: 부모의 다크모드 클래스 상속 안됨

```typescript
// 매번 Portal 안에 Provider를 감싸야 하는 괴로움
function Modal({ children, isOpen }) {
  return createPortal(
    <ThemeProvider theme={theme}>
      <StyleProvider>
        <div className="modal-backdrop">
          {children}
        </div>
      </StyleProvider>
    </ThemeProvider>,
    document.body
  )
}
```

### 접근성의 악몽

Portal로 만든 모달의 접근성을 제대로 구현하는 것은 정말 어렵다.

**필수적으로 처리해야 할 것들:**
- Focus 관리 (모달 열릴 때 첫 번째 요소로 포커스)
- Focus Trap (Tab으로 모달 밖으로 나갈 수 없게)
- ESC 키로 닫기
- ARIA 속성 (role, aria-labelledby, aria-describedby)
- 배경 스크롤 방지
- 스크린 리더 지원

```typescript
// 실제로 접근성을 고려한 Modal은 이렇게 복잡하다
function AccessibleModal({ children, isOpen, onClose }) {
  const modalRef = useRef()
  const previousFocusRef = useRef()
  
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      modalRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      previousFocusRef.current?.focus()
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    const handleFocusTrap = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        // ... 복잡한 포커스 트랩 로직
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleFocusTrap)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleFocusTrap)
    }
  }, [onClose])
  
  // ... 그리고 더 많은 코드
}
```

## 실제 사례: 아름다운 실패들

### 사례 1: 이커머스 체크아웃 Wizard의 참사

한 이커머스 프로젝트에서 7단계 체크아웃 Wizard를 구현했다. 처음엔 순조로웠다. 기본적인 플로우는 금방 만들어졌다.

하지만 요구사항이 추가되면서 악몽이 시작됐다:
- "배송지에 따라 결제 방식이 달라져야 해요"
- "쿠폰 적용하면 이전 단계로 돌아가야 해요"
- "진행 중에 상품 재고가 없어지면 알려주세요"
- "뒤로가기 해도 데이터 유지되게 해주세요"

결국 7단계 Wizard는 2000줄이 넘는 괴물이 되었다. 상태 관리 로직만 800줄, 검증 로직 400줄, 네비게이션 처리 300줄... 

가장 큰 문제는 **예측 불가능성**이었다. 한 단계를 수정하면 다른 단계에 예상치 못한 영향을 미쳤다. 버그 수정이 새로운 버그를 만들어내는 악순환이 계속됐다.

### 사례 2: Portal 모달의 z-index 전쟁

한 대시보드 프로젝트에서 Portal을 사용한 모달들이 여러 개 겹치면서 z-index 문제가 발생했다. 

처음에는 간단했다:
```css
.modal { z-index: 1000; }
```

하지만 모달 위에 또 다른 모달이 열리고, 드롭다운이 추가되고, 툴팁이 나타나면서 z-index 전쟁이 시작됐다:

```css
.modal { z-index: 1000; }
.modal-overlay { z-index: 999; }
.dropdown { z-index: 1001; }
.tooltip { z-index: 1002; }
.context-menu { z-index: 1003; }
.toast { z-index: 1004; }
.modal-confirmation { z-index: 1005; }
```

더 심각한 것은 **컨텍스트의 상실**이었다. Portal로 렌더링된 모달들은 서로의 존재를 모르기 때문에, 여러 모달이 동시에 열릴 수 있었다. 사용자는 혼란스러워했고, 포커스 관리도 엉망이 되었다.

## 상태 관리 라이브러리와의 악몽 같은 조합

### Wizard + Redux의 지옥

Redux와 Wizard를 함께 사용하면 어떻게 될까? 이론적으로는 깔끔해 보인다. 중앙화된 상태 관리로 복잡성을 해결할 수 있을 것 같다.

하지만 현실은 달랐다:

```typescript
// Wizard 상태만을 위한 복잡한 리듀서
const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
        lastVisitedStep: Math.max(state.lastVisitedStep, action.payload)
      }
    case 'UPDATE_STEP_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.step]: {
            ...state.formData[action.step],
            ...action.payload
          }
        },
        isDirty: true
      }
    case 'VALIDATE_STEP':
      // 100줄 넘는 검증 로직...
    case 'RESET_WIZARD':
      // 초기화 로직...
    // ... 20개 이상의 액션 타입들
  }
}
```

**문제점들:**
- 액션 타입이 폭증함
- 부분 업데이트시 불필요한 리렌더링
- 시간 여행 디버깅시 Wizard 상태까지 따라감 (원치 않음)
- 서버 상태와 클라이언트 상태의 경계 모호

### Portal + Context API의 함정

Portal과 Context API를 함께 사용할 때도 예상치 못한 문제들이 발생한다.

```typescript
// 이렇게 하면 Portal 안에서 Context를 못 받는다
function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <div>
        <Modal /> {/* Portal로 document.body에 렌더링 */}
      </div>
    </ThemeContext.Provider>
  )
}

function Modal() {
  const theme = useContext(ThemeContext) // undefined!
  // Portal은 Provider 밖에서 렌더링되기 때문
}
```

해결하려면 Portal 안에서도 Provider로 감싸야 하는데, 이는 Context를 중복으로 만들거나 props drilling을 다시 해야 한다는 뜻이다.

## 성능 문제: 숨겨진 비용들

### Wizard의 메모리 누수

복잡한 Wizard는 의외로 메모리를 많이 잡아먹는다. 특히 각 단계마다 무거운 컴포넌트가 있을 때 문제가 된다.

**일반적인 실수:**
```typescript
// 모든 단계를 항상 렌더링하고 CSS로 숨김
function Wizard() {
  return (
    <div>
      <Step1 style={{ display: currentStep === 0 ? 'block' : 'none' }} />
      <Step2 style={{ display: currentStep === 1 ? 'block' : 'none' }} />
      <Step3 style={{ display: currentStep === 2 ? 'block' : 'none' }} />
      {/* 20개 단계가 모두 DOM에 존재 */}
    </div>
  )
}
```

이렇게 하면 모든 단계의 컴포넌트가 메모리에 올라가 있다. 각 단계에 차트, 이미지, 복잡한 폼이 있다면? 메모리 사용량이 기하급수적으로 증가한다.

### Portal의 렌더링 비용

Portal도 의외의 성능 비용이 있다. createPortal 자체는 빠르지만, Portal 안에서 복잡한 컴포넌트를 렌더링할 때는 다르다.

**특히 문제가 되는 경우:**
- 애니메이션이 많은 모달
- 대량의 데이터를 표시하는 드롭다운
- 실시간 업데이트되는 툴팁

Portal은 일반적인 React 렌더링 최적화 (React.memo, useMemo 등)의 혜택을 받기 어렵다. 부모 컴포넌트와 분리되어 있기 때문에 최적화 전략도 별도로 세워야 한다.

## 테스팅의 악몽

### Wizard 테스트의 복잡성

Wizard를 테스트하는 것은 정말 어렵다. 단순한 단위 테스트로는 불가능하고, 통합 테스트나 E2E 테스트가 필요하다.

```typescript
// Wizard 테스트 예시
describe('Checkout Wizard', () => {
  it('should complete full flow', async () => {
    render(<CheckoutWizard />)
    
    // Step 1: 배송 정보
    await user.type(screen.getByLabelText('주소'), '서울시...')
    await user.click(screen.getByText('다음'))
    
    // Step 2: 결제 정보
    await user.type(screen.getByLabelText('카드번호'), '1234-5678-9012-3456')
    await user.click(screen.getByText('다음'))
    
    // Step 3: 확인
    expect(screen.getByText('주문 확인')).toBeInTheDocument()
    await user.click(screen.getByText('주문하기'))
    
    // 서버 응답 대기
    await waitFor(() => {
      expect(screen.getByText('주문 완료')).toBeInTheDocument()
    })
  })
  
  // 그리고 수십 개의 엣지 케이스 테스트들...
})
```

**테스트해야 할 시나리오들:**
- 정상 플로우 완주
- 중간에 뒤로가기
- 검증 실패시 동작
- 서버 에러시 복구
- 새로고침 후 상태 복원
- 조건부 단계 표시/숨김
- 크로스 스텝 검증

각 시나리오마다 여러 단계를 거쳐야 하므로 테스트 실행 시간이 매우 길어진다.

### Portal 테스트의 함정

Portal로 렌더링된 요소를 테스트하는 것도 까다롭다. 일반적인 React Testing Library 방식으로는 찾기 어렵다.

```typescript
// Portal 컴포넌트 테스트
test('modal should render in portal', () => {
  render(<Modal isOpen={true}>Test content</Modal>)
  
  // 이렇게 하면 찾을 수 없다
  expect(screen.getByText('Test content')).toBeInTheDocument() // ❌
  
  // Portal target을 직접 지정해야 한다
  const portalContainer = document.body
  expect(within(portalContainer).getByText('Test content')).toBeInTheDocument() // ✅
})
```

더 복잡한 것은 Portal 안에서 발생하는 이벤트를 테스트하는 것이다. 이벤트 버블링, 포커스 관리, ESC 키 처리 등을 모두 테스트하려면 상당한 노력이 필요하다.

## 대안은 없을까?

### Wizard 대신 고려할 것들

복잡한 Wizard를 만들기 전에 다른 방법을 고려해보자:

**1. 단일 페이지 폼**
- 모든 필드를 한 페이지에 표시
- 진행률 표시로 사용자 가이드
- 복잡성은 줄고 사용성은 더 좋을 수 있음

**2. 조건부 필드 표시**
- 사용자 입력에 따라 동적으로 필드 추가/제거
- Wizard보다 직관적일 수 있음

**3. 별도 페이지로 분리**
- 각 단계를 완전히 독립적인 페이지로
- URL 기반 네비게이션 활용
- 상태 관리 복잡성 감소

### Portal 대신 고려할 것들

**1. Compound Components**
```typescript
// Portal 없이도 유연한 모달 구조
<Modal>
  <Modal.Header>제목</Modal.Header>
  <Modal.Content>내용</Modal.Content>
  <Modal.Actions>
    <Button>취소</Button>
    <Button>확인</Button>
  </Modal.Actions>
</Modal>
```

**2. CSS-only 모달**
- position: fixed로 충분한 경우
- Portal의 복잡성 없이도 구현 가능

**3. 전용 라이브러리 사용**
- React Modal, Reach UI, Headless UI 등
- 이미 검증된 접근성과 기능 제공

## 결론: 복잡성을 인정하고 현명하게 선택하기

Wizard와 Portal은 강력한 패턴이다. 하지만 그 강력함에는 숨겨진 복잡성이 따른다.

**Wizard를 고려하기 전에:**
- 정말 여러 단계가 필요한가?
- 상태 관리 복잡성을 감당할 수 있는가?
- 접근성과 사용성을 제대로 구현할 리소스가 있는가?

**Portal을 고려하기 전에:**
- CSS만으로도 충분하지 않은가?
- 이벤트 버블링과 스타일링 문제를 해결할 준비가 되었는가?
- 접근성을 제대로 구현할 계획이 있는가?

**가장 중요한 것은 솔직함이다.** 

튜토리얼의 아름다운 예제에 속지 말자. 실제 프로덕션에서는 모든 것이 복잡하다. 그 복잡성을 인정하고, 정말 필요할 때만 이런 패턴을 선택해야 한다.

때로는 "덜 우아한" 해결책이 더 나을 수 있다. 단순한 폼이 복잡한 Wizard보다 좋고, 기본적인 모달이 Portal 기반 모달보다 나을 수 있다.

**기술은 목적을 위한 수단이다.** 패턴 자체가 목적이 되어서는 안 된다. 사용자와 개발팀 모두에게 더 나은 선택이 무엇인지 냉정하게 판단하자. 