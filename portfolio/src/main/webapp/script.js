// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/** Determines whether to display the comment form based on login status. */
function displayCommentForm() {
  // check login page to see if the message indicates that the user is logged in
  fetch('/login').then(response => response.text()).then((message) => {
    console.log("message: " + message.trim());
    if (message.trim().includes("Hello")) {
      // if logged in, hide login button and show comment form
      document.getElementById("login-section").style.display = "none";
      var paragraph = document.getElementById("username");
      var text = document.createTextNode(message.substring(10,message.indexOf(".")));
      paragraph.appendChild(text);
    } else {
      // if not logged in, hide comment form and username info so only login button shows
      document.getElementById("username-info").style.display = "none";
      document.getElementById("comment-form").style.display = "none";
    }
  });
}

/** Fetches comments from the server and adds them to the DOM. */
function loadComments() {
  // loads 5 comments by default
  fetch('/data?number-comments=5').then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    var numComments = 5;
    var i = 0;
    comments.forEach((comment) => {
      if (i < numComments) {
        commentListElement.appendChild(createCommentElement(comment));
        i++;
      }
    })
  });
}

/** Updates number of comments shown based on drop-down menu. */
function updateComments() {
  // clear out old comments
  document.getElementById("comment-list").innerHTML = "";
  // reads in selection from drop-down menu for number of comments
  var numComments = document.getElementById("number-comments").value;
  fetch('/data?number-comments=' + numComments.toString()).then(response => response.json()).then((comments) => {
    const commentListElement = document.getElementById('comment-list');
    var i = 0;
    comments.forEach((comment) => {
      if (i < numComments) {
        commentListElement.appendChild(createCommentElement(comment));
        i++;
      }
    })
  });
}

/** Creates an element that represents a comment. */
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'list-group-item';

  const usernameElement = document.createElement('span');
  usernameElement.className = "comment-username";
  usernameElement.innerText = comment.username;

  const dateElement = document.createElement('span');
  dateElement.className = "comment-date";
  dateElement.innerText = comment.date;

  const firstLine = document.createElement('div');
  firstLine.className = "username-and-date";
  firstLine.appendChild(usernameElement);
  firstLine.appendChild(dateElement);

  const contentElement = document.createElement('span');
  contentElement.className = "comment-content";
  contentElement.innerText = comment.content;

  commentElement.appendChild(firstLine);
  commentElement.appendChild(contentElement);
  return commentElement;
}

/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

/**
 * Adds a random quote to the page.
 */
function addRandomQuote() {
  const quotes =
      ['\"There\'s only one thing I hate more than lying: skim milk. Which is water lying about being milk.\" - Ron Swanson', 
      '\"Just remember, every time you look up at the moon, I, too, will be looking at a moon. Not the same one, obviously. That\'s impossible.\" - Andy Dwyer',
      '\"I\'ve made a huge mistake.\" - Gob Bluth', '\"There\'s always money in the banana stand.\" - George Bluth',
      '\"Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.\" - Michael Scott',
       '\"Kids, you tried your best and you failed miserably. The lesson is never try.\" - Homer Simpson'];

  // Pick a random quote.
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}

window.addEventListener('load', (event) => {
  displayCommentForm();
  loadComments();
  const quoteButton = document.getElementById("random-quote");
  quoteButton.addEventListener("click", addRandomQuote, false);
  const commentsButton = document.getElementById("number-comments");
  commentsButton.addEventListener("change", updateComments, false);
});
