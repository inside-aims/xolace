"use client";
// InitializedMDXEditor.tsx
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  tablePlugin,
  codeBlockPlugin,
  linkPlugin,
  imagePlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  linkDialogPlugin,
} from "@mdxeditor/editor";
import "./dark-editor.css";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";
import "@mdxeditor/editor/style.css";

interface EditorProps {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  fieldChange: () => void;
}

const Editor = ({ value, fieldChange, editorRef, ...props }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            js: "javascript",
            txt: "txt",
            json: "json",
            graphql: "graphql",
            md: "markdown",
            saas: "saas",
            bash: "bash",
            ts: "typescript",
            html: "html",
            tsx: "Typescript (React)",
            jsx: "Javascript (React)",
            py: "python",
            rb: "ruby",
            php: "php",
            c: "c",
            "": "unspecified",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
      markdown={value}
      onChange={fieldChange}
      className="dark:bg-bg-dark! bg-bg  light-border-2 markdown-editor dark-editor grid w-full border"
      ref={editorRef}
    />
  );
};

export default Editor;
