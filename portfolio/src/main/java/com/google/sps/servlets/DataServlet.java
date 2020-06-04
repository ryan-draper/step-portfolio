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

package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  
  private List<String> quotes;
  private List<String[]> comments = new ArrayList<>();

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String name = getParameter(request, "name-input", "");
    String content = getParameter(request, "comment-input", "");

    String[] comment = {name, content};
    comments.add(comment);

    // Respond with the result.
    for(int i = 0; i < comments.size(); i++) {
        response.setContentType("text/html;");
        response.getWriter().println(comments.get(i)[0] + ": " + comments.get(i)[1] + "<br>");
    }
  }

  /**
   * @return the request parameter, or the default value if the parameter
   *         was not specified by the client
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
  
  @Override
  public void init() {
    quotes = new ArrayList<>();
    quotes.add("\"There\'s only one thing I hate more than lying: skim milk. Which is water lying about being milk.\"");
    quotes.add("\"Just remember, every time you look up at the moon, I, too, will be looking at a moon. Not the same one, obviously. That\'s impossible.\"");
    quotes.add("\"I\'ve made a huge mistake.\"");
    quotes.add("\"There\'s always money in the banana stand.\"");
    quotes.add("\"Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.\"");
    quotes.add("\"Kids, you tried your best and you failed miserably. The lesson is never try.\"");
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Convert the quotes list to JSON
    String json = convertToJsonUsingGson(quotes);

    // Send the JSON as the response
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  /**
   * Converts a ArrayList instance into a JSON string using the Gson library. Note: We first added
   * the Gson library dependency to pom.xml.
   */
  private String convertToJsonUsingGson(List quotes) {
    Gson gson = new Gson();
    String json = gson.toJson(quotes);
    return json;
  }
}
