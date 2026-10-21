import React, { useEffect, useRef, useState } from 'react';
import { FiX, FiHelpCircle, FiFlag, FiEye, FiCheck } from 'react-icons/fi';
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdLink,
    MdImage,
} from 'react-icons/md';

const BRAND = '#E8161F'; // red used for buttons / accents
const INDIGO = '#3B3FBF'; // modal title + question accent

/* ----------------------------- Fake data ----------------------------- */
// TODO: replace with real API data
const INITIAL_QUESTIONS = [
    {
        id: 1,
        subject: 'Unable to export analytics report',
        question:
            "I've been trying to export the Analytics report but I couldn't. Please Give me a solution",
        time: '2 hours ago',
        status: 'pending',
        answer: '',
    },
    {
        id: 2,
        subject: 'Unable to export analytics report',
        question:
            "I've been trying to export the Analytics report but I couldn't. Please Give me a solution",
        time: '2 hours ago',
        status: 'pending',
        answer: '',
    },
    {
        id: 3,
        subject: 'Unable to export analytics report',
        question:
            "I've been trying to export the Analytics report but I couldn't. Please Give me a solution",
        time: '2 hours ago',
        status: 'pending',
        answer: '',
    },
    {
        id: 4,
        subject: 'Unable to export analytics report',
        question:
            "I've been trying to export the Analytics report but I couldn't. Please Give me a solution",
        time: '2 hours ago',
        status: 'answered',
        answer:
            'To export analytics data, please try to refresh your browser and then find out "Export data" from your dashboard and click to the button.',
    },
    {
        id: 5,
        subject: 'Unable to export analytics report',
        question:
            "I've been trying to export the Analytics report but I couldn't. Please Give me a solution",
        time: '2 hours ago',
        status: 'answered',
        answer:
            'To export analytics data, please try to refresh your browser and then find out "Export data" from your dashboard and click to the button.',
    },
];

/* --------------------------- Small components --------------------------- */

const QuestionIcon = () => (
    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
        <FiHelpCircle className="w-3.5 h-3.5" />
    </div>
);

