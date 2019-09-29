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

}

export interface ICtfDisplayManager {
    StartIntermission(player : Player) : void
    StopIntermission(player : Player) : void
    DisplayNotification(teamColor : string) : void
}