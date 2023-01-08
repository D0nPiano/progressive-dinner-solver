<template>
  <div>
    <div v-if="emails.length > 0">
      <button :disabled="currentEmailNumber == 0" @click="currentEmailNumber -= 1" type="button" class="btn btn-primary">Last
        E-Mail</button>
      Current E-Mail: {{ currentEmailNumber + 1 }}
      <button :disabled="currentEmailNumber == emails.length - 1" @click="currentEmailNumber += 1" type="button"
        class="btn btn-primary">Next E-Mail</button>
      <div class="emailarea">
        An: {{ currentEmail.email }} aus Team {{ currentEmail.teamId }}<br />
        <br />
        Hi {{ currentEmail.firstname }},<br />
        Toll, dass Du mitmachst! Du kochst zusammen mit {{
          currentEmail.teamPartnerFirstname + " " +
            currentEmail.teamPartnerLastname
        }} den Gang {{ currentEmail.teamCourse }}.<br />
        {{ currentEmail.teamPartnerFirstname }} macht bei der Organisation "{{ currentEmail.teamPartnerOrganization }}"
        mit. Du kannst {{ currentEmail.teamPartnerFirstname }} so erreichen:<br />
        E-Mail: {{ currentEmail.teamPartnerEmail }}<br />
        Telefon: {{ currentEmail.teamPartnerPhone }}<br />
        <br />
        Hier ist euer Ablaufplan:<br />
        Erster Gang:<br />
        {{ currentEmail.firstCoursePersonFirstname }} {{ currentEmail.firstCoursePersonLastname }} ({{
          currentEmail.firstCoursePersonOrganization
        }})<br />
        {{ currentEmail.firstCoursePersonStreet }} {{ currentEmail.firstCoursePersonSteetnumber }} ({{
          currentEmail.firstCoursePersonArea
        }})<br />
        {{ currentEmail.firstCoursePersonZip }}<br />
        <br />
        Zweiter Gang:<br />
        {{ currentEmail.secondCoursePersonFirstname }} {{ currentEmail.secondCoursePersonLastname }} ({{
          currentEmail.secondCoursePersonOrganization
        }})<br />
        {{ currentEmail.secondCoursePersonStreet }} {{ currentEmail.secondCoursePersonSteetnumber }} ({{
          currentEmail.secondCoursePersonArea
        }})<br />
        {{ currentEmail.secondCoursePersonZip }}<br />
        <br />
        Dritter Gang:<br />
        {{ currentEmail.thirdCoursePersonFirstname }} {{ currentEmail.thirdCoursePersonLastname }} ({{
          currentEmail.thirdCoursePersonOrganization
        }})<br />
        {{ currentEmail.thirdCoursePersonStreet }} {{ currentEmail.thirdCoursePersonSteetnumber }} ({{
          currentEmail.thirdCoursePersonArea
        }})<br />
        {{ currentEmail.thirdCoursePersonZip }}<br />
        <br />
        Wir wünschen viel Spaß!
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailPreview',
  data: function () {
    return {
      currentEmailNumber: 0
    }
  },
  props: {
    emails: {
      type: Array,
      required: true
    }
  },
  computed: {
    currentEmail: function () {
      return this.emails[this.currentEmailNumber]
    },
    templateHtml: () => {
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
    }
  }
}
</script>

<style scoped>
.emailarea {
  background-color: rgb(216, 216, 216);
  text-align: left;
  padding: 5em;
  margin: 5em;
}
</style>