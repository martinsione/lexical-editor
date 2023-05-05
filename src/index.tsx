import * as React from "react";
import { type EditorState, type LexicalEditor } from "lexical";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";

// Custom plugins
import { ClickableLinkPlugin } from "./plugins/clickable-link-plugin";
import { FloatingLinkEditorPlugin } from "./plugins/floating-link-editor-plugin";
import { FloatingTextFormatToolbarPlugin } from "./plugins/floating-text-format-toolbar-plugin";
import { ListMaxIndentLevelPlugin } from "./plugins/list-max-indent-plugin";
import { LoadInitialStateAsyncPlugin } from "./plugins/load-initial-state-async-plugin";
import { ChangeEditableState } from "./plugins/change-editable-state";

type Props = {
  defaultValue?: string;
  editable?: boolean;
  namespace: string;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
};

export const Editor = (props: Props) => {
  const { namespace, editable, defaultValue, onChange } = props;
  const initialConfig = React.useMemo(
    () =>
      ({
        namespace: namespace,
        editable: editable,
        editorState: null,
        nodes: [
          AutoLinkNode,
          CodeHighlightNode,
          CodeNode,
          HeadingNode,
          LinkNode,
          ListItemNode,
          ListNode,
          QuoteNode,
        ],
        theme: {
          link: "cursor-pointer text-blue-500 no-underline hover:underline",
        },
        onError: (error, _editor) => {
          throw error;
        },
      } as InitialConfigType),
    [namespace, editable]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative dark:selection:bg-neutral-700">
        {/* @lexical/react plugins */}
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable className="prose dark:prose-invert min-h-[150px] resize-none rounded border p-4 outline-none transition duration-150 dark:border-neutral-800 dark:focus:border-neutral-700" />
          }
          placeholder={
            <p className="pointer-events-none absolute top-4 left-4 select-none leading-8 dark:text-neutral-500">
              Start typing...
            </p>
          }
        />
        <AutoLinkPlugin
          matchers={[
            (text) => {
              const URL_MATCHER =
                /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
              const match = URL_MATCHER.exec(text);
              if (match === null) return null;

              return {
                index: match.index,
                length: match[0].length,
                text: match[0],
                url: match[0].startsWith("http")
                  ? match[0]
                  : `https://${match[0]}`,
              };
            },
            (text) => {
              const EMAIL_MATCHER =
                /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
              const match = EMAIL_MATCHER.exec(text);
              if (match === null) return null;

              return {
                index: match.index,
                length: match[0].length,
                text: match[0],
                url: `mailto:${match[0]}`,
              };
            },
          ]}
        />
        <AutoFocusPlugin />
        <HistoryPlugin />
        <LinkPlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <OnChangePlugin onChange={onChange} />

        {/* @lexical/markdown plugins */}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

        {/* Custom plugins */}
        {editable ? <ClickableLinkPlugin newTab={true} /> : null}
        <ChangeEditableState editable={editable} />
        <FloatingLinkEditorPlugin />
        <FloatingTextFormatToolbarPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <LoadInitialStateAsyncPlugin defaultValue={defaultValue} />
      </div>
    </LexicalComposer>
  );
};