const QuestionRow = ({ item, onAnswer, onView }) => (
    <div className="flex items-start gap-3 py-3">
        <QuestionIcon />
        <div className="min-w-0">
            <h3 className="text-[13px] font-semibold text-slate-800">{item.subject}</h3>
            <p className="text-xs italic text-gray-500 truncate max-w-[520px]">
                &ldquo;{item.question}&rdquo;
            </p>
            <p className="text-[10px] font-semibold text-slate-700 mt-1">{item.time}</p>

            <div className="flex items-center gap-2 mt-3">
                {item.status === 'pending' ? (
                    <button
                        type="button"
                        onClick={() => onAnswer(item.id)}
                        style={{ backgroundColor: BRAND }}
                        className="inline-flex items-center gap-1.5 text-white text-xs font-medium px-3 py-1.5 rounded hover:opacity-90 transition"
                    >
                        <FiFlag className="w-3 h-3" />
                        Answer
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-1.5 bg-gray-400 text-white text-xs font-medium px-3 py-1.5 rounded cursor-not-allowed"
                        >
                            <FiFlag className="w-3 h-3" />
                            Answered
                        </button>
                        <button
                            type="button"
                            onClick={() => onView(item.id)}
                            style={{ borderColor: BRAND }}
                            className="inline-flex items-center gap-1.5 bg-white border text-slate-700 text-xs font-medium px-3 py-1.5 rounded hover:bg-red-50 transition"
                        >
                            <FiEye className="w-3.5 h-3.5" />
                            View Message
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
);

const SectionCard = ({ title, children, empty }) => (
    <section className="bg-white rounded-lg shadow-sm border border-gray-100 mb-5">
        <h2 className="text-base font-semibold text-slate-800 px-4 py-4 border-b border-gray-100">
            {title}
        </h2>
        <div className="px-4 py-2 divide-y divide-transparent">
            {React.Children.count(children) > 0 ? (
                children
            ) : (
                <p className="text-center text-xs text-gray-400 py-8">{empty}</p>
            )}
        </div>
    </section>
);

/* ------------------------------ Modal shell ------------------------------ */

const ModalShell = ({ title, onClose, children }) => {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-[420px] mt-10 shadow-xl"
            >
                <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                    <h3 className="text-sm font-medium" style={{ color: INDIGO }}>
                        {title}
                    </h3>
                </div>
                <div className="px-5 py-6">{children}</div>
            </div>
        </div>
    );
};

const OriginalQuestion = ({ text }) => (
    <>
        <div className="flex items-center gap-2 mb-3">
            <span
                className="w-4 h-4 rounded-sm text-white flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: INDIGO }}
            >
                ?
            </span>
            <h4 className="text-xs font-medium text-slate-800">Original Consultant Question</h4>
        </div>
        <div
            className="bg-gray-100 text-[11px] italic text-gray-600 px-4 py-3 border-l-2"
            style={{ borderColor: INDIGO }}
        >
            &ldquo;{text}&rdquo;
        </div>
    </>
);

/* ------------------------------ Rich editor ------------------------------ */

const ToolbarButton = ({ onClick, label, children }) => (
    <button
        type="button"
        aria-label={label}
        title={label}
        // mousedown + preventDefault keeps the text selection inside the editor
        onMouseDown={(e) => {
            e.preventDefault();
            onClick();
        }}
        className="p-1 rounded text-gray-600 hover:bg-gray-200 transition"
    >
        {children}
    </button>
);

const RichTextEditor = ({ onChange }) => {
    const ref = useRef(null);

    const exec = (cmd, value = null) => {
        ref.current?.focus();
        document.execCommand(cmd, false, value);
        onChange(ref.current.innerHTML);
    };

    const addLink = () => {
        const url = window.prompt('Enter link URL');
        if (url) exec('createLink', url);
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL');
        if (url) exec('insertImage', url);
    };

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
                <ToolbarButton label="Bold" onClick={() => exec('bold')}>
                    <MdFormatBold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton label="Italic" onClick={() => exec('italic')}>
                    <MdFormatItalic className="w-4 h-4" />
                </ToolbarButton>
                <span className="w-px h-4 bg-gray-300 mx-1" />
                <ToolbarButton label="Bulleted list" onClick={() => exec('insertUnorderedList')}>
                    <MdFormatListBulleted className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton label="Numbered list" onClick={() => exec('insertOrderedList')}>
                    <MdFormatListNumbered className="w-4 h-4" />
                </ToolbarButton>
                <span className="w-px h-4 bg-gray-300 mx-1" />
                <ToolbarButton label="Insert link" onClick={addLink}>
                    <MdLink className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton label="Insert image" onClick={addImage}>
                    <MdImage className="w-4 h-4" />
                </ToolbarButton>
            </div>

            <div
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                data-placeholder="Provide a detailed answer for the knowledge base..."
                onInput={() => onChange(ref.current.innerHTML)}
                className="min-h-[150px] max-h-[260px] overflow-y-auto px-4 py-3 text-xs text-slate-700 outline-none
                   [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full
                   empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
            />
        </div>
    );
};

/* ------------------------------- Modals ------------------------------- */

const AnswerModal = ({ question, onClose, onPublish }) => {
    const [html, setHtml] = useState('');

    // strip tags to check that the answer isn't empty
    const isEmpty = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim() === '' && !html.includes('<img');

    return (
        <ModalShell title="Answer & Publish Question" onClose={onClose}>
            <OriginalQuestion text={question.question} />

            <label className="block text-[11px] font-medium text-slate-800 mt-5 mb-1">
                Answer Content
            </label>
            <RichTextEditor onChange={setHtml} />

            <div className="flex justify-end mt-5">
                <button
                    type="button"
                    disabled={isEmpty}
                    onClick={() => onPublish(question.id, html)}
                    style={{ backgroundColor: BRAND }}
                    className="inline-flex items-center gap-2 text-white text-xs font-medium px-6 py-2.5 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Publish &amp; Notify
                </button>
            </div>
        </ModalShell>
    );
};

const ViewModal = ({ question, onClose }) => (
    <ModalShell title="Answer & Publish Question" onClose={onClose}>
        <OriginalQuestion text={question.question} />

        <p className="text-[11px] font-medium text-slate-800 mt-5 mb-2">Answer Content</p>
        <div
            className="bg-gray-100 text-[11px] italic text-gray-600 px-4 py-3 border-l-2
                 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full"
            style={{ borderColor: BRAND }}
            // NOTE: sanitize this HTML (e.g. DOMPurify) before rendering in production
            dangerouslySetInnerHTML={{ __html: question.answer }}
        />

        <div className="flex justify-end mt-6">
            <button
                type="button"
                onClick={onClose}
                style={{ backgroundColor: BRAND }}
                className="text-white text-xs font-medium px-6 py-2.5 rounded hover:opacity-90 transition"
            >
                Back to Support
            </button>
        </div>
    </ModalShell>
);

/* ------------------------------- Main page ------------------------------- */

const SupportInbox = () => {
    const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
    const [modal, setModal] = useState(null); // { mode: 'answer' | 'view', id }
    const [toast, setToast] = useState('');

    const pending = questions.filter((q) => q.status === 'pending');
    const answered = questions.filter((q) => q.status === 'answered');
    const activeQuestion = modal ? questions.find((q) => q.id === modal.id) : null;

    const closeModal = () => setModal(null);

    const handlePublish = (id, answerHtml) => {
        // TODO: call API here (publish answer + notify the user)
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status: 'answered', answer: answerHtml } : q))
        );
        setModal(null);
        setToast('Answer published and user notified.');
        setTimeout(() => setToast(''), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] px-6 py-5 text-slate-800 font-sans">
            <div className="max-w-3xl">
                <p className="text-[9px] font-semibold tracking-widest text-gray-500 uppercase">Inbox</p>
                <h1 className="text-2xl font-semibold text-slate-900 mt-1">Support requests</h1>
                <p className="text-[11px] text-gray-500 mt-1 mb-5">
                    Every contact-form message, prioritized and kept out of live chat noise.
                </p>

                <SectionCard title="Pending Community Questions" empty="No pending questions.">
                    {pending.map((item) => (
                        <QuestionRow
                            key={item.id}
                            item={item}
                            onAnswer={(id) => setModal({ mode: 'answer', id })}
                        />
                    ))}
                </SectionCard>

                <SectionCard title="Answered Community Questions" empty="No answered questions yet.">
                    {answered.map((item) => (
                        <QuestionRow
                            key={item.id}
                            item={item}
                            onView={(id) => setModal({ mode: 'view', id })}
                        />
                    ))}
                </SectionCard>
            </div>

            {activeQuestion && modal.mode === 'answer' && (
                <AnswerModal question={activeQuestion} onClose={closeModal} onPublish={handlePublish} />
            )}
            {activeQuestion && modal.mode === 'view' && (
                <ViewModal question={activeQuestion} onClose={closeModal} />
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-lg">
                    <FiCheck className="w-4 h-4 text-green-400" />
                    {toast}
                </div>
            )}
        </div>
    );
};

export default SupportInbox;