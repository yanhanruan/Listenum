import Image from "next/image";

export default function Illustration() {
  return (
    <Image
      src="/images/studying.png"
      alt="Illustration of a person wearing headphones"
      width={400}
      height={300}
      className="rounded-lg"
    />
  );
}
