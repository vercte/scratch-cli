class Message {
  constructor(content, user, type, data) {
    this.content = content;
    this.user = user;

    switch(type) {
      case "curatorinvite":
        this.content = `${user} invited you to curate the studio ${data.studio}`;
      default:
        break;
    }
  }
}

async function updateMessages(user) {
  let msgCount = await scratchAPI.get(`/users/${user}/messages/count`);
  socialInfo.messages.count = msgCount.data.count;

  let messages
  try {
    messages = await scratchAPI.get(`/users/${user}/messages?limit=40&offset=0`, {
      "x-token": session.token,
      Cookie: session.cookieSet
    })
  } catch(e) {
    messages = {"status": e.response.status, "error": e.response.data};
  }
  socialInfo.messages.list = messages;
}

export default {
  "updateMessages": updateMessages,
  "Message": Message
}