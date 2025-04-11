// components/layouts/MainContainerWrapper.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const MainContainerWrapper = ({ children, className }: Props) => {
  if (className === 'none') return <>{children}</>;

  return (
    <section className={className ?? 'main-container'}>
      {children}
    </section>
  );
};

export default MainContainerWrapper;
