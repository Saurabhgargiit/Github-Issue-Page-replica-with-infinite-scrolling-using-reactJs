import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

//icons
const bullet = (
  <svg
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
    <path
      fillRule="evenodd"
      d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
    ></path>
  </svg>
);

const commentIcon = (
  <svg
    aria-hidden="true"
    height="16"
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    data-view-component="true"
    className="octicon-comment v-align-middle"
  >
    <path
      fillRule="evenodd"
      d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"
    ></path>
  </svg>
);

//helper function
const days = (dateInfo) => {
  const today = new Date();
  const dateCreated = new Date(dateInfo);
  const number = today.getDate() - dateCreated.getDate();
  if (number === 1) return "yesterday";
  else if (number === 0)
    return `${today.getHours() - dateCreated.getHours()} hours ago`;
  else if (number < 30) return `${number} days ago`;
  else return `${dateCreated.getMonth()} ${dateCreated.getDate()}`;
};

export default function App() {
  const [issues, setIssues] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const scrollHandler = () => {
    if (
      document.documentElement.clientHeight +
        document.documentElement.scrollTop >=
      document.documentElement.scrollHeight
    ) {
      console.log(2);
      setLoading(true);
      let page = pageNo + 1;
      axios
        .get(`https://api.github.com/repos/facebook/react/issues?page=${page}`)
        .then((res) => {
          setIssues((prevState) => {
            return [...prevState, ...res.data];
          });
          setLoading(false);
          setPageNo(page);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/facebook/react/issues?page=1`)
      .then((res) => {
        setIssues(() => res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [issues]);

  const renderingArr =
    issues.length > 0 &&
    issues.map((el) => {
      return (
        <div className="container container-border">
          <div className="container bullet">{bullet}</div>
          <div className="container midbox p-2">
            <div className="midbox-links">
              <a
                id={`issue-${el.number}-link`}
                className="Link--primary v-align-middle no-underline h4 js-navigation-open markdown-title"
                href={`https://github.com/facebook/react/issues/${el.number}`}
              >
                {el.title}
              </a>
              {el.labels.length > 0 &&
                el.labels.map((label) => {
                  return (
                    <span className="lh-default d-block d-md-inline">
                      <a
                        id={`label-${label.id}`}
                        href="https://github.com/facebook/react/issues?q=is%3Aissue+is%3Aopen+label%3A%22Component%3A+Developer+Tools%22"
                        className="IssueLabel no-underline d-md-inline"
                        style={{
                          backgroundColor: "#" + label.color,
                          color: `${
                            label.color === "b60205" || label.color === "9149d1"
                              ? "#fff"
                              : "#24292f"
                          }`,
                        }}
                      >
                        {label.name}
                      </a>
                    </span>
                  );
                })}
            </div>
            <div className="d-flex mt-1 text-small color-fg-muted">
              {`#${el.number} opened ${days(el.updated_at)} by ${
                el.user.login
              }`}
            </div>
          </div>
          <div className="container comment">
            <div className="container comment box">
              {el.comments ? (
                <a
                  href={`https://github.com/facebook/react/issues/${el.number}`}
                  className="Link--muted no-underline"
                >
                  {commentIcon}
                  <span className="text-small text-bold ">{el.comments}</span>
                </a>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    });

  return (
    <>
      <div className="heading-container">
        <h4 className="heading">
          Github issue page replica - Infinite scrolling implemented
        </h4>
      </div>
      {issues.length !== 0 && <div className="app">{renderingArr}</div>}
      {loading && <div className="loading">Loading....</div>}
    </>
  );
}
