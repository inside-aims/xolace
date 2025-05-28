import { Code } from "bright";
import { cn } from "@/lib/utils";
import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";
import { readingTime } from "reading-time-estimator";
import { plugins } from '@/utils/mdx';
import { components } from "@/mdxComponents";
import ErrorComponent from "../../components/shared/ErrorComponent";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export const Preview = ({ content, className }: { content: string; className?: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

    const options: MDXRemoteOptions = {
      disableImports: true, // import statements in MDX don't work in pages router
      parseFrontmatter: true,
      scope: {
        readingTime: readingTime(content, 100).text,
        props: { foo: "props in scope is working" },
      },
      vfileDataIntoScope: "toc", // the "remark-flexible-toc" plugin produces vfile.data.toc
      mdxOptions: {
        format: "md",
        ...plugins,
        //remarkRehypeOptions: format === "md" ? remarkRehypeOptions : undefined,
      },
    };

  return (
    <section className={cn("markdown prose grid break-words max-sm:pb-5", className)}>
      <MDXRemote
        source={formattedContent}
        components={components}
        options={options}
        onError={ErrorComponent}
      />
    </section>
  );
};