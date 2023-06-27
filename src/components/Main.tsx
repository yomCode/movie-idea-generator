import React from "react";
import loadingIcon from "../asset/loading.svg";
import movieBoss from "../asset/movieboss.png";
import sendButton from "../asset/send-btn-icon.png";
import Process from "../env";
import { Configuration, OpenAIApi } from "openai";

interface FormElements extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

interface IdeaDescription extends HTMLFormElement {
  readonly elements: FormElements;
}

const Main = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<string>("");
  const [synopsis, setSynopsis] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");

  const apiKey = Process?.env?.REACT_APP_API_KEY;
  //   const url = Process?.env?.REACT_APP_URL;

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const fetchTextCompletion = async (text: string) => {
    try {
      setLoading(true);
      const response: any = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
                ###
                outline: Two dogs fall in love and move to Hawaii to learn to surf.
                message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
                ###
                outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
                message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
                ###
                outline: A group of corrupt lawyers try to send an innocent woman to jail.
                message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
                ###
                outline: ${text}
                message: 
                `,
        max_tokens: 60,
      });
      setResponse(response?.data?.choices[0]?.text?.trim());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSynopsis = async (text: string) => {
    try {
      const response: any = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline
                ###
                outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
                synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. 
                When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, 
                especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention 
                of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, 
                but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the 
                tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
                ###
                outline: ${text}
                synopsis: 
                `,
        max_tokens: 700,
      });
      setSynopsis(response?.data?.choices[0]?.text?.trim());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTitle = async (synopsis: string) => {
    try {
      const response: any = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate an engaging, professional and marketable movie title based on a synopsis
                    ###
                    outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
                    title: Top Gun
                    ###
                    outline: ${synopsis}
                    title: 
                    `,
        max_tokens: 25,
        temperature: 0.7,
      });
      setTitle(response?.data?.choices[0]?.text?.trim());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = (e: React.FormEvent<IdeaDescription>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.text?.value;
    fetchTextCompletion(text);
    fetchSynopsis(text);
    fetchTitle(synopsis);
    e.currentTarget.elements.text.value = "";
  };

  console.log({ loading });
  console.log({ response, synopsis });

  return (
    <main>
      {/* <!-- The Setup -->	 */}
      {!synopsis?.length && (
        <section id="setup-container">
          <div className="setup-inner">
            <img src={movieBoss} alt="" />
            <div className="speech-bubble-ai" id="speech-bubble-ai">
              {!loading && !response?.length ? (
                <p id="movie-boss-text">
                  Give me a one-sentence concept and I'll give you an
                  eye-catching title, a synopsis the studios will love, a movie
                  poster... AND choose the cast!
                </p>
              ) : response?.length ? (
                <p>{!synopsis ? response : synopsis}</p>
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
      )}
      {/* <!-- The Output -->	 */}
      {synopsis?.length && (
        <section className="output-container" id="output-container">
          <div id="output-img-container" className="output-img-container"></div>
          <h1 id="output-title">{title}</h1>
          <h2 id="output-stars">{}</h2>
          <p id="output-text">{synopsis}</p>
        </section>
      )}
    </main>
  );
};

export default Main;
