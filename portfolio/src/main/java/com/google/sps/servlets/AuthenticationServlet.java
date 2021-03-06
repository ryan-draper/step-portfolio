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

import com.google.appengine.api.datastore.*;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/login")
public class AuthenticationServlet extends HttpServlet{
  
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    UserService userService = UserServiceFactory.getUserService();
    
    // If user is not logged in, show a login form (could also redirect to a login page)
    if (!userService.isUserLoggedIn()) {
      String loginUrl = userService.createLoginURL("/login"); //FIX THIS LINK
      out.println("<p>Sign in <a href=\"" + loginUrl + "\">here</a>.</p>");
      return;
    }

    // If user has not set a username, redirect to username page
    String username = getUsername(userService.getCurrentUser().getUserId());
    if (username == null) {
      response.sendRedirect("/username");
      return;
    }

    // User is logged in and has a username, so the request can proceed
    String logoutUrl = userService.createLogoutURL("/index.html"); //MAYBE FIX THIS ONE TOO (was "/")
    out.println("<p>Hello, " + username + ".</p>");
    out.println("<p><a href=\"" + logoutUrl + "\">Sign Out</a></p>");
    out.println("<p>Change your username <a href=\"/username\">here</a>.</p>");
    out.println("<p>Go to <a href=\"/index.html\">main page</a>.</p>");
  }

  /** Returns the username of the user with id, or null if the user has not set a username. */
  private String getUsername(String id) {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query =
        new Query("UserInfo")
            .setFilter(new Query.FilterPredicate("id", Query.FilterOperator.EQUAL, id));
    PreparedQuery results = datastore.prepare(query);
    Entity entity = results.asSingleEntity();
    if (entity == null) {
      return null;
    }
    String username = (String) entity.getProperty("username");
    return username;
  }
}