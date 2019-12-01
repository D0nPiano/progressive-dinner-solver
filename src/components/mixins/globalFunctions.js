export const globalFunctions = {
  methods: {
    distance(lat1, lon1, lat2, lon2, unit) {
      if (lat1 == lat2 && lon1 == lon2) {
        return 0;
      } else {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "Miles") {
          return dist;
        }
        if (unit == "Nautic Miles") {
          dist = dist * 0.8684;
        }
        return dist * 1.609344;
      }
    },
    getTeamColor(teamId, selectedTeam) {
      if (selectedTeam == 0 || selectedTeam == teamId) {
        let r = Math.floor(
          Math.abs(Math.sin(teamId) * 256) % 180
        );
        let g = Math.floor(
          Math.abs(Math.sin(teamId * 16) * 256) % 180
        );
        let b = Math.floor(
          Math.abs(Math.sin(teamId * 64) * 256) % 180
        );
        if (r + g + b < 300) {
          b = b * 2;
        }
        if (r + g + b > 300) {
          r = r / 2;
        }
        return "rgba(" + r + ", " + g + ", " + b + ", 1)";
      } else {
        return "rgba(100, 100, 100, 0.1)";
      }
    },
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    
      return array;
    }
  }
}