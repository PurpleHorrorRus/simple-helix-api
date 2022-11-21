# EventSub (WebSocket)

```
Release version: 3.1.0

Description: You can receive realtime notifications using Websocket.
```

You can check all events on [this page](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types#channelsubscribe).

### Example

```javascript
const HelixAPI = require("simple-helix-api"); // you can use import

// Init Helix instance
const Helix = new HelixAPI({
    access_token: "xxxxxxx",
    client_id: "xxxxxxx"
});

// Listen connect and disconnect events
Helix.EventSub.events.on(Helix.EventSub.WebsocketEvents.CONNECTED, () => {
    console.log("Connected to EventSub");
});

Helix.EventSub.events.on(Helix.EventSub.WebsocketEvents.DISCONNECTED, () => {
    console.log("Disconnected from EventSub");
});

// List of conditions. Each event can have different from each other conditions, so please check Twitch docs.
const conditions = [{
    broadcaster_user_id: String(0123456789) // User ID and other numbers must be converted to string for condition
}];

const options = { // Optional. Configuration of connection
    debug: false // Optional. Log all EventSub messages. Default: false
};

// Create EventSub client
const EventSubClient = await Helix.EventSub.connect(options);

// Register listeners for events
EventSubClient.subscribe("channel.follow", conditions[0], follow => {
    console.log(`Thank you for following, ${follow.user_name}`);
});
```