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

var map;
var lovettMarker;

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

/** Creates a map and adds it to the page. */
function createMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 29.7174, lng: -95.4018},
    zoom: 18,
    mapTypeId: 'hybrid',
    // dark mode theme styling:
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });
  
  // creates 'fly over' view effect
  map.setTilt(45);

  var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Lovett College</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Lovett College</b> is indisputably the best residential college at Rice University. '+ 
    'Named after Rice University\'s first president, Edgar Odell Lovett College opened in 1968. '+
    'Its concrete grating and brutalist architecture has led many to compare it to a giant toaster. '+
    'Lovett College is known for having outstanding commons culture, meaning that people tend to '+
    'congregate and socialize in its common area.</p>'+
    '<p>You can learn more about Lovett <a target="_blank" rel="noopener noreferrer" href="https://lovettcollege.github.io/lovettcollege/">' +
    'here</a>.</p>'+
    '</div>'+
    '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var lovett = {lat: 29.7163, lng: -95.3980};

  var lovettMarker = new google.maps.Marker({
    position: lovett,
    map: map,
    title: 'Lovett College'
  });

  lovettMarker.addListener('click', function() {
    infowindow.open(map, lovettMarker);
  });
}

function toggleBounce() {
  if (lovettMarker.getAnimation() !== null) {
    lovettMarker.setAnimation(null);
  } else {
    lovettMarker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

window.addEventListener('load', (event) => {
  displayCommentForm();
  loadComments();
  const quoteButton = document.getElementById("random-quote");
  quoteButton.addEventListener("click", addRandomQuote, false);
  const commentsButton = document.getElementById("number-comments");
  commentsButton.addEventListener("change", updateComments, false);
  createMap();
});
