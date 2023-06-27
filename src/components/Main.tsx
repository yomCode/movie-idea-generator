import React from "react";
import loadingIcon from "../asset/loading.svg";
import movieBoss from "../asset/movieboss.png";
import sendButton from "../asset/send-btn-icon.png";
import Process from "../env";

interface FormElements extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

interface IdeaDescription extends HTMLFormElement {
  readonly elements: FormElements;
}

const Main = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<string>("");

  const apiKey = Process?.env?.REACT_APP_API_KEY;
  const url = Process?.env?.REACT_APP_URL;

  const fetchTextCompletion = async (text: string) => {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: text,
        max_tokens: 60,
        temperature: 0.9,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log({ data });
        setResponse(data.choices[0].text.trim());
      });
  };

  const handleSend = (e: React.FormEvent<IdeaDescription>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.text?.value;
    console.log(text);
    setLoading(true);
    fetchTextCompletion(text);
    setLoading(false);
    e.currentTarget.elements.text.value = "";
  };

  return (
    <main>
      {/* <!-- The Setup -->	 */}
      <section id="setup-container">
        <div className="setup-inner">
          <img src={movieBoss} />
          <div className="speech-bubble-ai" id="speech-bubble-ai">
            {!loading && !response?.length ? (
              <p id="movie-boss-text">
                Give me a one-sentence concept and I'll give you an eye-catching
                title, a synopsis the studios will love, a movie poster... AND
                choose the cast!
              </p>
            ) : !loading && response?.length ? (
              <p>{response}</p>
            ) : (
              <p id="movie-boss-text">
                Ok, just wait a second while my digital brain digests that...
              </p>
            )}
          </div>
        </div>
        {/* <div className="setup-inner setup-input-container"> */}
        {!loading ? (
          <form
            id="setup-input-container"
            onSubmit={handleSend}
            className="setup-inner setup-input-container"
          >
            <textarea
              name="text"
              id="setup-textarea"
              placeholder="An evil genius wants to take over the world using AI."
            />
            <button className="send-btn" id="send-btn" aria-label="send">
              <img src={sendButton} alt="send" />
            </button>
          </form>
        ) : (
          <div className="setup-inner setup-input-container">
            <img
              src={loadingIcon}
              alt="loading"
              className="loading"
              id="loading"
            />
          </div>
        )}
        {/* </div> */}
      </section>
      {/* <!-- The Output -->	 */}
      <section className="output-container" id="output-container">
        <div id="output-img-container" className="output-img-container"></div>
        <h1 id="output-title"></h1>
        <h2 id="output-stars"></h2>
        <p id="output-text"></p>
      </section>
    </main>
  );
};

export default Main;
