export interface ICtfTeamManager {
    GetTeamFromColor(teamColor : Color3) : Team
    ClearTeamScores() : void
    HasTeamWon() : void
    GetWinningTeam() : void
    AreTeamsTied() : void
    AssignPlayerToTeam(player : Player) : void
    RemovePlayer(player : Player) : void
    ShuffleTeams() : void
    AddTeamScore(teamColor : Color3) : void
} 

export interface ICtfPlayerManager {
    OnPlayerAdded: (player : Player) => void
    OnPlayerRemoving: (player: Player) => void
    Initialize() : void
    SetGameRunningStatus(running: boolean) : void
    ClearPlayerScores() : void
    LoadPlayers() : void
    AllowPlayerSpawn(allow: boolean) : void
    DestroyPlayers() : void
    AddPlayerScore(player: Player, score: number) : void
}

export interface ICtfDisplayManager {
    StartIntermission(player? : Player) : void
    StopIntermission(player? : Player) : void
    DisplayNotification(teamColor : string) : void
    UpdateTimerInfo(isIntermission : boolean, waitingForPlayers : boolean) : void
    DisplayVictory(winningTeam : Team) : void
    UpdateScore(team : Team, score : number) : void
}