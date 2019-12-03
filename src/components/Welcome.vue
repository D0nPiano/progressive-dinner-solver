<template>
  <div class="page">
    <h2>Welcome to the Progressive Dinner Solver</h2>
    <p></p>
    <div
      class="alert alert-info"
    >Welcome to the project of the open-source Progressive Dinner generator.</div>
    <div class="card" style="max-width: 40em;">
      <div class="card-body">
        <h5 class="card-title">Basic Idea</h5>
        <p class="card-text">
          You are assigned a teampartner - one of you has a kitchen and enough space to host 6 people. You are assigned a course (starters, main or dessert) and a route by the "Progressive Dinner Solver". You receive an Email, where you are going to have your starter, your main dish and your dinner, and you meet four new people (two other teams) at each location. Therefore, you will meet 13 new people in total (4 per course plus your team partner).
          <br /><br />This is happening all over town with at least 18 people participating. You always need 18 + n * 6 people for the dinner solver to work.
          <br /><br />In the end, there is usually an afterparty somewhere.
          <br />
        </p>
      </div>
    </div>
    <div class="card" style="max-width: 40em;">
      <div class="card-body">
        <h5 class="card-title">Participate in Coding</h5>
        <p class="card-text">
          If you find a bug, don't hasitate to contact me or fix it yourself. All code is open-source and <a href="https://github.com/D0nPiano/progressive-dinner-solver" target="_blank">on github.</a><br />
        </p>
      </div>
    </div>

    <div class="card paper" style="">
      <div class="card-body">
        <h4 class="card-title" style="margin-bottom: 3rem; font-family: 'Abril Fatface', serif;"><b>How it works - Create a Progressive Dinner in 10 steps & 10 minutes</b></h4>
        <p class="card-text">
          <ol>
            <li><span>Create a registration form (by using e.g. <i>google forms</i> or <i>wordpress + contact form 7 + flamingo</i>). The form has to contain the fields
              <b>first name</b>,
              <b>last name</b>,
              <b>email</b>,
              <b>phone number</b>,
              <b>street</b>,
              <b>street number</b>,
              <b>zip code</b>,
              <b>area</b>,
              <b>kitchen</b> (the info whether the person has a kitchen and space for 6 people, can be 'yes', 'if necessary' or 'no'),
              <b>allergies</b> and the optional arguments:
              <b>message</b> (is going to be displayed in the kitchen selector) and
              <b>organization</b> (is going to be used for team selection)
            </span></li>
            <li><span>Create an invitation and send the registration to the people. You might also want to create an additional form to keep track of people who canceled.<br/><br/>
            The invitation and registration could look like <a href="https://hg-nachhaltigkeit.de/guddi/" target="_blank">this</a>.</span>
            </li>
            <li><span>Send a reminder shortly before the day of the Progressive Dinner to remind people to cancel before you create the routes</span>
            </li>
            <li><span>Create a csv file from your gathered data, and upload it to this website. <b>Note that no data will be sent to our server - it all stays on your computer</b> and we do not know anything about the people that participate in your dinner.</span></li>
            <li><span>Use nominatim to look up all the addresses for you. This helps the program to find out the distances between kitchens.</span></li>
            <li><span>Select which kitchens you want the solver to use. The program pre-selects kitchens for you, and you can then manually adjust the selection.</span></li>
            <li><span>Select the teams. The program creates a pre-selection (according to whether the people have kitchens) and you can then manually adjust the teams.</span></li>
            <li><span>Create the routes. The program will try to have the starters at the outskirts of the city, with people moving towards a defined point. This is usefully for haveing more people show up at the afterpary, where all people come together.</span></li>
            <li><span>Gather all necessary information to create the emails. Also, download and backup your configuration so that you can re-upload it anytime.</span></li>
            <li><span>Let <a href="https://addons.thunderbird.net/de/thunderbird/addon/mail-merge/" target="_blank">Mail Merge</a> write the emails for you automatically. You can create a html template with placeholders for all the gathered information.</span></li>
          </ol>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome"
};
</script>

<style scoped>
.card {
  display: inline-block;
  margin: 10px;
  vertical-align: top;
}
.card-text {
  text-align: left
}

ol {
  list-style: none;
  counter-reset: my-awesome-counter;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

/* list formating */
ol li {
  counter-increment: my-awesome-counter;
  display: flex;
  width: 50%;
  padding-right: 0.8rem;
  margin-bottom: 2rem;
}
ol li::before {
  content: counter(my-awesome-counter, decimal-leading-zero);
  font-weight: bold;
  font-size: 3rem;
  margin-right: 0.8rem;
  font-family: 'Abril Fatface', serif;
  line-height: 1;
}

/* stacked paper effect */
.paper {
  background: #fff;
  padding: 30px;
  position: relative;
  max-width: 80em
}

.paper,
.paper::before,
.paper::after {
  box-shadow: 1px 1px 1px rgba(0,0,0,0.25);
  border: 1px solid #bbb;
}

.paper::before,
.paper::after {
  content: "";
  position: absolute;
  height: 95%;
  width: 99%;
  background-color: #eee;
}

.paper::before {
  right: 15px;
  top: 0;
  transform: rotate(-1deg);
  z-index: -1;
}

.paper::after {
  top: 5px;
  right: -5px;
  transform: rotate(1deg);
  z-index: -2;
}
</style>
