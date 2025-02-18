import Grid from "./components/Grid";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">3×3 九宫格</h1>
      <Grid />
    </main>
  );
}
