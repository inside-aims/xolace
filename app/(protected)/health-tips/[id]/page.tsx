import { notFound } from 'next/navigation';
import { HealthTipDetailsCard } from '@/components/shared/HealthTips';
import { Button } from '@/components/ui/button';
import { healthTips } from "@/app/(protected)/health-tips/(overview)/health-tips";
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import Link from 'next/link';
import {MoveLeft} from "lucide-react";
import React from "react";
import { Preview } from '@/components/editor/Preview';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HealthTipDetailsPage({ params }: Props) {
  const { id } = await params;
  const tip = healthTips.find((tip) => tip.id === id);

  if (!tip) return notFound();

  return (
    <HealthTipsWrapper>
      <div className="flex w-full flex-col px-4 items-start gap-4">
        <div>
          <Link href={"/health-tips"} className={"flex flex-row"}>
            <Button
              variant="outline"
              size="sm"
              className={"rounded-full"}
            >
              <span className={"me-1"}>
                <MoveLeft size={20}/>
              </span>
              Back to tips
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <HealthTipDetailsCard
            id={tip.id}
            title={tip.title}
            author={tip.author}
            date={tip.date}
            content={tip.content}
          />
          {typeof tip.content === "string" && (
            <Preview content={tip.content} />
          )}
        </div>
      </div>
    </HealthTipsWrapper>
  );
}
