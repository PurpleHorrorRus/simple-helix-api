import HelixAPI from "../src/index"
import * as dotenv from "dotenv";

import EventSub from "../src/lib/eventsub/websocket";
import TMIClient from "../src/lib/tmi/websocket";
import { TShieldMode } from "../src/lib/requests/types/moderation";
import { TChannel } from "../src/lib/requests/types/channel";

dotenv.config();

const Helix = new HelixAPI({
    client_id: process.env.CLIENT_ID!,
    access_token: process.env.ACCESS_TOKEN!
});

const user_id = "66312032";
const users = [user_id, "83817298"];

const timeout = 5; // mins
jest.setTimeout(timeout * 60 * 1000);

describe("Global", () => {
    test("Get Global Emotes", async () => {
        const emotes = await Helix.chat.globalEmotes();
        expect(emotes).toBeTruthy();
    });
});

describe("User", () => {
    test("Get", async () => {
        const user = await Helix.users.get(user_id);
        expect(user).toBeTruthy();
    });

    test("Get Stream", async () => {
        const user = await Helix.users.get("InfiniteHorror");
        const stream = await Helix.stream.streams({ user_id: user.data[0].id });
        expect(stream).toBeTruthy();
    });
});

describe("Channel", () => {
    test("Get Auth Link", async () => {
        const link = await Helix.getAuthLink([], "https://purplehorrorrus.github.io/token");
        expect(link).toBeTruthy();
    });

    test("Get Channel", async () => {
        const channels = await Helix.channel.get(users) as TChannel[];
        expect(channels[0]).toBeTruthy();
        expect(channels[1]).toBeTruthy();
    });

    test("Get Channel Editors", async () => {
        const editors = await Helix.channel.editors(user_id);
        expect(editors).toBeTruthy();
    });

    test("Get Chatters", async () => { 
        const chatters = await Helix.chat.chatters(user_id);
        expect(chatters).toBeTruthy();
    });

    test("Get All Chatters", async () => {
        const chatters = await Helix.chat.allChatters(user_id, user_id);
        expect(chatters).toBeTruthy();
    });

    test("Get Followed", async () => { 
        const followed = await Helix.channel.followed(user_id);
        expect(followed.data.length).toBeGreaterThan(0);

        const allFollowed = await Helix.channel.allFollowed(user_id);
        expect(allFollowed.length).toBeGreaterThan(0);
    });

    test.only("Get Followers", async () => { 
        const followers = await Helix.channel.followers(user_id);
        expect(followers.data.length).toBeGreaterThan(0);

        const allFollowers = await Helix.channel.allFollowers(user_id);
        expect(allFollowers.length).toBeGreaterThan(0);
    });

    test("Get Emotes", async () => {
        const emotes = await Helix.chat.emotes(user_id);
        expect(emotes).toBeTruthy();
    });

    test("Get Badges", async () => {
        const badges = await Helix.chat.badges(user_id);
        expect(badges).toBeTruthy();
    });

    test("Get Banned Users", async () => {
        const banned = await Helix.moderation.bannedUsers(user_id);
        expect(banned).toBeTruthy(); 
    });

    test("Update Stream Title/Game", async () => {
        const response = await Helix.games.getByName("League of Legends");
        const updated = await Helix.channel.modify(user_id, response.data[0].name, "en", "test");
        expect(updated).toBeTruthy();
    });

    test.skip("Get Markers", async () => {
        const markers = await Helix.markers.get(user_id, 0);
        expect(markers).toBeTruthy();
    });

    test("Get Viewers", async () => {
        const viewers = await Helix.other.getViewers("InfiniteHorror");
        expect(viewers).toBeTruthy();
    });
    
    test("Get Vips", async () => {
        const vips = await Helix.channel.vips(user_id);
        expect(vips).toBeGreaterThan(0);
    });

    test.skip("Commercial", async () => {
        const commercial = await Helix.commercial.start(user_id, 180);
        expect(commercial).toBeTruthy();
    });
});

describe("Chat", () => {
    test("Get Settings", async () => {
        const settings = await Helix.chat.settings(user_id);
        expect(settings).toBeTruthy();
    });

    test("Update Settings", async () => {
        const result = await Helix.chat.updateSettings(user_id, user_id, {
            follower_mode: false,
            follower_mode_duration: Infinity
        });

        expect(result).toBeTruthy();
    });

    test("Send Announcment", async () => {
        const result = await Helix.chat.announcement(user_id, user_id, "Test Announcment", "green");
        expect(result).toBeTruthy();
    });

    test("Get User Color", async () => {
        const color = await Helix.chat.color(user_id);
        expect(color).toBeTruthy();
    });

    test("Update User Color", async () => {
        const result = await Helix.chat.updateColor(user_id, "blue");
        expect(result).toBeTruthy();
    });
});

