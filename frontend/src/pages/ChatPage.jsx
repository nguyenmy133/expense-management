import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';

export default function ChatPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        try {
            const response = await chatAPI.getHistory({ page: 0, size: 50 });
            const history = response.data.data.content || [];
            const formattedMessages = history.reverse().flatMap(chat => [
                { role: 'user', content: chat.message, timestamp: chat.createdAt },
                { role: 'assistant', content: chat.response, timestamp: chat.createdAt }
            ]);
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatAPI.send({ message: input });
            const aiMessage = {
                role: 'assistant',
                content: response.data.data.response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) return;
        try {
            await chatAPI.clearHistory();
            setMessages([]);
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    const suggestedQuestions = [
        'Làm sao để tiết kiệm hiệu quả?',
        'Tôi nên phân bổ ngân sách như thế nào?',
        'Cách quản lý chi tiêu hàng ngày?',
        'Lời khuyên về đầu tư cho người mới'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 flex flex-col transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 transition-colors duration-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Chatbot</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Trợ lý tài chính thông minh</p>
                            </div>
                        </div>
                        {messages.length > 0 && (
                            <button onClick={handleClearHistory} className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                                Xóa lịch sử
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Xin chào! 👋</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Tôi là trợ lý tài chính AI. Hãy hỏi tôi bất cứ điều gì!</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInput(question)}
                                        className="card text-left hover:shadow-lg transition-shadow group dark:hover:bg-gray-800/80"
                                    >
                                        <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#079DD9] dark:group-hover:text-[#079DD9] transition-colors">{question}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'gradient-primary text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                        <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-[#079DD9] rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-[#079DD9] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-[#079DD9] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-lg p-4 transition-colors duration-200">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn..."
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#079DD9] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="gradient-primary text-white px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
