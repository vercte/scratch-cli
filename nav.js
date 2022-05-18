import rl from "readline-sync";
import Chalk from "chalk";

const theme = {
  "main": Chalk.hex("#b0f"),
  "accent": Chalk.hex("#fff")
}

class NavList {
  constructor(prompt, choices) {
    this.prompt = prompt;
    this.choices = choices;

    this.cl = choices.length;
  }

  choose() {
    let choice, lastKey, current = 0;
    while(!choice) {
      console.clear();
      if(lastKey == "a") {
        current--;
        if(current < 0) {
          current = this.choices.length - 1;
        }
      }

      if(lastKey == "d") {
        current++;
        if(current >= this.choices.length) {
          current = 0;
        }
      }
      
      console.log(this.prompt);
      for(let i = 0; i < this.choices.length; i++) {
        let currentIndex = this.choices[i].display;
        if(i == current) {
          console.log(`${theme.main(">")} ${theme.accent(Chalk.underline(currentIndex))}`)
        } else {
          console.log(`  ${theme.accent(this.choices[i].display)}`);
        }
      }
      console.log(theme.main("A & D to select, Space to choose"));
      lastKey = rl.keyIn('', {
        "hideEchoBack": true,
        "mask": "",
        "limit": "ad "
      })

      if(lastKey == " ") {
        choice = current + 1;
      }
    }
    choice = choice - 1;
    return {"choiceIndex": choice, "chosen": this.choices[choice]}
  }
}

class Page {
  constructor(name, startFunc) {
    this.pageName = name;
    this.openPage = startFunc;
    this.open = this.open.bind(this);
  }

  open() {
    app.openPage = this.pageName;
    return this.openPage();
  }
}

export default {Page, NavList};