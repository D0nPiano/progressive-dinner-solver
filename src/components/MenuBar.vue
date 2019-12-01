<template>
  <div class="background">
    <a
      @click="onClickButton('welcome')"
      :class="{active: $store.state.page == 'welcome'}"
      class="menu-button"
      href="#"
    >Upload / Download Data
      <img class="done-icon" v-if="$store.state.csv" :src="checkmark_icon" /></a>
    <a
      @click="onClickButton('locations')"
      :class="{disabled: !$store.state.csv, active: $store.state.page == 'locations'}"
      class="menu-button"
      href="#"
    >
      Add Location Info
      <img class="done-icon" v-if="$store.state.hasLocationData" :src="checkmark_icon" />
    </a>
    <a
      @click="onClickButton('teams')"
      :class="{disabled: !$store.state.hasLocationData, active: $store.state.page == 'teams'}"
      class="menu-button"
      href="#"
    >Select Kitchens & Teams
      <img class="done-icon" v-if="$store.state.hasTeamIds" :src="checkmark_icon" /></a>
    <a
      @click="onClickButton('assignments')"
      :class="{disabled: !$store.state.hasTeamIds, active: $store.state.page == 'assignments'}"
      class="menu-button"
      href="#"
    >Create Assignments
      <img class="done-icon" v-if="$store.state.hasAssignments" :src="checkmark_icon" /></a>
    <a
      @click="onClickButton('emails')"
      :class="{disabled: !$store.state.hasAssignments, active: $store.state.page == 'emails'}"
      class="menu-button"
      href="#"
    >Create E-Mails</a>
  </div>
</template>

<script>
export default {
  name: "MenuBar",
  methods: {
    onClickButton(message) {
      this.$emit("clicked", message);
    }
  },
  data: function() {
    return {
      checkmark_icon: require("../assets/checkmark.svg")
    };
  },
  computed: {
    hasLocations: function() {
      return this.$store.state.csv.filter(x => {
        return x.lat != "true" || x.kücheBenutzt == "Ja";
      });
    }
  }
};
</script>

<style scoped>
.background {
  background-color: darkgreen;
  margin: 1em 0 2em 0;
}
.menu-button {
  padding: 10px 20px;
  margin: 10px 10px;
  border-radius: 10px;
  text-decoration: none;
  background-color: darkgreen;
  color: white;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  position: relative;
  height: 24px;
}

.menu-button:hover {
  background-color: green;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

a.disabled {
  pointer-events: none;
  cursor: default;
  background-color: darkgreen;
  padding: 10px;
  color: rgb(137, 183, 137);
  box-shadow: none;
}

a.active {
  background-color: green;
}

.done-icon {
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: -2px;
  right: 0px;
  bottom: -7px;
  right: -9px;
}
</style>
