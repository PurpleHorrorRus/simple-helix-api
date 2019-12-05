# About
Simple Helix API makes easy to develop applications for Twitch in couple lines of code

# Installation
Install with npm:
```
npm install --save simple-helix-api
```

# Usage
**Creating Helix object**
```javascript
const HelixAPI = require("simple-helix-api");
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
| disableWarns  | false | false      | Disabled warnings in console |

Then you can get your profile ID before start working with API
```javascript
const { id } = await Helix.getUser(username);
```

## Common methods
Common methods do not require an access token

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

### Get Stream
Get broadcast information (example usage: realtime viewers count)
```javascript
const stream = await Helix.getStream(id);
```

### Get Stream Meta
Get broadcast meta information
```javascript
const meta = await Helix.getStreamMeta(id);
```

### Get Followers
Get first N followers from the end
```javascript
const followers = await Helix.getFollowers(id, count, after);
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

### Get Game
Get game by this ID or name
```javascript
const game = await Helix.getGame("Overwatch");
```

### Get Top Games
Get the top 100 most viewed games on Twitch at the moment
```javascript
const top = await Helix.getTopGames(count);
```
| Param | Type   | Required | Default | Max | Description     |
| :---: | :--:   | :------: | :-----: | :-: | :---------      |
| count | Number | false  | 100       | 100 | Number of games |

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

### Create Stream Marker
Creating stream marker with description
```javascript
await Helix.createMarker(id, description);
```

| Param | Type   | Required | Description                          |
| :---: | :--:   | :------: |:---------                            |
| id    | Number | true     | User ID                              |
| description | String | false | Marker description (can be empty) |

### Get Stream Markers
Return an array with markers of specified VOD
```javascript
await Helix.createMarker(id, video_id);
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
    console.log(`${username}: ${message}`);
    return;
});
```
| Param        | Type   | Required | Description                                                                 |
| :---:        | :--:   | :------: |:---------                                                                  |
| bot_name     | String | true     | The name of the channel for the bot (you can specify your account nickname) |
| ouath_token  | String | true     | OAuth Token that you receive                                                |
| user_name    | String | true     | The name of the channel from which the bot will receive messages            |

# Issues

You can report of any issues [here](https://github.com/PurpleHorrorRus/simple-helix-api/issues)

# Contributing

You can follow me on [Twitch](https://twitch.tv/InfiniteHorror) :)