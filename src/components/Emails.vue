<template>
  <div class="page">
    <h1>Emails</h1>
    <p
      class="alert alert-info"
    >Here, all neccesarry information will be added to a new csv file. After creating the email, you can download it and use it with "Mail Merge" in Thunderbird to automatically write all E-Mails.</p>
    <div style="max-width: 50em; margin: auto">
      <download-csv
        class="button"
        name="teamData.csv"
        :data="csv">
         <button class="btn btn-primary">Backup your created Teams</button>
      </download-csv>
      <button class="btn btn-primary" type="button" v-if="!emails_created" @click="createEmails">Create E-Mails</button>
      <download-csv
        class="button"
        v-if="emails_created"
        name="emailData.csv"
        :data="emails">
         <button class="btn btn-primary">Download Data for Emails</button>
      </download-csv>
    </div>
    <div id="people">
      <v-client-table
        v-if="csv.length > 2"
        :data="csv"
        :columns="mapFields"
      >
        <template slot="submit" slot-scope="{submit}">
          <button @click.prevent="submit">send!</button>
        </template>
      </v-client-table>
    </div>
    <span v-html="filledEmailTemplate"></span>
    <EmailPreview :emails="emails"></EmailPreview>
  </div>
</template>

<script>
import EmailPreview from './EmailPreview.vue'

export default {
  name: 'Emails',
  components: { EmailPreview },
  data: function() {
    return {
      csv: [],
      emails: [],
      emails_created: false,
      filledEmailTemplate: null,
      mapFields: ["firstname", "lastname", "organization", "email"],
    };
  },
  methods: {
    createEmails() {
      this.emails = []
      this.csv.forEach(e => {
        let emailInfo = {}
        let teamPartner = this.getTeamPartner(e)
        let firstCoursePerson = this.getPersonWithTeamId(e.firstCourse)
        let secondCoursePerson = this.getPersonWithTeamId(e.secondCourse)
        let thirdCoursePerson = this.getPersonWithTeamId(e.thirdCourse)

        emailInfo.firstname = e.firstname
        emailInfo.email = e.email
        emailInfo.teamId = e.teamId

        let teamCourseEnglish = this.getCourseName(e.teamId)
        const courses = {
          "first": "Vorspeise",
          "second": "Hauptspeise",
          "third": "Nachspeise"
        }
        emailInfo.teamCourse = courses[teamCourseEnglish]

        let peopleForTheirCourse = this.getPeopleForTeamCourse(teamCourseEnglish, e.teamId)
        let allergies = []
        peopleForTheirCourse.forEach( e => {
          if (e.allergies != "") {
            allergies.push(e.allergies)
          }
        })
        allergies = allergies.filter((e) => e.trim().toLowerCase() != "keine")
        allergies = allergies.filter((e) => e.trim().toLowerCase() != "nein")
        emailInfo.allergies = allergies.join(" | ")
        // console.log(e.firstname, e.teamId, teamCourseEnglish, peopleForTheirCourse)

        // Team Partner Info
        emailInfo.teamPartnerFirstname = teamPartner.firstname
        emailInfo.teamPartnerLastname = teamPartner.lastname
        emailInfo.teamPartnerEmail = teamPartner.email
        emailInfo.teamPartnerOrganization = teamPartner.organization

        let tel = teamPartner.phone.toString()
        if (tel[0] != "0" && tel[0] != "+" && tel[0] != "4") {
          tel = "0" + tel
        }
        if (tel[0] == "4" && tel[1] == "9"){
          tel = "+" + tel
        }
        emailInfo.teamPartnerPhone = tel

        // First Course Info
        emailInfo.firstCoursePersonFirstname = firstCoursePerson.firstname
        emailInfo.firstCoursePersonLastname = firstCoursePerson.lastname
        emailInfo.firstCoursePersonOrganization = firstCoursePerson.organization
        emailInfo.firstCoursePersonArea = firstCoursePerson.area
        emailInfo.firstCoursePersonStreet = firstCoursePerson.street
        emailInfo.firstCoursePersonSteetnumber = firstCoursePerson.streetnumber
        emailInfo.firstCoursePersonZip = firstCoursePerson.zip


        // Second Course Info
        emailInfo.secondCoursePersonFirstname = secondCoursePerson.firstname
        emailInfo.secondCoursePersonLastname = secondCoursePerson.lastname
        emailInfo.secondCoursePersonOrganization = secondCoursePerson.organization
        emailInfo.secondCoursePersonArea = secondCoursePerson.area
        emailInfo.secondCoursePersonStreet = secondCoursePerson.street
        emailInfo.secondCoursePersonSteetnumber = secondCoursePerson.streetnumber
        emailInfo.secondCoursePersonZip = secondCoursePerson.zip

        // Third Course Info
        emailInfo.thirdCoursePersonFirstname = thirdCoursePerson.firstname
        emailInfo.thirdCoursePersonLastname = thirdCoursePerson.lastname
        emailInfo.thirdCoursePersonOrganization = thirdCoursePerson.organization
        emailInfo.thirdCoursePersonArea = thirdCoursePerson.area
        emailInfo.thirdCoursePersonStreet = thirdCoursePerson.street
        emailInfo.thirdCoursePersonSteetnumber = thirdCoursePerson.streetnumber
        emailInfo.thirdCoursePersonZip = thirdCoursePerson.zip

        this.emails.push(emailInfo)
      });
      this.emails_created = true
    },
    getCourseName(teamid) {
      let courseName = ""
      this.csv.forEach(e => {
        if (e.teamId == teamid){
          if (e.firstCourse == teamid) {
            courseName = "first"
          } else if (e.secondCourse == teamid) {
            courseName = "second"
          } else {
            courseName = "third"
          }
        }
      })
      return courseName
    },
    getPeopleForTeamCourse(course, teamid) {
      let peopleTheyCookFor = []
      this.csv.forEach(e => {
        if (e[course + "Course"] == teamid){
          peopleTheyCookFor.push(e)
        }
      })
      return peopleTheyCookFor
    },
    getTeamPartner(person){
      let partner = null
      this.csv.forEach(e => {
        if (e.teamId == person.teamId && e.kitchenUsed != person.kitchenUsed){
          partner = e
        }
      })
      return partner
    },
    getPersonWithTeamId(teamId){
      let partner = null
      this.csv.forEach(e => {
        if (e.teamId == teamId && e.kitchenUsed == this.$store.state.kitchenOptions.yes){
          partner = e
        }
      })
      return partner
    }
  },
  mounted: function() {
    if (this.$store.state.csv) {
      this.csv = this.$store.state.csv;
    }
  }
}
</script>

<style scoped>
.button {
  display: inline-block;
}
</style>
