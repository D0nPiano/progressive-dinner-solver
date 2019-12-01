
import { globalFunctions } from "./globalFunctions";

export const assignmentStats = {
  mixins: [globalFunctions],
  methods: {
    getStatsForAssignments(teamObject) {

      // Overall Distance
      const overallDist = this.getOverallDist(teamObject)

      // Maximum Distance
      const maxDist = this.getMaxDist(teamObject)

      // Total Distance from last course to Afterpary

      // Maximum Distance per way

      // is valid config
      const isValid = this.isValidConfig(teamObject)
      if(!isValid[0]){
        console.log(isValid) //eslint-disable-line
      }

      //const overallScore = overallDist + maxDist;
      const overallScore = this.getSquareDistances(teamObject);

      return { 'overallDist': overallDist, 'maxDist': maxDist, 'overallScore': overallScore }
    },
    getSquareDistances(teamObject) {
      let overallDist = 0
      for (var teamId in teamObject) {
        overallDist += Math.pow(teamObject[teamId].sequence.firstDist, 2)
        overallDist += Math.pow(teamObject[teamId].sequence.secondDist, 2)
      }
      return overallDist
    },
    getOverallDist(teamObject) {
      let overallDist = 0
      for (var teamId in teamObject) {
        overallDist += teamObject[teamId].sequence.distance;
      }
      return overallDist
    },
    getMaxDist(teamObject) {
      let maxDist = 0
      for (var teamId in teamObject) {
        const curDist = teamObject[teamId].sequence.distance;
        if (curDist > maxDist) {
          maxDist = curDist;
        }
      }
      return maxDist
    },
    getTeamsAt(teamObject, course, kitchenId) {
      let teamsCookingThere = []
      for (var teamId in teamObject) {
        if (teamObject[teamId][course] == kitchenId) {
          teamsCookingThere.push(teamId)
        }
      }
      return teamsCookingThere
    },
    getSeenTeamsForTeam(teamObject, teamId) {
      const teamsAtFirstCourse = this.getTeamsAt(teamObject, 'firstCourse', teamObject[teamId].firstCourse)
      const teamsAtSecondCourse = this.getTeamsAt(teamObject, 'secondCourse', teamObject[teamId].secondCourse)
      const teamsAtThirdCourse = this.getTeamsAt(teamObject, 'thirdCourse', teamObject[teamId].thirdCourse)
      const allSeenTeams = teamsAtFirstCourse.concat(teamsAtSecondCourse).concat(teamsAtThirdCourse)
      return allSeenTeams.filter((x) => { return x != teamId })
    },
    isValidConfig(teamObject) {
      for (var teamId in teamObject) {
        // is team going to three different kitchens?
        if (teamObject[teamId].firstCourse == teamObject[teamId].secondCourse || teamObject[teamId].firstCourse == teamObject[teamId].thirdCourse) {
          return [false, 'Team goes to same kitchen twice', { error: 'kitchenDuplicate', teamId: teamId, kitchen: teamObject[teamId].firstCourse }]
        }
        if (teamObject[teamId].secondCourse == teamObject[teamId].thirdCourse) {
          return [false, 'Team goes to same kitchen twice', { error: 'kitchenDuplicate', teamId: teamId, kitchen: teamObject[teamId].secondCourse }]
        }

        // is the kitchen of the team used?
        if (teamId != teamObject[teamId].firstCourse && teamId != teamObject[teamId].secondCourse && teamId != teamObject[teamId].thirdCourse) {
          return [false, 'Team is only going to other kitchens', { error: 'notUsingOwnKitchen', teamId: teamId }]
        }

        // is the team seeing another team twice?
        const seenTeams = this.getSeenTeamsForTeam(teamObject, teamId)
        if (seenTeams.length < 6) {
          return [false, 'Team saw less than 6 other teams', { error: 'lessThanSix', teamId: teamId }]
        } else if (seenTeams.length < 6) {
          return [false, 'Team saw more than 6 other teams', { error: 'moreThanSix', teamId: teamId }]
        }
        // console.log('Seen Teams', teamId, ': ', seenTeams) //eslint-disable-line
      }
      return [true]
    },
  },
}