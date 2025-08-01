import { notFound } from 'next/navigation';
import { HealthTipDetailsCard } from '@/components/shared/HealthTips';
import { Button } from '@/components/ui/button';
import HealthTipsWrapper from "@/components/shared/layoutUIs/HealthTipsWrapper";
import Link from 'next/link';
import {MoveLeft} from "lucide-react";
import React from "react";
import { Preview } from '@/components/editor/Preview';
import { QueryClient } from '@tanstack/react-query'
import { getHealthTip } from '@/queries/tips/getHealthTip.action'
import { getFrontmatter } from "next-mdx-remote-client/utils";
import { Metadata } from "next";
import type { Frontmatter } from "@/types";


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const file = await getHealthTip(slug);

  if (!file) return {};

  const { frontmatter } = getFrontmatter<Frontmatter>(file.content);


  return {
    title: frontmatter.title ?? file.title,
    description: "Health tips and expert-backed advice to boost your wellness and mental health—trusted by millions worldwide."
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

interface HealthTipDetailsProps {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  author_avatar_url: string;
  content: string;
  created_at: string;
}

export default async function HealthTipDetailsPage({ params }: Props) {
  const { slug } = await params;
  const queryClient = new QueryClient()

  // Note we are now using fetchQuery()
  const healthTip: HealthTipDetailsProps = await queryClient.fetchQuery({
    queryKey: ['healthTip', slug],
    queryFn: () => getHealthTip(slug),
  })


  if (!healthTip) return notFound();

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
            id={healthTip.id}
            title={healthTip.title}
            author={healthTip.author_name}
            author_avatar_url={healthTip.author_avatar_url}
            date={healthTip.created_at}
            content={healthTip.content}
          />
          {typeof healthTip.content === "string" && (
            <Preview content={healthTip.content} />
          )}
        </div>
      </div>
    </HealthTipsWrapper>
  );
}
