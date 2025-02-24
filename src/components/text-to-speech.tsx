"use client"
import { useState } from 'react';

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const synthesizeSpeech = async () => {
        setIsLoading(true);
        try {
            // FIXME 404 Not Found
            const response = await fetch('/services/polly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) throw new Error('Request failed');

            const { url } = await response.json();
            setAudioUrl(url);
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating speech');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入要转换的文本"
                rows={5}
            />

            <button
                onClick={synthesizeSpeech}
                disabled={isLoading || !text.trim()}
            >
                {isLoading ? '生成中...' : '生成语音'}
            </button>

            {audioUrl && (
                <audio controls autoPlay key={audioUrl}>
                    <source src={audioUrl} type="audio/mpeg" />
                    您的浏览器不支持音频播放
                </audio>
            )}

            <style jsx>{`
        .container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }
        textarea {
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.5rem;
        }
        button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default TextToSpeech;