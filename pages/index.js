import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [jobInput, setJobInput] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeInput, setResumeInput] = useState("");
  const [yourName, setYourName] = useState("");
  const [alsoInclude, setAlsoInclude] = useState("");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobInput: jobInput,
          companyName: companyName,
          jobTitle: jobTitle,
          resumeInput: resumeInput,
          yourName: yourName,
          alsoInclude: alsoInclude,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setIsLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  }

  let firstLine = "";
  let newText = "";

  if (result) {
    const parts = result.split(/[.:-]/);
    firstLine = parts[0];

    newText = result.split(/[:]/).join("\n");
  }

  return (
    <div>
      <Head>
        <title>OpenAI cover letter generator</title>
        <link rel="icon" href="/icons8-file-48.png" />
      </Head>

      <main className={styles.main}>
        <div className={styles.topArea}>
          <img src="/icons8-file-48.png" className={styles.icon} />
          <h3>OpenAI Cover Letter Generator</h3>
          <p>
            Tip: If you need to paste longer descriptions, try using{" "}
            <a href="https://chat.openai.com">chat.openai.com</a>
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles.inputArea}>
            <div className={styles.jobInputWrapper}>
              <div className={styles.descriptors}>Company Name: </div>
              <div className={styles.inputBox}>
                <input
                  className={styles.inputStyle}
                  type="text"
                  name="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className={styles.descriptors}>Job Title: </div>
              <div className={styles.inputBox}>
                <input
                  className={styles.inputStyle}
                  type="text"
                  name="job-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className={styles.descriptors}>
                Job description (max length: 512 characters):{" "}
              </div>
              <div className={styles.inputBox}>
                <textarea
                  className={styles.textArea}
                  rows="6"
                  type="text"
                  name="job-input"
                  maxLength="512"
                  value={jobInput}
                  onChange={(e) => setJobInput(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.resumeInputWrapper}>
              <div className={styles.descriptors}>Your Name: </div>
              <div className={styles.inputBox}>
                <input
                  className={styles.inputStyle}
                  type="text"
                  name="your-name"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                />
              </div>
              <div className={styles.descriptors}>
                Paste a short summary of your experience (max 512 characters):{" "}
              </div>
              <div className={styles.inputBox}>
                <textarea
                  className={styles.textArea}
                  rows="6"
                  type="text"
                  name="resume-input"
                  maxLength="512"
                  value={resumeInput}
                  onChange={(e) => setResumeInput(e.target.value)}
                />
              </div>
              <div className={styles.descriptors}>
                Enter any extra information you'd like included:{" "}
              </div>
              <div className={styles.inputBox}>
                <textarea
                  className={styles.textArea}
                  rows="3"
                  type="text"
                  name="also-include"
                  value={alsoInclude}
                  onChange={(e) => setAlsoInclude(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles.submitButtonWrapper}>
            <input type="submit" value="Generate cover letter" />
          </div>
        </form>
        {isLoading && (
          <div className={styles.loading}>Creating cover letter...</div>
        )}
        {result && <pre className={styles.result}>{newText}</pre>}

        <div className={styles.hireMe}>
          Created by Shana Russell with the OpenAI API.{" "}
          <a href="http://shanarusselldev.com">Hire Me.</a>
        </div>
      </main>
    </div>
  );
}
