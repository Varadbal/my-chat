import { IncomingPacket, OutgoingPacket, InboxDto, MessageDto } from "./chat";
import { EventProducer } from "./EventProducer";

interface ProxyEventMap
{
    "login": () => void;
    "message": (channelId: string, message: MessageDto) =>void;
    "conversation": (channelId: string) => void;
}

class Proxy extends EventProducer<ProxyEventMap>
{
    private ws: WebSocket;
    inbox: InboxDto | null = null;

    constructor()
    {
        super();
        //this.ws = new WebSocket("ws://echo.websocket.org/");
        this.ws = new WebSocket("wss://raja.aut.bme.hu/chat/");
        this.ws.addEventListener("open", () =>
        {
            //alert("Hello");
            //this.ws.send("Hello");
        });
        this.ws.addEventListener("message", (e) => 
        {
            alert(e.data);
            let p = <IncomingPacket>JSON.parse(e.data);
            switch(p.type)
            {
                case "error":
                    alert(p.message);
                    break;
                case "login":
                    this.inbox = p.inbox;
                    this.dispatch("login");
                    break;
                case "message":
                    let cid = p.channelId;
                    this.inbox!.conversations.find(x => x.channelId === cid)?.lastMessages.push(p.message);
                    this.dispatch("message");
                    break;
                case "conversationAdded":
                    this.inbox!.conversations.push(p.conversation);
                    this.dispatch("conversation");
                    break;
            }
        });
    }

    public sendPacket(packet: OutgoingPacket){
        this.ws.send(JSON.stringify(packet));
    }
}

export var proxy = new Proxy();