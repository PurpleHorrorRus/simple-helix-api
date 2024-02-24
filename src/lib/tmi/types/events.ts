export type TChatEvent =
    "message"

    | "NOTICE"
    | "GLOBALUSERSTATE"
    | "USERSTATE"
    | "ROOMSTATE"
    | "CLEARCHAT"
    | "CLEARMSG"
    | "USERNOTICE"
    | "PRIVMSG"
    | "PING"

    | "sub"
    | "resub"
    | "subgift"
    | "submysterygift"
    | "giftpaidupgrade"
    | "rewardgift"
    | "anongiftpaidupgrade"
    | "raid"
    | "unraid"
    | "ritual"
    | "bitsbadgetier"

    | "clear"
    | "ban"
    | "delete";