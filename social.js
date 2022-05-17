async function updateMessages(user) {
  let msg = await scratchAPI.get(`/users/${user}/messages/count`);
  socialInfo.messages.count = msg.data.count;
}

export default {
  "updateMessages": updateMessages
}