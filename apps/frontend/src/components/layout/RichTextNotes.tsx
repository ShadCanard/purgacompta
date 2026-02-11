import React, { useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
	MenuButtonAlignCenter,
	MenuButtonAlignJustify,
	MenuButtonAlignLeft,
	MenuButtonAlignRight,
	MenuButtonBold,
	MenuButtonBulletedList,
	MenuButtonHorizontalRule,
	MenuButtonItalic,
	MenuButtonOrderedList,
	MenuButtonRedo,
	MenuButtonTaskList,
	MenuButtonUnderline,
	MenuButtonUndo,
	MenuControlsContainer,
	MenuDivider,
	MenuSelectFontSize,
	MenuSelectHeading,
	RichTextEditor,
	RichTextEditorRef,
} from "mui-tiptap";
interface RichTextNotesProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextNotes: React.FC<RichTextNotesProps> = ({ value, onChange }) => {

  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <RichTextEditor
      sx={{ minHeight: '400px' }}
      ref={rteRef}
      extensions={[StarterKit, TextStyleKit, TextAlign, Typography, BulletList, OrderedList, TaskList, TaskItem]}
      content={value}
      immediatelyRender={false}
      onBlur={({ editor }) => onChange(editor.getHTML())}
      onClick={() => rteRef.current?.focus()}
      renderControls={() => (
        <MenuControlsContainer>
          <MenuButtonUndo />
          <MenuButtonRedo />
          <MenuDivider />
          <MenuSelectFontSize  />
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuButtonUnderline />
          <MenuDivider />
          <MenuButtonAlignLeft />
          <MenuButtonAlignCenter />
          <MenuButtonAlignRight />
          <MenuButtonAlignJustify />
          <MenuDivider />
          <MenuButtonHorizontalRule />
          <MenuDivider />
          <MenuButtonBulletedList />
          <MenuButtonTaskList />
          <MenuButtonOrderedList />
        </MenuControlsContainer>
      )}
    />
  );
};

export default RichTextNotes;
