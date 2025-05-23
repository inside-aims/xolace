import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export const Preview = ({ content, className }: { content: string; className?: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className={cn("markdown prose grid break-words max-sm:pb-5", className)}>
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};