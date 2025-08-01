import {FieldDefinition} from "@/components/professionals/states/StartingState";

//Professional title options
const ProfessionalTitleOptions = [
  { label: "Psychiatrist", value: "psychiatrist" },
  { label: "Psychologist", value: "psychologist" },
  { label: "Therapist", value: "therapist" },
  { label: "Counselor", value: "counselor" },
  { label: "Social Worker", value: "socialWorker" },
  { label: "Marriage and Family Therapist", value: "marriageAndFamilyTherapist" },
  { label: "Substance Abuse Counselor", value: "substanceAbuseCounselor" },
  { label: "Mental Health Coach", value: "mentalHealthCoach" },
  { label: "Peer Support Specialist", value: "peerSupportSpecialist" },
  { label: "Psychiatric Nurse Practitioner", value: "psychiatricNursePractitioner" },
  { label: "Psychiatric Nurse", value: "psychiatricNurse" },
  { label: "School Counselor", value: "schoolCounselor" },
  { label: "Mental Health Technician", value: "mentalHealthTechnician" },
  { label: "Case Manager", value: "caseManager" },
  { label: "Mental Health Advocate", value: "mentalHealthAdvocate" },
  { label: "Mental Health Researcher", value: "mentalHealthResearcher" }
];

//Years of experience options
const yearsOfExperienceOptions = [
  { label: "1 year", value: "1" },
  { label: "2 years", value: "2" },
  { label: "3 years", value: "3" },
  { label: "5+ years", value: "5" },
  { label: "10+ years", value: "10" }
]

// Preferred contact
const preferredContactOptions =  [
  { label: "Email", value: "email" },
  { label: "Phone Call", value: "phoneCall" },
  { label: "Direct Message", value: "directMessage" },
  { label: "Via video", value: "video" },
]

//Field of expertise
const fieldOfExpertiseOptions = [
  { label: "Psychiatrist", value: "psychiatrist" },
  { label: "Child and Adolescent Psychiatrist", value: "childAdolescentPsychiatrist" },
  { label: "Geriatric Psychiatrist", value: "geriatricPsychiatrist" },
  { label: "Addiction Psychiatrist", value: "addictionPsychiatrist" },
  { label: "Clinical Psychologist", value: "clinicalPsychologist" },
  { label: "Counseling Psychologist", value: "counselingPsychologist" },
  { label: "School Psychologist", value: "schoolPsychologist" },
  { label: "Neuropsychologist", value: "neuropsychologist" },
  { label: "Health Psychologist", value: "healthPsychologist" },
  { label: "Forensic Psychologist", value: "forensicPsychologist" },
  { label: "Licensed Professional Counselor (LPC)", value: "lpc" },
  { label: "Licensed Mental Health Counselor (LMHC)", value: "lmhc" },
  { label: "Licensed Clinical Social Worker (LCSW)", value: "lcsw" },
  { label: "Licensed Marriage and Family Therapist (LMFT)", value: "lmft" },
  { label: "Substance Abuse Counselor", value: "substanceAbuseCounselor" },
  { label: "Addiction Counselor", value: "addictionCounselor" },
  { label: "Behavioral Health Counselor", value: "behavioralHealthCounselor" },
  { label: "Crisis Counselor", value: "crisisCounselor" },
  { label: "Grief Counselor", value: "griefCounselor" },
  { label: "Trauma Therapist", value: "traumaTherapist" },
  { label: "Play Therapist", value: "playTherapist" },
  { label: "Art Therapist", value: "artTherapist" },
  { label: "Music Therapist", value: "musicTherapist" },
  { label: "Dance/Movement Therapist", value: "danceMovementTherapist" },
  { label: "Equine-Assisted Therapist", value: "equineAssistedTherapist" },
  { label: "Peer Support Specialist", value: "peerSupportSpecialist" },
  { label: "Recovery Coach", value: "recoveryCoach" },
  { label: "Mental Health Coach", value: "mentalHealthCoach" },
  { label: "Life Coach", value: "lifeCoach" },
  { label: "Psychiatric Nurse Practitioner (PMHNP)", value: "pmhnp" },
  { label: "Psychiatric Nurse", value: "psychiatricNurse" },
  { label: "Mental Health Technician", value: "mentalHealthTechnician" },
  { label: "School Counselor", value: "schoolCounselor" },
  { label: "Student Mental Health Specialist", value: "studentMentalHealthSpecialist" },
  { label: "Behavioral Health Program Manager", value: "behavioralHealthProgramManager" },
  { label: "Case Manager", value: "caseManager" },
  { label: "Mental Health Advocate", value: "mentalHealthAdvocate" },
  { label: "Mental Health Researcher", value: "mentalHealthResearcher" },
  { label: "Professor of Psychology", value: "professorPsychology" },
  { label: "Mental Health Policy Analyst", value: "mentalHealthPolicyAnalyst" },
  { label: "Mental Health Evaluator", value: "mentalHealthEvaluator" },
  { label: "Competency Evaluator", value: "competencyEvaluator" }
];



export const fieldsByStep: FieldDefinition[][] = [
  [
    { name: "fullName", label: "Full Name", type: "input", placeholder: "John Doe" },
    { name: "title", label: "Professional Title", type: "select",placeholder: "Select your profession title", options: ProfessionalTitleOptions },
    { name: "field", label: "Field of Expertise", type: "select", placeholder: "Select your field of expertise", options: fieldOfExpertiseOptions },
    { name: "experience", label: "Years of Experience", type: "select", placeholder: "Select your experience",
      options: yearsOfExperienceOptions},
  ],

  [
    { name: "languages", label: "Languages Spoken", type: "input", placeholder: "English" },
    { name: "location", label: "Location", type: "input", placeholder: "Nkawkaw, Eastern Region" },
    { name: "preferredContact", label: "Preferred Communication", type: "select",
      placeholder: "Select medium of communication", options: preferredContactOptions,},
    { name: "contact", label: "Contact Info (Optional)", type: "phone", placeholder: "+233 55 892 7360" },
  ],

  [
    { name: "email", label: "Email", type: "input", placeholder: "example123@gmail.com" },
    { name: "avatar", label: "Profile Picture (Optional)", type: "file", placeholder: "Upload picture" },
    { name: "bio", label: "Short Bio", type: "textarea", placeholder: "Tell us bit about your yourself" },
  ],

  [
    { name: "confirmAccuracy", label: "I confirm that the information provided above is accurate to the best of my knowledge.", type: "checkbox", placeholder: "" },
    { name: "understandReview", label: "I understand that my data will be reviewed by the Xolace team for verification purposes.", type: "checkbox", placeholder: "" },
    { name: "agreeTerms", label: "I agree to Xolace’s Privacy Policy and Terms of Use.", type: "checkbox", placeholder: "" },
    { name: "consentProcessing", label: "I consent to Xolace storing and processing my information securely, and contacting me if further verification is required.", type: "checkbox", placeholder: "" },
  ]
];

