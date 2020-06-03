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

/**
 * Adds a random quote to the page using fetch() to request content from the server.
 */
function getRandomQuoteUsingArrowFunctions() {
  fetch('/data').then(response => response.text()).then((quote) => {
    console.log('Adding quote to dom: ' + quote);
    document.getElementById('quote-container').innerText = quote;
  });
}

