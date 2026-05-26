"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { BlogSection } from "@/lib/blogPosts";

type Props = {
  sections: BlogSection[];
  onChange: (sections: BlogSection[]) => void;
};

function normalizeStoredSrc(src: string) {
  return src;
}

function displaySrc(src: string) {
  return src;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function richContent(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value) ? value : escapeHtml(value);
}

function sectionsToHtml(sections: BlogSection[]) {
  return sections
    .map((section) => {
      const image = section.image?.src
        ? `<figure><img src="${escapeHtml(section.image.src)}" alt="${escapeHtml(section.image.alt)}">${
            section.image.caption ? `<figcaption>${escapeHtml(section.image.caption)}</figcaption>` : ""
          }</figure>`
        : "";
      const body = section.body.map((paragraph) => `<p>${richContent(paragraph)}</p>`).join("");
      const bullets = section.bullets?.length
        ? `<ul>${section.bullets.map((bullet) => `<li>${richContent(bullet)}</li>`).join("")}</ul>`
        : "";
      const quote = section.quote ? `<blockquote>${richContent(section.quote)}</blockquote>` : "";

      return `<h2>${escapeHtml(section.heading)}</h2>${image}${body}${bullets}${quote}`;
    })
    .join("");
}

function htmlToSections(html: string): BlogSection[] {
  if (typeof document === "undefined") {
    return [];
  }

  const root = document.createElement("div");
  root.innerHTML = html;
  const sections: BlogSection[] = [];
  let current: BlogSection | null = null;

  function ensureSection() {
    if (!current) {
      current = { heading: "Main answer", body: [], bullets: [], quote: "" };
      sections.push(current);
    }
    return current;
  }

  Array.from(root.children).forEach((node) => {
    const tag = node.tagName.toLowerCase();

    if (tag === "h2" || tag === "h3") {
      current = {
        heading: node.textContent?.trim() || "Untitled section",
        body: [],
        bullets: [],
        quote: "",
      };
      sections.push(current);
      return;
    }

    const section = ensureSection();

    if (tag === "p") {
      const nodeHtml = node.innerHTML.trim();
      if (nodeHtml && nodeHtml !== "<br>") {
        section.body.push(nodeHtml);
      }
      return;
    }

    if (tag === "figure") {
      const img = node.querySelector("img");
      if (img) {
        section.image = {
          src: normalizeStoredSrc(img.getAttribute("src") ?? ""),
          alt: img.getAttribute("alt") || section.heading,
          caption: node.querySelector("figcaption")?.textContent?.trim() ?? "",
        };
      }
      return;
    }

    if (tag === "img") {
      const imgEl = node as HTMLImageElement;
      section.image = {
        src: normalizeStoredSrc(imgEl.getAttribute("src") ?? ""),
        alt: imgEl.getAttribute("alt") || section.heading,
        caption: section.image?.caption ?? "",
      };
      return;
    }

    if (tag === "ul" || tag === "ol") {
      section.bullets = Array.from(node.querySelectorAll("li"))
        .map((item) => item.innerHTML.trim())
        .filter(Boolean);
      return;
    }

    if (tag === "blockquote") {
      section.quote = node.innerHTML.trim();
      return;
    }
  });

  return sections.filter(
    (section) =>
      section.heading &&
      (section.body.length || section.image?.src || section.bullets?.length || section.quote)
  );
}

function ToolbarButton({
  active,
  children,
  onClick,
  title,
}: {
  active?: boolean;
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-[#b38124] text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const insertImage = useCallback(() => {
    const url = window.prompt(
      "Image URL",
      "https://images.pexels.com/photos/..."
    );
    if (!url) {
      return;
    }

    const alt =
      window.prompt("Image alt text", "Prosperity Klub financial guide image") ?? "";
    editor.chain().focus().setImage({ src: displaySrc(url), alt }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-3 py-2">
      <ToolbarButton
        title="Paragraph"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>
      <ToolbarButton
        title="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        List
      </ToolbarButton>
      <ToolbarButton
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Quote
      </ToolbarButton>
      <ToolbarButton
        title="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const href = window.prompt(
            "Link URL",
            editor.getAttributes("link").href ?? ""
          );
          if (!href) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().setLink({ href }).run();
        }}
      >
        Link
      </ToolbarButton>
      <ToolbarButton title="Image" onClick={insertImage}>
        Image
      </ToolbarButton>
    </div>
  );
}

export default function PkCmsRichArticleEditor({ sections, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isSyncing = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "Write the full article here..." }),
    ],
    content: sectionsToHtml(sections),
    onUpdate({ editor: ed }) {
      if (isSyncing.current) {
        return;
      }
      onChange(htmlToSections(ed.getHTML()));
    },
    editorProps: {
      attributes: {
        class:
          "pk-rich-editor min-h-[520px] bg-white p-6 text-slate-950 outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextHtml = sectionsToHtml(sections);
    if (nextHtml === editor.getHTML()) {
      return;
    }

    isSyncing.current = true;
    editor.commands.setContent(nextHtml, { emitUpdate: false });
    window.requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  }, [editor, sections]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={
        expanded
          ? "fixed inset-0 z-[90] flex flex-col bg-white"
          : "overflow-hidden rounded-xl border border-slate-200 bg-white"
      }
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50">
        <Toolbar editor={editor} />
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mr-3 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <div
        className={
          expanded ? "flex-1 overflow-y-auto" : "max-h-[720px] overflow-y-auto"
        }
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