describe("Games", () => {
    test("Top Games", async () => {
        const top = await Helix.games.top();
        expect(top).toBeTruthy();
    });

    test.only("Get Games", async () => {
        const game = await Helix.games.get("League of Legends");
        expect(game).toBeTruthy();
    });
});

describe("Moderation", () => {
    const testSubject = "shine_discord21";

    test("Ban", async () => {
        const user = await Helix.users.get(testSubject);
        const result = await Helix.moderation.ban(user_id, {
            user_id: user.data[0].id,
            reason: "test ban"
        });

        expect(result).toBeTruthy();
    });

    test("Unban", async () => {
        const user = await Helix.users.get(testSubject);
        const result = await Helix.moderation.unban(user_id, user_id, user.data[0].id);
        expect(result).toBeTruthy();
    });

    test("Get Blocked Terms", async () => {
        const terms = await Helix.moderation.blockedTerms(user_id);
        expect(terms.data).toBeTruthy();
    });

    test("Get All Blocked Terms", async () => {
        const terms = await Helix.moderation.allBlockedTerms(user_id);
        expect(terms).toBeTruthy();
    });

    test("Add Blocked Term", async () => {
        const result = await Helix.moderation.addBlockedTerm(user_id, user_id, "test");
        expect(result).toBeTruthy();
    });

    test("Remove Blocked Term", async () => {
        const terms = await Helix.moderation.blockedTerms(user_id);
        const result = await Helix.moderation.removeBlockedTerm(user_id, user_id, terms.data[0].id);
        expect(result).toBeTruthy();
    });

    test("Get Automod Settings", async () => {
        const settings = await Helix.automod.settings(user_id, user_id);
        expect(settings).toBeTruthy();
    });

    test("Update Automod Settings", async () => {
        const result = await Helix.automod.update(user_id, {
            overall_level: 0
        });

        expect(result).toBeTruthy();
    });

    test("Get Banned Users", async () => {
        const banned = await Helix.moderation.bannedUsers(user_id);
        expect(banned).toBeTruthy();
    });

    test("Get All Banned Users", async () => {
        const banned = await Helix.moderation.allBannedUsers(user_id);
        expect(banned).toBeTruthy();
    });

    test("Get Moderators", async () => {
        const moderators = await Helix.moderation.moderators(user_id);
        expect(moderators).toBeTruthy();
    });

    test("Get All Moderators", async () => {
        const moderators = await Helix.moderation.allModerators(user_id);
        expect(moderators).toBeTruthy();
    });

    test("Add Moderator", async () => {
        const result = await Helix.moderation.addModerator(user_id, users[1]);
        expect(result).toBeTruthy();
    });

    test("Remove Moderator", async () => {
        const result = await Helix.moderation.removeModerator(user_id, users[1]);
        expect(result).toBeTruthy();
    });

    test("Get Shield Mode", async () => {
        const shieldMode = await Helix.moderation.getShieldMode(user_id, user_id);
        expect(shieldMode).toBeTruthy();
    });

    test("Turn Shield Mode", async () => {
        const shieldModeStatus = await Helix.moderation.getShieldMode(user_id, user_id) as TShieldMode;
        const shieldMode = await Helix.moderation.updateShieldMode(user_id, user_id, !shieldModeStatus.is_active);
        expect(shieldMode).toBe(true);
    });
});

describe("Polls", () => {
    test("Create", async () => {
        const poll = await Helix.polls.create(user_id, "Create", [{ title: "Lorem" }, { title: "Ipsum" }], 60);
        expect(poll).toBeTruthy();
    });

    test("Get All Polls", async () => {
        const polls = await Helix.polls.get(user_id);
        expect(polls).toBeTruthy();
    });

    test("Create & End poll", async () => {
        const poll = await Helix.polls.create(user_id, "Create and End", [{ title: "Lorem" }, { title: "Ipsum" }], 60);
        const isEnded = await Helix.polls.end(user_id, poll.id);
        expect(isEnded).toBeTruthy();
    });
});

