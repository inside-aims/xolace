// app/reflections/page.tsx or wherever your route is
import React from 'react';
import type { Metadata } from 'next';
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import ReflectionsClientView from "@/app/(protected)/reflections/ReflectionClientView";

export const metadata: Metadata = {
  title: 'Reflections',
  description: "Mentor-led video reflections offering perspective, support, and guidance.",
};

const ReflectionsPage = async () => {
  return (
    <HealthTipsWrapper>
      <ReflectionsClientView />
    </HealthTipsWrapper>
  );
};

export default ReflectionsPage;
