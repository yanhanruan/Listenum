import React from "react";

type BackgroundProps = {
  children: React.ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  return <div className="min-h-screen bg-soyoYellow">{children}</div>;
}
