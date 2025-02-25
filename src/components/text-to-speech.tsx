"use client"
import { useState } from 'react';

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const synthesizeSpeech = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/polly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Assuming the backend returns JSON when errors.
                throw new Error(errorData.message || 'Request failed');
            }

            // Audio stream process
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);

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
                placeholder="Enter the text to be converted."
                rows={5}
            />

            <button
                onClick={synthesizeSpeech}
                disabled={isLoading || !text.trim()}
            >
                {isLoading ? 'Generating...' : 'Generate Speech'}
            </button>

            {audioUrl && (
                <audio controls autoPlay key={audioUrl}>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support audio playback
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