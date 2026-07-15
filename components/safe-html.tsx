import DOMPurify from "isomorphic-dompurify";

interface SafeHtmlProps {
  html: string | null | undefined;
  className?: string;
}

/**
 * Renders user/admin-authored HTML (rich-text content) after sanitizing it with
 * DOMPurify. Use this instead of a raw `dangerouslySetInnerHTML` so stored XSS
 * (e.g. <script>, onerror=) is stripped before it reaches the DOM.
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  const clean = DOMPurify.sanitize(html || "");
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
