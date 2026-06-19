import "./App.css";
import prismjs from "prismjs";
import Markdown from "react-markdown";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect, useState } from "react";
import "prismjs/components/prism-javascript";
import "highlight.js/styles/github-dark.css";
import rehypeHighlight from "rehype-highlight";
import * as EditorModule from "react-simple-code-editor";

const Editor = EditorModule.default.default;

function App() {
  const [code, setCode] = useState("Paste your code here...");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prismjs.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim() || isLoading) return; // Prevent empty or duplicate requests

    setReview(""); // clear previous output
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/get-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        },
      );

      // 🔥 Check for HTTP errors before trying to read the stream
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Streaming not supported by the browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setReview((prev) => prev + chunk); // 🔥 live UI update
      }
    } catch (error) {
      console.error("Review Fetch Error:", error);
      setReview(
        `> ⚠️ **Error:** Failed to fetch code review. Please try again later.\n\n\`${error.message}\``,
      );
    } finally {
      setIsLoading(false); // Reset button state when done or failed
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prismjs.highlight(
                  code,
                  prismjs.languages.javascript,
                  "javascript",
                )
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          {/* 🔥 Update UI to reflect loading state */}
          <div
            onClick={reviewCode}
            className="review"
            style={{
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Reviewing..." : "Review"}
          </div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>

      <footer>
        <p>
          v1.0 is built with ❤️ by Mayur. Feedback, ideas, and bug reports are
          always welcome. Please leave a ⭐ Star on{" "}
          <a
            href="https://github.com/MayurDange15/AI.Code.Reviewer"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
