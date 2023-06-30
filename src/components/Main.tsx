import React from "react";
import loadingIcon from "../asset/loading.svg";
import movieBoss from "../asset/movieboss.png";
import sendButton from "../asset/send-btn-icon.png";
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
  const [cast, setCast] = React.useState<string>("");
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [showPitch, setShowPitch] = React.useState<boolean>(false);

  const apiKey = process.env.REACT_APP_API_KEY;

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
        prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. 
                The synopsis should include actors names in brackets after each character. 
                Choose actors that would be ideal for this role.
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
      const synopsis = response?.data?.choices[0]?.text?.trim();
      fetchCast(synopsis);
      fetchTitle(synopsis);
      setSynopsis(synopsis);
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

  const fetchCast = async (synopsis: string) => {
    try {
      const response: any = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Extract the names in brackets from the synopsis.
                ###
                synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
                names: Tom Cruise, Val Kilmer, Kelly McGillis
                ###
                synopsis: ${synopsis}
                names:   
                `,
        max_tokens: 30,
      });
      setCast(response?.data?.choices[0]?.text?.trim());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const generateImagePrompt = async (title: string, synopsis: string) => {
    try {
      const response: any = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
                ###
                title: Love's Time Warp
                synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. 
                As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of 
                a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have 
                far-reaching consequences that reverberate through the ages.
                image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the 
                dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
                ###
                title: zero Earth
                synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over 
                the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to 
                destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
                image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
                ###
                title: ${title}
                synopsis: ${synopsis}
                image description:
                `,
        max_tokens: 100,
        temperature: 0.8,
      });
      const imagePrompt = response?.data?.choices[0]?.text?.trim();
      fetchImageUrl(imagePrompt);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImageUrl = async (imagePrompt: string) => {
    try {
      const response: any = await openai.createImage({
        prompt: `${imagePrompt}. There should be no text on this image and also be mindful of the character gender to appear on the image`,
        n: 1,
        size: "256x256",
        response_format: "b64_json",
      });
      setImageUrl(response.data.data[0].b64_json);
      imageUrl?.length > 0 && setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = (e: React.FormEvent<IdeaDescription>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.text?.value;
    fetchTextCompletion(text);
    fetchSynopsis(text);
    generateImagePrompt(title, synopsis);
    e.currentTarget.elements.text.value = "";
  };

  return (
    <main>
      {/* <!-- The Setup -->	 */}
      {!showPitch && (
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
                <p>{response}</p>
              ) : (
                <p id="movie-boss-text">
                  Ok, just wait a second while my digital brain digests that...
                </p>
              )}
            </div>
          </div>
          {/* <div className="setup-inner setup-input-container"> */}
          {!loading && !imageUrl.length ? (
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
          ) : !loading && imageUrl.length ? (
            <div className="setup-inner setup-input-container">
              <button onClick={() => setShowPitch(!showPitch)}>
                View Pitch
              </button>
            </div>
          ) : (
            <div className="setup-inner setup-input-container">
              <img
                src={loadingIcon}
                alt="loading"
                className="loading"
                id="loading"
              />

              {/* In an evil world where the rich feeds on the poor masses to survive. The freedom of the poor masses rest on the shoulder of a young boy */}
              {/* <button onClick={() => setShowPitch(!showPitch)}>
                View Pitch
              </button> */}
            </div>
          )}
          {/* </div> */}
        </section>
      )}
      {/* <!-- The Output -->	 */}
      {showPitch && (
        <section className="output-container" id="output-container">
          <div id="output-img-container" className="output-img-container">
            <img src={`data:image/png;base64,${imageUrl}`} alt="" />
          </div>
          <h1 id="output-title">{title}</h1>
          <h2 id="output-stars">{cast}</h2>
          <p id="output-text">{synopsis}</p>
        </section>
      )}
    </main>
  );
};

export default Main;
