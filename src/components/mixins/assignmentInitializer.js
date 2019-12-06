
import { globalFunctions } from "./globalFunctions";

export const assignmentInitializer = {
  mixins: [globalFunctions],
  methods: {
    switchTeams(teamIdOne, teamIdTwo, assignments) {
      let newMap = assignments;
      for (let i = 0; i < newMap.length; i++) {
        if (newMap[i] == teamIdTwo) {
          newMap[i] = teamIdOne;
        } else if (newMap[i] == teamIdOne) {
          newMap[i] = teamIdTwo;
        }
      }
      return newMap;
    },/*
    switchMainCourse(teamIdOne, teamIdTwo) {
      let newMap = this.teamToAssignIdMap;
      for (let i = 0; i < newMap.length; i++) {
        if (newMap[i] == teamIdTwo) {
          newMap[i] = teamIdOne;
        } else if (newMap[i] == teamIdOne) {
          newMap[i] = teamIdTwo;
        }
      }
      return newMap;
    },*/
    getPolylineForTeam(teamId, teams) {
      let e = teams[teamId];
      const firstCourseCook = teams[e.firstCourse];
      const secondCourseCook = teams[e.secondCourse];
      const thirdCourseCook = teams[e.thirdCourse];
      // console.log(firstCourseCook.firstname, ' -> ', secondCourseCook.firstname, ' -> ', thirdCourseCook.firstname) //eslint-disable-line

      const firstDist = this.distance(
        firstCourseCook.lat,
        firstCourseCook.lon,
        secondCourseCook.lat,
        secondCourseCook.lon
      )
      const secondDist = this.distance(
        secondCourseCook.lat,
        secondCourseCook.lon,
        thirdCourseCook.lat,
        thirdCourseCook.lon
      )

      return {
        firstDist: firstDist,
        secondDist: secondDist,
        distance: firstDist + secondDist,
        latlngs: [
          [firstCourseCook.lat, firstCourseCook.lon],
          [secondCourseCook.lat, secondCourseCook.lon],
          [thirdCourseCook.lat, thirdCourseCook.lon]
        ]
      };
    },
    getFirstCourseOutsideAssignmentIds(assignments){
      // the first course should be as far away from the city center as possible
      let numOfTeams = this.csv.length / 2;
      let numOfKitchensAtOnce = numOfTeams / 3;
  
      // find the best places for the first course
      let teamDistanceMap = []
      for (let i = 1; i <= numOfTeams; i++) {
        const distToCityCenter = this.distance(this.teams[i].lat, this.teams[i].lon, this.$store.state.center[0], this.$store.state.center[1])
        teamDistanceMap.push([this.teams[i].teamId, distToCityCenter]);
      }
      teamDistanceMap = teamDistanceMap.sort((x, y) => {return y[1] - x[1]})
      teamDistanceMap = teamDistanceMap.map((x) => (x[0]))
  
      let firstCourse = teamDistanceMap.slice(0, numOfKitchensAtOnce)
      let thirdCourse = teamDistanceMap.slice(numOfKitchensAtOnce*2, numOfKitchensAtOnce*3)
      firstCourse = this.shuffle(firstCourse)
      thirdCourse = this.shuffle(thirdCourse)
      
      // set first course as far outside as possible
      for (let i = 0; i < numOfKitchensAtOnce; i++) {
        assignments = this.switchTeams(assignments[i], firstCourse[i], assignments)
      }
  
      // set last course as near at the center as possible
      for (let i = 0; i < numOfKitchensAtOnce; i++) {
        assignments = this.switchTeams(assignments[i + numOfKitchensAtOnce * 2], thirdCourse[i], assignments)
      }
      return assignments
    },
    createEnhancedTeamInfo(teamArray) {
      let teams = {};
  
      // generate object from array
      teamArray.forEach(e => {
        if (e.kitchenUsed == this.$store.state.kitchenOptions.yes) {
          teams[e.teamId] = e;
        }
      });
  
      // add partner info
      teamArray.forEach(e => {
        if (e.kitchenUsed != this.$store.state.kitchenOptions.yes) {
          teams[e.teamId].partner = e;
        }
      });
  
      // add distance info & add polyline to map
      for (var prop in teams) {
        teams[prop].sequence = this.getPolylineForTeam(prop, teams);
      }
      return teams;
    },
    replaceTeamIdsWithAssignmentIds(assignments, assignmentMatrix) {
      let allMeals = JSON.parse(assignmentMatrix)
      //assignmentMatrix[0] = 1
      //let allMeals = this.createAssignmentMatrix(21)
  
      // replace teamIds according to map
      for (let course = 0; course < allMeals.length; course++) {
        for (let kitchen = 0; kitchen < allMeals[course].length; kitchen++) {
          for (
            let person = 0;
            person < allMeals[course][kitchen].length;
            person++
          ) {
            allMeals[course][kitchen][person] = assignments[
              allMeals[course][kitchen][person] - 1
            ];
          }
        }
      }
      return allMeals;
    },
    assignIdsToTeam(teamArray, assignments, assignmentMatrix) { // updates the csv data
      let assignmentArray = this.replaceTeamIdsWithAssignmentIds(assignments, assignmentMatrix);
      teamArray.forEach(e => {
        assignmentArray[0].forEach(kitchenTeams => {
          if (kitchenTeams.includes(e.teamId)) {
            e.firstCourse = kitchenTeams[0];
            // console.log(e.teamId, " eats at ", kitchenTeams[0], " with teams ", kitchenTeams) //eslint-disable-line
          }
        });
  
        assignmentArray[1].forEach(kitchenTeams => {
          if (kitchenTeams.includes(e.teamId)) {
            e.secondCourse = kitchenTeams[1];
            // console.log(e.teamId, " eats at ", kitchenTeams[0], " with teams ", kitchenTeams) //eslint-disable-line
          }
        });
  
        assignmentArray[2].forEach(kitchenTeams => {
          if (kitchenTeams.includes(e.teamId)) {
            e.thirdCourse = kitchenTeams[2];
            // console.log(e.teamId, " eats at ", kitchenTeams[0], " with teams ", kitchenTeams) //eslint-disable-line
          }
        });
      });
      return teamArray;
    },
    getRandomAssignmentIds(){
      // shuffle team ids
      let numOfTeams = this.csv.length / 2;
  
      let teams = [];
      for (let i = 1; i <= numOfTeams; i++) {
        teams.push(i);
      }
      return this.shuffle(teams);
    },
    /**
     * Returns an assignment matrix of type
     * [[[147], [258], [369]],
     *  [[168], [249], [357]],
     *  [[159], [267], [349]]
     * ]
     * @param {Number} numOfTeams the total number of participation teams
     */
    createAssignmentMatrix(numOfTeams) {
      let numOfKitchensAtOnce = numOfTeams / 3;

      // firstCourse
      let firstCourse = []; // will be of type [[[147], [258], [369]]]]
      for (let i = 1; i <= numOfTeams; i++) {
        if (firstCourse[i % numOfKitchensAtOnce]) {
          firstCourse[i % numOfKitchensAtOnce].push(i);
        } else {
          firstCourse[i % numOfKitchensAtOnce] = [i];
        }
      }

      // secondCourse
      let secondCourse = []; // will be of type [[[168], [249], [357]]]]
      for (let i = 1; i <= numOfTeams / 3; i++) {
        secondCourse[i % numOfKitchensAtOnce] = [i];
      }
      for (let i = numOfTeams / 3 + 1; i <= (numOfTeams / 3) * 2; i++) {
        secondCourse[(i + 1) % numOfKitchensAtOnce].push(i);
      }
      for (let i = (numOfTeams / 3) * 2 + 1; i <= numOfTeams; i++) {
        secondCourse[(i + 2) % numOfKitchensAtOnce].push(i);
      }

      // thirdCourse
      let thirdCourse = []; // will be of type [[[[159], [267], [349]]]
      for (let i = 1; i <= numOfTeams / 3; i++) {
        thirdCourse[i % numOfKitchensAtOnce] = [i];
      }
      for (let i = numOfTeams / 3 + 1; i <= (numOfTeams / 3) * 2; i++) {
        thirdCourse[(i + 2) % numOfKitchensAtOnce].push(i);
      }
      for (let i = (numOfTeams / 3) * 2 + 1; i <= numOfTeams; i++) {
        thirdCourse[(i + 4) % numOfKitchensAtOnce].push(i);
      }

      return [firstCourse, secondCourse, thirdCourse];
    }
  },
}