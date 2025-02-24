import type { NextPage } from 'next';
import TextToSpeech from '@/components/text-to-speech';

const Home: NextPage = () => {
  return (
    <div>
      <h1>AWS Polly 文字转语音</h1>
      <TextToSpeech />
    </div>
  );
};

export default Home;