import { ScratchSession }  from "meowclient";
import axios from "axios";
import Chalk from "chalk";
import rl from "readline-sync";
import nav from "./lists.js";
import social from "./social.js";

const theme = {
  "main": Chalk.hex("#b0f"),
  "accent": Chalk.hex("#fff")
}

global.session = new ScratchSession();
global.scratchAPI = axios.create({
  "baseURL": "https://api.scratch.mit.edu/",
  "timeout": 1000
})

async function getUser(error = false) {
  console.clear()
  if(error) {
    console.log(error)
  }
  
  let userName = rl.question(theme.main("User login name: "));
  let replacedUserName = userName.replace(/\s/gm, "");
  if(replacedUserName != userName) {
    console.log(`${theme.main("Note:")} Whitespace detected and removed (now ${replacedUserName})\n`);
    userName = replacedUserName
  }
  
  let userExists 
  try {
    let user = await scratchAPI.get(`/users/${userName}`);
    userExists = true;
  } catch(e) {
    userExists = false;
  }

  if(!userExists) {
    return `${theme.main("Login error: ")}${Chalk.red("User does not exist!")}\n`;
  }
  
  let userPass = rl.question(theme.main("User login password: "), {
    "hideEchoBack": true,
    "mask": "\u2022"
  });

  try {
    await session.init(userName, userPass);
    return "success";
  } catch {
    return `${theme.main("Login error: ")}${Chalk.red("Invalid password!")}\n`;
  }
}

function replaceEscapes(str) {
  let replacedString = str.replace(/&quot;/gm, "\"");
  replacedString = replacedString.replace(/&#39;/gm, "'");

  return replacedString
}

let loginSuccess = await getUser();
while(!(loginSuccess === "success")) {
  loginSuccess = await getUser(loginSuccess);
}
console.clear()

global.socialInfo = {
  "messages": {
    "count": 0
  }
}

await social.updateMessages("Griffpatch")

nav(
  theme.main(`Logged in as user ${theme.accent(session.username)}\n\nAvaliable Actions:\n`),
  [`Messages (${socialInfo.messages.count})`, "Browse"]
).choose()
console.log(loginSuccess === "success", loginSuccess)