import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function LoadInitialStateAsyncPlugin(props: { defaultValue?: string }) {
  const { defaultValue } = props;
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (!defaultValue) return;

    if (isFirstRender) {
      try {
        setIsFirstRender(false);
        editor.setEditorState(editor.parseEditorState(defaultValue));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error setting initial state", error.message);
        }
      }
    }
  }, [defaultValue, editor, isFirstRender]);

  return null;
}
