import "./App.css";
// import axios from "axios";
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

  useEffect(() => {
    prismjs.highlightAll();
  }, []);

  // async function reviewCode() {
  //   const response = await axios.post("http://localhost:3000/ai/get-response", {
  //     code,
  //   });
  //   setReview(response.data);
  // }
  async function reviewCode() {
    setReview(""); // clear previous output

    const response = await fetch("http://localhost:3000/ai/get-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.body) {
      console.error("Streaming not supported");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      result += chunk;

      setReview((prev) => prev + chunk); // 🔥 live UI update
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
          <div onClick={reviewCode} className="review">
            Review
          </div>
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
