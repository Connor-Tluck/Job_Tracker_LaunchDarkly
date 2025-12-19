import { THEME_STORAGE_KEY } from "./theme";

/**
 * Runs before React hydration to avoid a light/dark flash.
 * It sets `.dark` on <html> based on localStorage, defaulting to light.
 */
export function ThemeScript() {
  const code = `(function(){try{var k=${JSON.stringify(
    THEME_STORAGE_KEY
  )};var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:"light";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}


