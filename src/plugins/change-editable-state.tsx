import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function ChangeEditableState(props: { editable?: boolean }) {
  const { editable } = props;
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (typeof editable === "undefined") return;
    editor.setEditable(editable);
  }, [editable, editor]);

  return null;
}
