// app/survey/page.tsx
// Next.js + Tailwind, 프리토타입 설문 UI (배경 이미지 영역 포함, API POST 전송 준비)

'use client'
import { useState } from 'react'
import Head from 'next/head'

type SurveyOption = { id: string; label: string }
export type SurveyQuestion = {
    id: string
    title: string
    subtitle?: string
    options: SurveyOption[]
    required?: boolean
    maxSelect?: number
    allowOther?: boolean
}

type PretotypeSurveyProps = {
    questions: SurveyQuestion[]
}

const cn = (...cls: (string | false | undefined)[]) => cls.filter(Boolean).join(' ')

/** Intro 화면 */
/** Intro 화면 */
function Intro({ email, setEmail, onNext }: { email: string; setEmail: (v: string) => void; onNext: () => void }) {
    // 간단 이메일 정규식 벨리데이션
    const isValidEmail = (email: string) => /^[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email.trim())
    const disabled = !isValidEmail(email)

    return (
        <div className="space-y-8 text-center animate-fadeIn">
            {/* 아이콘 영역 */}
            <div className="flex justify-center">
                <img src="/logo.ico" alt="서비스 아이콘" className="w-20 h-20 mb-4 rounded-3xl" />
            </div>

            <p className="text-lg leading-relaxed whitespace-pre-line text-neutral-100">
                {`우리는 40~50대 여성분들을 위한\n마음챙김 서비스를 기획중이에요.\n\n선생님이 느끼는\n외로움, 불안, 우울감을\n우리와 공유해주신다면 추첨을 통해\n커피 쿠폰 1장을 보내드려요.`}
            </p>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해 주세요"
                className="w-full rounded-2xl px-5 py-3 text-lg shadow-md
                   placeholder:text-cyan-300 placeholder:text-center text-neutral-50 text-center
                   focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button
                onClick={onNext}
                disabled={disabled}
                className={cn(
                    'w-full rounded-2xl py-3 font-bold text-lg tracking-wide shadow-lg transition text-white',
                    disabled
                        ? 'bg-green-300 '
                        : 'bg-green-600 hover:bg-green-500'
                )}
            >
                시작하기
            </button>
        </div>
    )
}


