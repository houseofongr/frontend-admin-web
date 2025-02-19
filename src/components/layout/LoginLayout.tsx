import React from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-center relative h-full w-full  my-10">
      <section className="flex-center h-full">{children}</section>
    </div>
  );
}
