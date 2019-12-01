<template>
  <div class="page">
    <h1>Emails</h1>
    <p
      class="alert alert-info"
    >Here, all neccesarry information will be added to a new csv file. After creating the email, you can download it and use it with "Mail Merge" in Thunderbird to automatically write all E-Mails.</p>
    <div style="max-width: 50em; margin: auto">
      <download-csv
        class="button"
        :data="csv">
         <button class="btn btn-primary">Backup your created Teams</button>
      </download-csv>
      <button class="btn btn-primary" type="button" v-if="!emails_created" @click="createEmails">Create E-Mails</button>
      <download-csv
        class="button"
        v-if="emails_created"
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
  </div>
</template>

<script>
export default {
  name: 'Emails',
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
        emailInfo.teamCourse = this.getCourseName(e.teamId)

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

/*
        let template = Guddi_Einteilung
        template = template.replace(/%%%Vorname%%%/gi, e.firstname)
        template = template.replace(/%%%Team_Course%%%/gi, this.getCourseName(e.teamId))
        //console.log('partner', e.firstname, teamPartner.firstname) // eslint-disable-line
        template = template.replace(/%%%Teampartner_Vorname%%%/gi, teamPartner.firstname)
        template = template.replace(/%%%Teampartner_Nachname%%%/gi, teamPartner.lastname)
        template = template.replace(/%%%Teampartner_Email%%%/gi, teamPartner.email)
        template = template.replace(/%%%Teampartner_Organisation%%%/gi, teamPartner.organization)
        template = template.replace(/%%%Teampartner_Telefon%%%/gi, emailInfo.teamPartnerPhone)

        template = template.replace(/%%%FirstCourse_Vorname%%%/gi, firstCoursePerson.firstname)
        template = template.replace(/%%%FirstCourse_Nachname%%%/gi, firstCoursePerson.lastname)
        template = template.replace(/%%%FirstCourse_Organisation%%%/gi, firstCoursePerson.organization)
        template = template.replace(/%%%FirstCourse_Viertel%%%/gi, firstCoursePerson.area)
        template = template.replace(/%%%FirstCourse_Street%%%/gi, firstCoursePerson.street)
        template = template.replace(/%%%FirstCourse_Streetnumber%%%/gi, firstCoursePerson.streetnumber)
        template = template.replace(/%%%FirstCourse_PLZ%%%/gi, firstCoursePerson.zip)

        template = template.replace(/%%%SecondCourse_Vorname%%%/gi, secondCoursePerson.firstname)
        template = template.replace(/%%%SecondCourse_Nachname%%%/gi, secondCoursePerson.lastname)
        template = template.replace(/%%%SecondCourse_Organisation%%%/gi, secondCoursePerson.organization)
        template = template.replace(/%%%SecondCourse_Viertel%%%/gi, secondCoursePerson.area)
        template = template.replace(/%%%SecondCourse_Street%%%/gi, secondCoursePerson.street)
        template = template.replace(/%%%SecondCourse_Streetnumber%%%/gi, secondCoursePerson.streetnumber)
        template = template.replace(/%%%SecondCourse_PLZ%%%/gi, secondCoursePerson.zip)

        template = template.replace(/%%%ThirdCourse_Vorname%%%/gi, thirdCoursePerson.firstname)
        template = template.replace(/%%%ThirdCourse_Nachname%%%/gi, thirdCoursePerson.lastname)
        template = template.replace(/%%%ThirdCourse_Organisation%%%/gi, thirdCoursePerson.organization)
        template = template.replace(/%%%ThirdCourse_Viertel%%%/gi, thirdCoursePerson.area)
        template = template.replace(/%%%ThirdCourse_Street%%%/gi, thirdCoursePerson.street)
        template = template.replace(/%%%ThirdCourse_Streetnumber%%%/gi, thirdCoursePerson.streetnumber)
        template = template.replace(/%%%ThirdCourse_PLZ%%%/gi, thirdCoursePerson.zip)
        this.filledEmailTemplate = template
        e.generated_mail = template
        */
      });
      this.emails_created = true
    },
    getCourseName(teamid) { // TODO: should be agnostic from number of teams
      if (teamid < 8) {
        return "Vorspeise"
      } else if (teamid >= 8 && teamid < 15) {
        return "Hauptspeise"
      } else {
        return "Nachspeise"
      }
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
        if (e.teamId == teamId && e.kitchenUsed == "Ja"){
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
