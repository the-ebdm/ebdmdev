import html from '@kitajs/html'

const escapeHtml = (unsafe: string) => unsafe
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

interface RichTextBlock {
  type: string;
  text: {
    content: string;
    link: null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: null;
}

export const RichText = ({ text }: { text: RichTextBlock }) => {
  const output = escapeHtml(text.plain_text);
  if (text.annotations.strikethrough) {
    return <span class="line-through">{output}</span>;
  }

  if (text.annotations.bold) {
    return <span class="font-bold">{output}</span>;
  }

  if (text.annotations.italic) {
    return <span class="italic">{output}</span>;
  }

  if (text.text.link) {
    return (
      <a href={text.text.link} class="text-gray-600 hover:text-gray-900" target="_blank">
        {output}
      </a>
    );
  }

  if (text.annotations.code) {
    return <span class="code">{output}</span>;
  }

  return output;
};

export const MassRichText = ({ text, className = "inline" }: { text: RichTextBlock[], className?: string }) => {
  return (
    <p class={className}>{text.map(text => RichText({ text })).join('')}</p>
  )
};