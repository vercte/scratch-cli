import { ScratchSession }  from "meowclient";

import _ from "./globals.js";
import social from "./social.js";

global.session = new ScratchSession();

function replaceEscapes(str) {
  let replacedString = str.replace(/&quot;/gm, "\"");
  replacedString = replacedString.replace(/&#39;/gm, "'");

  return replacedString
}

let loginSuccess = await getUser();
while(!(loginSuccess === "success")) {
  loginSuccess = await getUser(loginSuccess);
}
console.clear();

await social.updateMessages(session.username)
let choice = app.pages[app.openPage].open()
choice.chosen.func()