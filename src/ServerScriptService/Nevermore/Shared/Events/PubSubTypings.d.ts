export interface IPubSub {
    GetOrCreateClientServerTopicCategory : 
        ( categoryName : string ) => Folder
    GetOrCreateClientServerTopicInCategory :
        ( categoryName : string, topicName : string) => RemoteEvent
    SubscribeServerToTopicEvent :
        ( categoryName : string, topicName : string, 
         serverCallback : (sender : Player, ...data : any[]) => void ) => RemoteEvent
    ConnectEntityListenerFuncToTopic : 
        ( entityId : string, categoryName : string, topic : string, 
            listenerFunc : (...data : any[]) => any) => RemoteEvent
    
}
