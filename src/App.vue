<template>
  <div id="app">
    <!--<img alt="Guddi logo" src="./assets/kitchen_yes_icon.png" style="width: 20em; max-width: 40em">-->
    <MenuBar @clicked="onClickChild"/>
    <Welcome v-if="currentApp == 'welcome'"/>
    <Data v-if="currentApp == 'data'"/>
    <Locations v-if="currentApp == 'locations'"/>
    <Teams v-if="currentApp == 'teams'"/>
    <Assignments v-if="currentApp == 'assignments'"/>
    <Emails v-if="currentApp == 'emails'"/>
  </div>
</template>

<script>
import Welcome from './components/Welcome.vue'
import Data from './components/Data.vue'
import Locations from './components/Locations.vue'
import Teams from './components/Teams.vue'
import Assignments from './components/Assignments.vue'
import Emails from './components/Emails.vue'
import MenuBar from './components/MenuBar.vue'

export default {
  name: 'app',
  components: {
    Welcome, Data, Teams, MenuBar, Assignments, Emails, Locations
  },
  computed: {
    currentApp () {
      return this.$store.state.page
    }
  },
  methods: {
    onClickChild (value) {
      this.$store.commit('setCurrentPage', value)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.page {
  margin: 0 auto;
  max-width: 90em;
}

.btn {
  margin: 4px;
}


th,
td {
  text-align: left;
  padding: 8px;
}
</style>