/** 질문 화면 */
function QuestionStep({
                          question,
                          selected,
                          other,
                          toggle,
                          setOther,
                          onPrev,
                          onNext,
                      }: {
    question: SurveyQuestion
    selected: string[]
    other: string
    toggle: (optId: string) => void
    setOther: (text: string) => void
    onPrev: () => void
    onNext: () => void
}) {
    const disabled = question.required && selected.length === 0 && !other.trim()

    return (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-center leading-snug whitespace-pre-line">{question.title}</h2>
            {question.subtitle && (
                <p className="text-lg text-center text-neutral-300 whitespace-pre-line">{question.subtitle}</p>
            )}

            <div className="grid gap-4">
                {question.options.map(opt => (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggle(opt.id)}
                        className={cn(
                            'rounded-2xl px-6 py-4 text-lg border transition text-left shadow-sm',
                            selected.includes(opt.id)
                                ? 'bg-white text-black border-white shadow-md'
                                : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {question.allowOther && (
                <input
                    type="text"
                    placeholder="기타 의견"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    className="w-full rounded-2xl px-5 py-3 text-black text-lg shadow-md
                     placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            )}

            <div className="flex justify-between pt-4">
                <button
                    onClick={onPrev}
                    className="px-6 py-3 rounded-2xl bg-neutral-700 text-lg hover:bg-neutral-600 transition"
                >
                    이전
                </button>
                <button
                    onClick={onNext}
                    disabled={disabled}
                    className={cn(
                        'px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg transition text-white',
                        disabled
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500'
                    )}
                >
                    다음
                </button>
            </div>
        </div>
    )
}

/** 완료 화면 */
function Thanks() {
    return (
        <div className="text-center space-y-6 animate-fadeIn">
            <p className="text-2xl font-bold">답변이 기록되었습니다.</p>
            <p className="text-neutral-300 text-lg">참여해 주셔서 감사합니다.</p>
        </div>
    )
}

export default function Page() {
    const questions: SurveyQuestion[] = [
        {
            id: 'needs',
            title: '현재 마음챙김이 필요하다고 느끼는 주요 이유는 무엇인가요?',
            subtitle: '중복 선택 가능',
            required: true,
            options: [
                { id: 'health',   label: '건강/불면' },
                { id: 'family',   label: '가족/관계' },
                { id: 'work',     label: '경제/일' },
                { id: 'meaning',  label: '삶의 의미/자아실현' },
                { id: 'anxiety',  label: '막연한 불안/우울감' },
            ],
            allowOther: true,
        },
        {
            id: 'format',
            title: '마음챙김 서비스를 어떤 형태로 받고 싶으신가요?',
            subtitle: '중복 선택 가능',
            required: true,
            options: [
                { id: 'ai_chat',       label: 'AI 상담 (언제든 간단하게 대화 가능)' },
                { id: 'expert_counsel',label: '전문가 상담 (심리상담사/코치와 1:1)' },
                { id: 'group',         label: '소규모 그룹 활동 (비슷한 상황의 여성들과 함께)' },
                { id: 'community',     label: '온라인 커뮤니티 (익명/비밀 대화 및 경험 공유)' },
                { id: 'record',        label: '콘텐츠 기록학습 (영상, 오디오, 글 등으로 배우기)' },
                { id: 'offline',       label: '오프라인 치유 프로그램 (요가, 명상, 아트테라피 등)' },
                { id: 'individual',    label: '맞춤형 루틴 프로그램 (개인 상태에 따라 매번 실천할 것)' },
            ],
        },
        {
            id: 'content',
            title: '어떤 콘텐츠가 가장 도움이 될 것 같으신가요?',
            subtitle: '중복 선택 가능',
            required: true,
            options: [
                { id: 'guide',     label: '명상/호흡법 오디오 가이드' },
                { id: 'journal',   label: '감사 일기/감정 기록 도구' },
                { id: 'asmr',      label: '치유 음악/ASMR/자연 소리' },
                { id: 'stories',   label: '실제 사례/스토리텔링 콘텐츠' },
                { id: 'expert',    label: '전문가 강의/라이브 Q&A' },
                { id: 'program',   label: '특정 기분/증상 맞춤형 힐링 프로그램' },
            ],
        },
    ]


    return <PretotypeSurvey questions={questions} />
}

function PretotypeSurvey({ questions }: PretotypeSurveyProps) {
    const [step, setStep] = useState<'intro' | number | 'thanks'>('intro')
    const [email, setEmail] = useState('')
    const [answers, setAnswers] = useState<Record<string, string[]>>({})
    const [others, setOthers] = useState<Record<string, string>>({})

    const current = typeof step === 'number' ? questions[step] : null

    const toggle = (qid: string, optId: string) => {
        setAnswers(prev => {
            const curr = new Set(prev[qid] ?? [])
            curr.has(optId) ? curr.delete(optId) : curr.add(optId)
            return { ...prev, [qid]: Array.from(curr) }
        })
    }

    const goNext = async () => {
        if (step === 'intro') {
            setStep(0)
        } else if (typeof step === 'number' && step < questions.length - 1) {
            setStep(step + 1)
        } else if (typeof step === 'number' && step === questions.length - 1) {
            setStep('thanks')
            const payload = {
                email,
                reason_mindfulness: (answers['needs'] ?? []).join(', ') || '',
                preferred_service_format: (answers['format'] ?? []).join(', ') || '',
                preferred_content_type: (answers['content'] ?? []).join(', ') || '',
            }
            try {
                await fetch('/api/survey', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            } catch (e) {
                console.error('설문 제출 실패:', e)
            }
        }
    }

    const goPrev = () => {
        if (typeof step === 'number' && step > 0) setStep(step - 1)
        else if (step === 0) setStep('intro')
    }

    return (
        <>
            <Head>
                {/* 라이트/다크 모드 무시하고 항상 검정색 배경 */}
                <meta name="color-scheme" content="only dark" />
                {/* 모바일 브라우저 상단 바 색상도 강제 검정 */}
                <meta name="theme-color" content="#000000" />
            </Head>
            <div
                className="min-h-dvh bg-black text-white flex items-center justify-center p-6 bg-cover bg-center"
                style={{ backgroundImage: `url('/bg.png')` }}
            >
                <div className="max-w-md w-full bg-black/60 rounded-3xl p-8 shadow-2xl">
                    {step === 'intro' && <Intro email={email} setEmail={setEmail} onNext={goNext} />}

                    {typeof step === 'number' && current && (
                        <QuestionStep
                            question={current}
                            selected={answers[current.id] ?? []}
                            other={others[current.id] ?? ''}
                            toggle={(id) => toggle(current.id, id)}
                            setOther={(txt) => setOthers(prev => ({ ...prev, [current.id]: txt }))}
                            onPrev={goPrev}
                            onNext={goNext}
                        />
                    )}

                    {step === 'thanks' && <Thanks />}
                </div>
            </div>
        </>
    )
}
