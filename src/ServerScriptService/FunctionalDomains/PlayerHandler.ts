import { Players } from '@rbxts/services';

export class PlayerHandler {
    static GetOnPlayerAddedHandler() : (player : Player) => void {
        let handler = (player : Player) => {
            
        }

        return handler
    }
    static GetOnPlayerRemovingHandler() : (player : Player) => void {
        let handler = (player : Player) => {

        }

        return handler
    }

    static DestroyPlayers() : void {
        let currentPlayers = Players.GetPlayers()
        currentPlayers.forEach((player : Player) => {
            
        })
    }

    static Init() : void {   
        Players.PlayerAdded.Connect(this.GetOnPlayerAddedHandler())
        Players.PlayerRemoving.Connect(this.GetOnPlayerRemovingHandler())
    }
}