describe("Predictions", () => {
    test("Create", async () => {
        const prediction = await Helix.predictions.create(user_id, "test pred", [{ title: "левый" }, { title: "правый" }], 30);
        expect(prediction).toBeTruthy();
    });

    test("Create & End", async () => {
        const prediction = await Helix.predictions.create(user_id, "test pred", [{ title: "левый" }, { title: "правый" }], 30);
        const isEnded = await Helix.predictions.end(user_id, prediction.id, "RESOLVED", prediction.outcomes[0].id);
        expect(isEnded).toBeTruthy();  
    });

    test("Get", async () => {
        const predictions = await Helix.predictions.get(user_id);
        expect(predictions).toBeTruthy();
    });

    test("Get All Predictions", async () => {
        const predictions = await Helix.predictions.all(user_id);
        expect(predictions).toBeTruthy();
    });
});

describe.skip("Schedule", () => {
    test("Get", async () => {
        const schedule = await Helix.schedule.get(user_id);
        expect(schedule).toBeTruthy();
    });
});

describe("Search", () => {
    test("Categories", async () => {
        const categories = await Helix.search.allCategories("The Elder Scroll");
        expect(categories.length).toBeGreaterThan(0);
    });

    test("Channels", async () => {
        const channels = await Helix.search.channels("InfiniteHorror");
        expect(channels).toBeTruthy();
    });
});

describe("Stream", () => {
    test.skip("Key", async () => {
        const key = await Helix.stream.key(user_id);
        expect(key).toBeTruthy();
    });

    test.skip("Streams", async () => {
        const streams = await Helix.stream.all();
        expect(streams).toBeTruthy();
    });

    test("Followed Streams", async () => {
        const streams = await Helix.stream.followed(user_id);
        expect(streams.data.length).toBeGreaterThan(0);
    });
});

describe("Tags", () => {
    test("Get Stream Tags", async () => {
        const tags = await Helix.tags.get(user_id);
        expect(tags).toBeTruthy();
    });

    test("Get All Tags", async () => {
        const tags = await Helix.tags.all(5);
        expect(tags).toBeTruthy();
    });

    test("Replace Tags", async () => {
        let tags = await Helix.tags.all(1);
        tags = tags.splice(0, 1);

        const tags_ids = tags.map((tag: any) => { 
            return tag.tag_id
        });

        const replaced = await Helix.tags.replace(user_id, tags_ids);
        expect(replaced).toBeTruthy();
    });
});

describe("Users", () => {
    test("Get", async () => {
        const user = await Helix.users.get(user_id);
        expect(user).toBeTruthy();
    });

    test("Update", async () => {
        const isUpdated = await Helix.users.update({ description: "Hello and good day! Streamer Infinite Horror at your service! I may be uninvited, but I hope I'm not unwelcome! Good luck and see you When They Cry again!" });
        expect(isUpdated).toBeTruthy();
    });

    test("Follows", async () => {
        const follows = await Helix.users.follows(user_id);
        expect(follows).toBeTruthy();
    });

    test("All Follows", async () => {
        const follows = await Helix.users.allFollows(user_id);
        expect(follows).toBeTruthy();
    });

    test("Extensions", async () => {
        const extensions = await Helix.users.activeExtensions(user_id);
        expect(extensions).toBeTruthy();
    });
});

describe("Video", () => {
    test("Get", async () => {
        const videos = await Helix.videos.all({ user_id }, 5);
        expect(videos).toBeTruthy();
    });

    test("Delete", async () => {
        const videos = await Helix.videos.all({ user_id }, 5);
        const isDeleted = await Helix.videos.deleteVideos([videos[0].id, videos[1].id]);
        expect(isDeleted).toBeTruthy();
    });
});

describe("Rewards", () => {
    test("Get Rewards", async () => {
        const reward = await Helix.rewards.get(user_id);
        expect(reward).toBeTruthy();
    });

    test("Get Reward Redemption", async () => {
        const reward = await Helix.rewards.get(user_id);
        const redemptions = await Helix.rewards.redemption(user_id, reward.data[0].id);
        expect(redemptions).toBeTruthy();
    });

    test("Create Reward", async () => {
        const reward = await Helix.rewards.create(user_id, "test", 10);
        expect(reward).toBeTruthy();
    });

    test("Create & Update", async () => {
        const created = await Helix.rewards.create(user_id, "test", 10);
        const updated = await Helix.rewards.update(user_id, created.data[0].id, {
            title: "test_updated",
            cost: 666
        });

        expect(updated.title).toBe("test_updated");
        expect(updated.cost).toBe(666);
    });

    test("Create & Delete", async () => {
        const created = await Helix.rewards.create(user_id, "test", 10);
        const isDeleted = await Helix.rewards.deleteReward(user_id, created.data[0].id);
        expect(isDeleted).toBe(true);
    });
});

