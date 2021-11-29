import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";
import NewsCards from "./components/NewsCards/NewsCards";
import Modal from "./components/Modal/Modal";
import useStyles from "./styles";

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: "76929673c6339d4144c1edff5e31c30e2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "instructions") {
          setIsOpen(true);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText("Please try that again...");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          } else {
            alanBtn().playText("Please try that again...");
          }
        }
      },
    });
  }, []);

  return (
    <>
      <div>
        <div className={classes.logoContainer}>
          {newsArticles.length ? (
            <div className={classes.infoContainer}>
              <div className={classes.card}>
                <Typography variant="h5" component="h2">
                  Try saying: <br />
                  <br />
                  Open article number [4]
                </Typography>
              </div>
              <div className={classes.card}>
                <Typography variant="h5" component="h2">
                  Try saying: <br />
                  <br />
                  Go back
                </Typography>
              </div>
            </div>
          ) : null}
          <img
            src="https://www.conversationdesigninstitute.com/assets/images/academy/POP/cover-card-EXT-Alan@2x.png"
            className={classes.alanLogo}
          />
        </div>
        <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
        {!newsArticles.length ? (
          <div className={classes.footer}>
            <Typography variant="body1" component="h2">
              &copy; {new Date().getFullYear()} Created by
              <a
                className={classes.link}
                target="_blank"
                href="https://www.linkedin.com/in/dipesh-patil-060b73207/"
              >
                {" "}
                Dipesh Patil
              </a>{" "}
              -
              <a
                className={classes.link}
                target="_blank"
                href="http://dprivys.herokuapp.com"
              >
                {" "}
                Dprivys
              </a>
            </Typography>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default App;
