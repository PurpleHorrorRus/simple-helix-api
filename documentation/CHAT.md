# Twitch Chat Client

```
Release version: 3.3.0
Description: Create your own chatbot.
```

Available chat events:
```
sub, resub, subgift, submysterygift, giftpaidupgrade, rewardgift, anongiftpaidupgrade, raid, unraid, ritual, bitsbadgetier, clear, delete, ban
```

You can check all available chat events and tags for chat events [here](https://dev.twitch.tv/docs/irc/tags#usernotice-tags).

### Example

```javascript
const HelixAPI = require("simple-helix-api"); // you can use import

const access_token = "xxxxxxxx";

// Init Helix instance
const Helix = new HelixAPI({
    access_token,
    client_id: "xxxxxxx"
});

const username = "username"; // Required. Username of bot account or your channel.
const channels = ["username"]; // Optional. Leave it blank or null to autoconnect to your channel
const secure = true;

const options = { // Optional. Configuration of chat
    debug: false, // Optional. Log raw messages. Default: false
    secure: true // Optional. Use secure connection (Connection via 443 port). Default: false
};

Helix.tmi.events.on(Helix.tmi.WebsocketEvents.CONNECTED, () => {
    console.log("Chat client connected");
});

Helix.tmi.events.on(Helix.tmi.WebsocketEvents.DISCONNECTED, () => {
    console.log("Chat client disconnected");
});

const chat = await Helix.tmi.connect(username, access_token, channels, options);

// Listen regular messages, highlighted messages or reward messages
chat.on("message", message => {
    const username = message["display-name"];
    console.log(`${username}: ${message.text}`);
});

/*
    Listen chat events.
    Chat events tags can be found here:
    https://dev.twitch.tv/docs/irc/tags#usernotice-tags
*/

// Listen sub event
chat.on("sub", sub => {
    const subscriber = sub["display-name"];
    const plan = sub["msg-param-sub-plan-name"];
    console.log(`${subscriber} has subscribed to the channel with ${plan}`);
});

// Listen sub event
chat.on("resub", resub => {
    const subscriber = resub["display-name"];
    const streak = resub["msg-param-streak-months"];
    console.log(`${subscriber} is resubscribed to the channel for the ${streak} month in a row`);
});

// Listen raid event
chat.on("raid", raid => {
    const raider = raid["msg-param-displayName"];
    const viewers = raid["msg-param-viewerCount"];
    console.log(`${raider} raiding with ${viewers} viewers`);
});

// Listen clear chat event
chat.on("clear", () => {
    console.log("Chat has been cleared");
});

// Sending commands
// chat.command("ban", "shine_discord21"); // Pass single argumnet to chat command
// chat.command("ban", ["shine_discord21", "shine_discord22"]); // Passing multiple arguments to chat command
chat.command("clearchat");

const date = new Date().toLocaleTimeString();
chat.say(`[Chat Client]: connected at ${date}`, channels);
```