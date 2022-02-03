# About

simple-helix-api is a package needed to simplify working with the Twitch API.

The library was created following the Twitch API documentation as much as possible. 
All requests are divided into categories for ease of use. Below is a list of current categories supported by package.

```
analytics, channel, chat, clips, commercial, events, games, markers, moderation, other, polls, predictions, rewards, schedule, search, streams, subscriptions, tags, teams, users, videos
```

In addition, some requests that are associated with a list of something (a list of users, categories, clips, etc.) have one request in order to get a complete list.

# Usage

Before we starting, be sure you have client_id registered in Dev Dashboard on Twitch.

## Access Token

First, you need for Access Token provided by Twitch. With this package you can generate link to the endpoint that returns Access Token to you. If you already have, then skip this step.

```javascript
const HelixAPI = require("simple-helix-api"); // you can use import

const Helix = new HelixAPI({
    client_id: "xxxxxxx", // client_id from Twitch Dev Dashboard
    redirect_uri: "http://localhost...";  // redirect_uri must match to specified in Twitch Dev Dashboard
});

// List of scopes you need for your application. Left it empty to request all scopes. See scopes list: https://dev.twitch.tv/docs/authentication#scopes
const scopes = ["chat:read", "channel:manage:predictions", "moderation:read"];

const link = Helix.getAuthLink(scopes);
console.log(link);
```

Now you can use this package on full power.

## Example

Let's look at a basic example of working with package. In this example, we will get and output user information to the console.

Almost all requests requires an user ID. Get yours, store it and use everywhere.

**Attetion!** All requests and categories names matches with Twitch API documentation, but recommended to use autocomplete of your favorite code editor to see all categories and requests.

```javascript
const HelixAPI = require("simple-helix-api"); // you can use import

const Helix = new HelixAPI({
    access_token: "xxxxxxx", // Your personal Access Token provided by Twitch. If you don't have one, see step above.
    client_id: "xxxxxxx", // Client ID from Twitch Dev Dashboard
    redirect_uri: "http://localhost...";  // Redirect URL must match to specified in Twitch Dev Dashboard
});

(async () => {
    const user = await Helix.users.get("InfiniteHorror"); // Also you can specify user ID instead of user login
    console.log(user);
})();
```


## More examples

There is a several examples of requests you can use with this package. Be aware that some requests requires additional parameters, so check the official documentation on the Twitch Dev Portal.

### Update stream title and category

```javascript
const game = await Helix.games.getByName("League of Legends");
const updated = await Helix.channel.modify(user_id, game.id, "en", "Title has been changed with simple-helix-api");
```

### Start commercial

```javascript
await Helix.commercial.start(user_id, 30);
```

### Update chat settings

Some requests requires moderator ID. Moderator ID can be equal to the user ID.

```javascript
await Helix.chat.updateSettings(user_id, moderator_id, {
    follower_mode: true,
    follower_mode_duration: 10
});
```

### Ban user

```javascript
const user = await Helix.users.get("anyToxicPerson");
await Helix.moderation.ban(user_id, user_id, {
    user_id: user.id,
    reason: "Friendship is Magic"
});
```

### Get all followers of channel

```javascript
const followers = await Helix.users.allFollows(user_id);
console.log(followers);
```

### Get all clips of channel

The time of response depends on count of clips of your channel.

```javascript
const clips = await Helix.clips.all(user_id);
console.log(clips);
```

# Contribution
Sometimes I may miss some changes in the Twitch API, so I will be glad of any help. Feel free to fork and share PR's.

You can report of any issues [here](https://github.com/PurpleHorrorRus/simple-helix-api/issues).