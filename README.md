# About

Simple Helix API makes easy to develop applications for Twitch in couple lines of code

# Installation

Install with yarn:

```shell
yarn add simple-helix-api
```

# Usage

**Creating Helix object**

```javascript
const HelixAPI = require("simple-helix-api"); // also you can user es6 import
const Helix = new HelixAPI({
    access_token: "xxx",
    cliend_id: "xxx"
});
```

Params for Helix:

| Param         | Required           |  Default  | Description      |
| ------------- |:------------------:| :-------: | :--------------- |
| access_token  | false | null       | Access Token                 |
| client_id     | true  | null       | Client ID of application     |
| increaseRate  | false | false      | Use Bearer instead of OAuth to increase Rate Limit |
| disableWarns  | false | false      | Disabled warnings in console |

Then you can get your profile ID before start working with API

```javascript
const { id } = await Helix.getUser(username);
```

## Increase Rate

This option uses Bearer authorization instead of OAuth, which allows you to increase the number of requests per minute to 800 instead of 30.

 If you want to use this, you need to know that methods like ```updateStream(), createMarker()``` force OAuth authorization.

## Common methods

Common methods do not require an access token.

The fields indicates as ```params?``` are optional by default. You can read about all available optional params [here](https://dev.twitch.tv/docs/api/reference)

### Get User

Get information about user (example usage: id, profile image, offline image, view count, broadcaster type)

```javascript
const user = await Helix.getUser(id);
```

### Get Channel
Get channel info like title, game and others

```javascript
const channel = await Helix.getChannel(id);
```

### Get Clips
Gets clip information by clip ID (one or more), broadcaster ID (one only), or game ID (one only)

```javascript
const clips = await Helix.getClips(user_id, params?);
```

### Get All Clips
Gets all clips of channel

```javascript
const all_clips = await Helix.getAllClips(user_id);
```

### Get Stream

Get broadcast information (example usage: realtime viewers count)

```javascript
const stream = await Helix.getStream(id);
```

### Get Streams

Gets information about active streams. Streams are returned sorted by number of current viewers, in descending order. Across multiple pages of results, there may be duplicate or missing streams, as viewers join and leave streams.

```javascript
const streams = await Helix.getStreams(id);
```

### Get Stream Meta

Get broadcast meta information

```javascript
const meta = await Helix.getStreamMeta(id);
```

### Get Followers

Get first N followers from the end

```javascript
const followers = await Helix.getFollowers(id, count?, after?);
```

| Param | Type   | Required | Default | Max | Description                                    |
| ----- | :--:   | :------: | :-----: | :-: | :----------                                    |
| id    | Number | true     | null    | -   | ID of user                                     |
| count | Number | false    | 20      | 100 | Number of count of followers that you can get  |
| after | String | false    | null    | -   | Pangination cursor (offset)                    |

### Get All Followers

Return an array of all followers. The lead time depends on the number of followers on your channel

```javascript
const all_followers = await Helix.getAllFollowers(id);
```

### Get Followers Count

Get simple number of followers count

```javascript
const count = await Helix.getFollowersCount(id);
```

### Get Viewers

Get viewers splitted by categories (broadcaster, admins, staff, moderators, vips, viewers).
Attention! This method used username instead of user ID

```javascript
const viewers = await Helix.getViewers(user_name);
```

### Search Categories

Returns a list of games or categories that match the query via name either entirely or partially

```javascript
const game = await Helix.searchCategories("League of", params?);
```

### Search Channels

Returns a list of channels (users who have streamed within the past 6 months) that match the query via channel name or description either entirely or partially. Results include both live and offline channels

```javascript
const game = await Helix.searchChannels("InfiniteHorror", params?);
```

### Get Game

Get game by this ID or name

```javascript
const game = await Helix.getGame("Overwatch");
```

### Get Top Games

Get the top 100 most viewed games on Twitch at the moment

```javascript
const top = await Helix.getTopGames(count?);
```

| Param | Type   | Required | Default | Max | Description     |
| :---: | :--:   | :------: | :-----: | :-: | :---------      |
| count | Number | false  | 100       | 100 | Number of games |

### Get Banned Users

Returns all banned and timed-out users in a channel

```javascript
const game = await Helix.getBannedUsers(id, params?);
```

### Get Moderators

Returns all moderators in a channel

```javascript
const moderators = await Helix.getModerators(id, params?);
```

### Get Stream Key

Gets the channel stream key for a user

```javascript
const key = await Helix.getStreamKey(id);
```

### Get Bits Leaderboard

Gets a ranked list of Bits leaderboard information for an authorized broadcaster

```javascript
const leaders = await Helix.getBitsLeaderboard(params?);
```

### Get Bits Leaderboard

Retrieves the list of available Cheermotes, animated emotes to which viewers can assign Bits, to cheer in chat. Cheermotes returned are available throughout Twitch, in all Bits-enabled channels

```javascript
const leaders = await Helix.getCheermotes(id);
```


# Other

### Update Stream

**Attention**: access_token is **required**

Update broadcast information

```javascript
const response = await Helix.updateStream(id, title, game);
```

| Param | Type   | Required | Description        |
| :---: | :--:   | :------: |:---------          |
| id    | Number | true     | User ID            |
| title | String | true     | Stream title       |
| game  | String | true     | Game on the stream |


### Create Clip

Creating 15 seconds length clip

```javascript
const clip = await Helix.createClip(id, has_delay?);
```

| Param | Type   | Required | Description                          |
| :---: | :--:   | :------: |:---------                            |
| id    | Number | true     | User ID                              |
| has_delay | Boolean | false | If false, the clip is captured from the live stream when the API is called; otherwise, a delay is added before the clip is captured (to account for the brief delay between the broadcaster’s stream and the viewer’s experience of that stream). |

### Start Commercial 

Starts a commercial on a specified channel

```javascript
const commercial = await Helix.startCommercial(id, length?);
```

| Param | Type   | Required | Description                          |
| :---: | :--:   | :------: |:---------                            |
| id    | Number | true     | User ID                              |
| length | Number | false | Desired length of the commercial in seconds. Valid options are 30, 60, 90, 120, 150, 180 |

### Create Stream Marker

Creating stream marker with description

```javascript
const marker = await Helix.createMarker(id, description?);
```

| Param | Type   | Required | Description                          |
| :---: | :--:   | :------: |:---------                            |
| id    | Number | true     | User ID                              |
| description | String | false | Marker description (can be empty) |

### Get Stream Markers

Return an array with markers of specified VOD

```javascript
const markers = await Helix.getMarkers(id, video_id?);
```

| Param | Type   | Required | Description                                           |
| :---: | :--:   | :------: |:---------                                             |
| id    | Number | true     | User ID                                               |
| video_id | String | false | ID of the VOD/video whose stream markers are returned |

### Create Chatbot

Create chatbot to receive messages from Twitch Chat

You must [**get oauth token**](https://twitchapps.com/tmi/)

```javascript
const oauth_token = "XXXXXX";
const bot = Helix.createChatBot(bot_name, oauth_token, user_name);
bot.on("chat", (channel, user, message) => {
    const username = user["display-name"];
    return console.log(`${username}: ${message}`);
});
```

| Param        | Type   | Required | Description                                                                 |
| :---:        | :--:   | :------: |:---------                                                                   |
| bot_name     | String | true     | The name of the channel for the bot (you can specify your account nickname) |
| ouath_token  | String | true     | OAuth Token that you receive                                                |
| user_name    | String | true     | The name of the channel from which the bot will receive messages            |

You can find events, methods and examples for chatbot [**here**](https://github.com/tmijs/docs/tree/gh-pages/_posts)

# Issues
You can report of any issues [here](https://github.com/PurpleHorrorRus/simple-helix-api/issues)