describe("Clips", () => {
    test("Get Clips", async () => {
        const clips = await Helix.clips.get(user_id);
        expect(clips).toBeTruthy();
    });

    test("Get All Clips", async () => {
        const clips = await Helix.clips.all(user_id, 5);
        expect(clips).toBeTruthy();
    });
});

describe.skip("Analytics", () => {
    test("Game", async () => {
        const analytics = await Helix.analytics.game({
            game_id: "123"
        });

        expect(analytics).toBeTruthy();
    });

    test("Bits", async () => {
        const bits = await Helix.analytics.bits();
        expect(bits).toBeTruthy();
    });

    test("Cheermotes", async () => {
        const cheermotes = await Helix.analytics.cheermotes();
        expect(cheermotes).toBeTruthy();
    });
});

describe.skip("Soundtrack", () => {
    test("Get Track", async () => {
        const user = await Helix.users.get("Monstercat");
        const track = await Helix.soundtrack.track(user.data[0].id);
        expect(track).toBeTruthy();
    });

    test("Get Playlist", async () => {
        const playlists = await Helix.soundtrack.playlists();
        const playlist = await Helix.soundtrack.playlist(playlists.data[0].id);
        expect(playlist).toBeTruthy();
    });
});

describe("EventSub", () => {
    let client: EventSub = Helix.EventSub;
    const conditions = [{
        broadcaster_user_id: String(user_id)
    }];

    beforeAll(async () => {
        client = await new Promise(async resolve => {
            Helix.EventSub.events.once(Helix.EventSub.WebsocketEvents.CONNECTED, () => {
                console.log("Connected", Boolean(client));
                return resolve(client);
            });
    
            Helix.EventSub.events.once(Helix.EventSub.WebsocketEvents.DISCONNECTED, () => {
                console.log("Disconnected");
            });
    
            await Helix.EventSub.connect({
                debug: true
            });
        });
    });

    test("Handle", async () => {
        const response = await new Promise(resolve => {
            client.subscribe("channel.update", conditions[0], data => { 
                return resolve(data);
            });

            console.log("Subscribed, waiting for an event...");
        });

        expect(response).toBeTruthy();
    });

    test.skip("Handle Reconnect", async () => {
        client.events.on(client.WebsocketEvents.CONNECTED, async () => {
            console.log("Connected, registering events..");

            await client.subscribe("channel.update", conditions[0], data => {
                console.log(data);
                return data;
            });

            return client;
        });

        client.events.on(client.WebsocketEvents.DISCONNECTED, reason => {
            console.log("Disconnected", reason);
        });

        client.connection.reconnect();

        await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 60));
        expect(true).toBe(true);
    });
});

describe("TMI Client", () => {
    let client: TMIClient | null;

    beforeAll(async () => {
        return await new Promise(async resolve => { 
            Helix.tmi.events.on(Helix.tmi.WebsocketEvents.CONNECTED, () => {
                console.log("[TMI]: Connected");
                return resolve(client);
            });
    
            Helix.tmi.events.on(Helix.tmi.WebsocketEvents.DISCONNECTED, reason => {
                return console.error("[TMI]: Disconnected", reason);
            });
    
            client = await Helix.tmi.connect(
                process.env.TMI_USERNAME!,
                process.env.ACCESS_TOKEN!,
                ["InfiniteHorror"],
                {
                    debug: true,
                    secure: true
                }
            ).catch(e => {
                console.error(e);
                return null;
            });
        });
    });

    test("Handle", async () => {
        console.log("Waiting for a message...");

        const message = await new Promise(resolve => {
            client?.once("message", message => {
                return resolve(message);
            });
        });

        expect(message).toBeTruthy();
    });

    test("Handle Roomstate", async () => {
        const roomstate = await new Promise(resolve => {
            client?.once("ROOMSTATE", message => {
                return resolve(message);
            });
        });

        expect(roomstate).toBe(true);
    });

    test("Send Message", async () => {
        const response = await client?.say(new Date().toLocaleTimeString(), "InfiniteHorror");
        expect(response).toBe(true);
    });
    
    test("Send Command", async () => {
        const response = await client?.command("ban", ["shine_discord21", "Bot account"]);
        expect(response).toBe(true);
    });

    test("Send Custom Tags", async () => { 
        const message: any = await new Promise(resolve => {
            client?.once("message", message => {
                return resolve(message);
            });
        });

        const answer = await client?.say(new Date().toLocaleTimeString(), "InfiniteHorror", {
            "reply-parent-msg-id": message.id
        });

        expect(answer).toBe(true);
    });
});