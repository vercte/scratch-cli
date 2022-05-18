import nav from "./nav.js";
import Chalk from "chalk";
import axios from "axios";
import rl from "readline-sync";

const theme = {
  "main": Chalk.hex("#b0f"),
  "accent": Chalk.hex("#fff"),
  "mainBold": Chalk.hex("#b0f").bold
}

global.getUser = async function(error = false) {
  console.clear()
  if(error) {
    console.log(error)
  }
  
  let userName = rl.question(theme.mainBold("User login name: "));
  let replacedUserName = userName.replace(/\s/gm, "");
  if(replacedUserName != userName) {
    console.log(`${theme.main("Note:")} Whitespace detected and removed (now ${replacedUserName})\n`);
    userName = replacedUserName
  }
  
  let userExists
  try {
    await axios.get(`https://api.scratch.mit.edu/users/${userName}`);
    userExists = true;
  } catch(e) {
    userExists = false;
  }

  if(!userExists) {
    return `${theme.mainBold("Login error: ")}${Chalk.red("User does not exist!")}\n`;
  }
  
  let userPass = rl.question(theme.mainBold("User login password: "), {
    "hideEchoBack": true,
    "mask": "\u2022"
  });

  try {
    await session.init(userName, userPass);
    return "success";
  } catch {
    return `${theme.mainBold("Login error: ")}${Chalk.red("Invalid password!")}\n`;
  }
}

global.scratchAPI = axios.create({
  "baseURL": "https://api.scratch.mit.edu/",
  "timeout": 1000,
  "headers": {"user-agent": "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:24.0) Gecko/20100101 Firefox/100.0"}
})

global.socialInfo = {
  "messages": {
    "count": 0,
    "list": []
  }
}

// pages

global.app = {
  "openPage": "home",
  "pages": {
    "home": new nav.Page("home", function() {
      let navList = new nav.NavList(
        theme.mainBold(`Logged in as user ${theme.accent(session.username)}\n\nAvaliable Actions:\n`),
        [
          {"display": `Messages (${socialInfo.messages.count})`, "func": app.pages.messages.open},
          {"display": "Settings", "func": () => null},
          {"display": "Browse", "func": app.pages.browse.open},
        ]
      )
      return navList.choose()
    }),
    "messages": new nav.Page("messages", function() {
      console.clear();
      console.log(`${theme.mainBold("You have ")}${socialInfo.messages.count}${theme.mainBold(" messages.")}`);
      console.log(socialInfo.messages.list)
      console.log(session.cookieSet)
    }),
    "browse": new nav.Page("browse", function() {
      console.clear();
      console.log(session.csrfToken);
    })
  }
}

export default null;