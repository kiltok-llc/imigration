export default {
  en: {
    translation: {
      error: {
        message:
          'There was an error loading this content:\n<pre>{{message}}</pre>',
        retry: 'Retry',
        title: 'An error occurred',
      },
      form: {
        address: {
          city: 'City',
          state: 'State',
          street: 'Street address',
          unit: 'Apt, suite, unit, etc.',
          'zip-code': 'ZIP Code',
        },
        boolean: {
          no: 'No',
          yes: 'Yes',
        },
        name: {
          first: 'First Name',
          last: 'Last Name',
          middle: 'Middle Name',
        },
        optional: ' (optional)',
        range: {
          end: 'End Date',
          start: 'Start Date',
        },
        required: ' *',
        sex: {
          female: 'Female',
          male: 'Male',
        },
      },
      next: 'Next',
      onboarding: {
        english: 'Select English',
        language: 'Choose your language to get started.',
        spanish: 'Elige español',
        title: 'Welcome to iMigration',
      },
      previous: 'Back',
      quiz: {
        header: {
          nextTitle: 'Next: {{ nextTitle }}',
          progress: '{{ current }} of {{ total }}',
          title: '{{ title }}',
        },
        missing: 'Please answer all questions before continuing.',
        next: 'Continue',
        previous: 'Back',
      },
      services: {
        asylum: 'Asylum',
        b2: {
          subtitle: 'B-2 Visitor Visa Application',
          title: 'Visitor Visa',
        },
        categories: {
          education: {
            title: 'Education',
          },
          family: {
            title: 'Family',
          },
          residency: {
            title: 'Residency',
          },
          title: 'Categories',
          work: {
            title: 'Work',
          },
        },
        i589: {
          appeal: {
            description:
              'Submit an appeal to reopen or review your case if your application is denied.',
            title: 'Appeal',
          },
          decision: {
            description:
              'Receive the official determination on your asylum application.',
            title: 'Decision',
          },
          documents: {
            description:
              'Upload required identity documents (e.g., passport, birth certificate).',
            title: 'Documents',
          },
          eligibility: {
            'arrival-date': {
              'is-recent-arrival': {
                'is-recent-arrival': {
                  title: 'Have you arrived in the U.S. within the last year?',
                },
              },
              title: 'Arrival Date',
            },
            'country-of-origin': {
              'is-from-safe-country': {
                'is-from-safe-country': {
                  title:
                    'Do you come from a country that the U.S. considers “safe” where you could have applied for protection?',
                },
              },
              title: 'Country of Origin',
            },
            description:
              'Complete a short quiz to check if you qualify to apply for asylum.',
            'physical-presence': {
              'is-in-usa': {
                'is-in-usa': {
                  title: 'Are you currently in the United States?',
                },
              },
              title: 'Physical Presence in the US',
            },
            'previous-applications': {
              'has-previous-app': {
                'has-previous-app': {
                  title:
                    'Have you ever applied for asylum in the United States before?',
                },
              },
              title: 'Previous Applications',
            },
            'reason-for-leaving': {
              'harm-reasons': {
                'custom-harm-reason': {
                  label: 'Please specify the other reason for leaving',
                },
                'harm-reasons': {
                  options: {
                    nationality: 'Nationality',
                    none: 'None of the above',
                    other: 'Other',
                    'political-opinion': 'Political Opinion',
                    race: 'Race',
                    religion: 'Religion',
                    'social-group': 'Social Group',
                  },
                  // TODO make parentheses lower opacity/size/intensity etc
                  title:
                    'Was that harm based on one of these reasons?\n(Select all that apply)',
                },
              },
              'is-escaping-harm': {
                'is-escaping-harm': {
                  title:
                    'Did you leave your home country because you feared harm or persecution?',
                },
              },
              'is-harmed-by-gov': {
                'is-harmed-by-gov': {
                  title:
                    'Was the harm caused by your government or by people your government could not control?',
                },
              },
              title: 'Reason for Leaving',
            },
            screenTitle: 'Asylum Eligibility Assessment',
            title: 'Eligibility',
          },
          eligible: {
            continueButton: 'Continue to Application',
            description:
              'Based on your answers, you appear to be eligible to apply for asylum in the United States.',
            nextSteps:
              'You can now proceed with your I-589 application for asylum. The following steps will guide you through the process.',
            screenTitle: 'Eligibility Confirmed',
            title: 'You May Be Eligible for Asylum',
          },
          ineligible: {
            alternatives:
              'You may want to consult with an immigration attorney to explore other immigration options that might be available to you.',
            backButton: 'Return to Services',
            description:
              'Based on your answers, you may not be eligible to apply for asylum in the United States at this time.',
            screenTitle: 'Eligibility Results',
            title: 'You May Not Be Eligible for Asylum',
          },
          info: {
            'asylum-and-fear': {
              'asylum-reasons-and-fear': {
                'detailed-harm-reasons': {
                  'custom-harm-reason': {
                    label: 'Please specify the other reason',
                  },
                  'harm-reasons': {
                    options: {
                      nationality: 'Nationality',
                      none: 'None of the above',
                      other: 'Other',
                      'political-opinion': 'Political Opinion',
                      race: 'Race',
                      religion: 'Religion',
                      'social-group': 'Social Group',
                    },
                    title:
                      'What are the detailed reasons for the harm you fear? (Select all that apply)',
                  },
                },
                'fear-description': {
                  'fear-description': {
                    label: 'Fear Description',
                    title:
                      'Please describe in detail what you fear will happen if you return to your home country.',
                  },
                },
                'fear-of-return': {
                  'fear-of-return': {
                    title: 'Do you fear returning to your home country?',
                  },
                },
                'other-country-fear': {
                  'has-other-country-fear': {
                    title: 'Do you fear persecution in any other country?',
                  },
                },
                'persecution-description': {
                  'persecution-description': {
                    label: 'Persecution Description',
                    title:
                      'Please describe in detail the persecution you experienced or fear.',
                  },
                },
                title: 'Asylum Reasons and Fear',
              },
            },
            children: {
              'children-details': {
                'add-child': 'Add Child',
                'additional-info-title': 'Additional Information',
                'basic-info-title': 'Basic Information',
                'birth-city': 'City of Birth',
                'birth-country': 'Country of Birth',
                'birth-info-title': 'Birth Information',
                child: {
                  dob: {
                    label: 'Date of Birth',
                    title: "What is the child's date of birth?",
                    title_named: "What is {{ name }}'s date of birth?",
                  },
                  ethnicity: {
                    label: 'Ethnicity',
                    title: "What is the child's ethnicity?",
                    title_named: "What is {{ name }}'s ethnicity?",
                  },
                  'lives-in-usa': {
                    title:
                      'Does this child currently live in the United States?',
                    title_named:
                      'Does {{ name }} currently live in the United States?',
                  },
                  name: {
                    title: "What is the child's name?",
                  },
                  sex: {
                    title: "What is the child's sex?",
                    title_named: "What is {{ name }}'s sex?",
                  },
                  title: 'Child {{ current }} of {{ total }}',
                  title_named: 'Child {{ current }} of {{ total }}: {{ name }}',
                },
                'child-number': 'Child {{current}} of {{total}} details',
                dob: 'Date of Birth',
                ethnicity: 'Race, Ethnicity, or Tribal Group',
                'lives-in-us': 'Do they currently live in the United States?',
                nationality: 'Nationality',
                sex: 'Sex',
                'sex-options': {
                  female: 'Female',
                  male: 'Male',
                },
                title: 'Children Details',
              },
            },
            declaration: {
              'final-declaration': {
                'information-accuracy': {
                  'information-accurate': {
                    title:
                      'I certify that the information I have provided in this application is true and correct to the best of my knowledge.',
                  },
                },
                'interpreter-needed': {
                  'interpreter-language': {
                    label: 'Interpreter Language',
                    title: 'What language do you need an interpreter for?',
                  },
                  'needs-interpreter': {
                    title: 'Do you need an interpreter for your interview?',
                  },
                },
                signature: {
                  'applicant-signature': {
                    label: 'Full Name (Signature)',
                    title:
                      'Please type your full name as your electronic signature.',
                  },
                  'signature-date': {
                    label: 'Date',
                    title: 'Date of signature',
                  },
                },
                title: 'Final Declaration',
                'understands-consequences': {
                  'understands-consequences': {
                    title:
                      'I understand that any false information may result in denial of my application or other legal consequences.',
                  },
                },
              },
            },
            description:
              'Enter your personal details such as name, date of birth, and nationality.',
            education: {
              'school-information': {
                'attendance-period': {
                  end: {
                    label: 'End Date',
                  },
                  start: {
                    label: 'Start Date',
                  },
                  title: 'When did you attend this school?',
                },
                'basic-school-info': {
                  'school-level': {
                    options: {
                      primary: 'Elementary or Primary',
                      secondary: 'Secondary',
                      university: 'University',
                      vocational: 'Vocational/Technical',
                    },
                    title:
                      'What is the highest level of education you completed?',
                  },
                  'school-name': {
                    label: 'Name of School/College',
                    title:
                      'What is the name of last school or college you attended?',
                  },
                },
                'school-location': {
                  'school-city': {
                    title: 'City',
                  },
                  'school-country': {
                    title: 'Country',
                  },
                  'school-state': {
                    title: 'State',
                  },
                  title: 'School Location',
                },
                title: 'School Information',
              },
            },
            employment: {
              'employment-history': {
                'basic-employment-info': {
                  'employer-name': {
                    label: 'Employer or Company Name',
                    title:
                      'What is the name of your current or most recent employer?',
                  },
                  occupation: {
                    label: 'Occupation',
                    title: 'What was/is your occupation?',
                  },
                },
                'employer-location': {
                  'employer-address': {
                    title: 'Workplace Street Address',
                  },
                  'employer-city': {
                    title: 'City',
                  },
                  'employer-country': {
                    title: 'Country',
                  },
                  'employer-state': {
                    title: 'State',
                  },
                  title: 'Employer Location',
                },
                'employment-period': {
                  title: 'During what period did you work at your employer?',
                },
                title: 'Employment History',
              },
            },
            'family-status': {
              'marital-and-children': {
                'children-information': {
                  'has-children': {
                    title:
                      'Do you have children (regardless of age, location, or marital status)?',
                  },
                  'number-of-children': {
                    label: 'Number of Children',
                    title: 'How many children do you have?',
                  },
                  title: 'Children Information',
                },
                'marital-status': {
                  'marital-status': {
                    options: {
                      divorced: 'Divorced',
                      married: 'Married',
                      single: 'Single',
                      widowed: 'Widowed',
                    },
                    title: 'What is your marital status?',
                  },
                },
                title: 'Family Status',
              },
              'spouse-information': {
                'marriage-information': {
                  city: {
                    label: 'City Where Married',
                  },
                  country: {
                    label: 'Country Where Married',
                  },
                  date: {
                    label: 'Marriage Date',
                  },
                  title:
                    'Please provide the following information about your current or most recent marriage.',
                },
                'spouse-name': {
                  title: "Please provide your spouse's name.",
                },
                title: 'Spouse Information',
              },
            },
            identification: {
              'other-identification': {
                'drivers-license-details': {
                  number: {
                    label: 'License Number',
                    title: "What is your driver's license number?",
                  },
                  state: {
                    label: 'State/Province',
                    title:
                      "Which state or province issued your driver's license?",
                  },
                },
                'has-drivers-license': {
                  'has-drivers-license': {
                    title: "Do you have a driver's license?",
                  },
                },
                'social-security': {
                  'has-ssn': {
                    title: 'Do you have a Social Security Number?',
                  },
                  'ssn-number': {
                    label: 'Social Security Number',
                    title: 'What is your Social Security Number?',
                  },
                },
                title: 'Other Identification',
              },
              'passport-information': {
                'has-passport': {
                  'has-passport': {
                    title: 'Do you have a passport?',
                  },
                },
                'passport-dates': {
                  expiration: {
                    label: 'Expiration Date',
                    title: 'When does your passport expire?',
                  },
                  issue: {
                    label: 'Issue Date',
                    title: 'When was your passport issued?',
                  },
                },
                'passport-details': {
                  country: {
                    label: 'Issuing Country',
                    title: 'Which country issued your passport?',
                  },
                  number: {
                    label: 'Passport Number',
                    title: 'What is your passport number?',
                  },
                },
                title: 'Passport Information',
              },
            },
            'legal-history': {
              'legal-and-affiliations': {
                'arrest-history': {
                  'arrest-details': {
                    label: 'Arrest Details',
                    title: 'Please provide details about your arrest history.',
                  },
                  'has-arrest-history': {
                    title: 'Have you ever been arrested or detained?',
                  },
                },
                'military-details': {
                  'military-details': {
                    label: 'Military Service Details',
                    title:
                      'Please provide details about your military service.',
                  },
                },
                'military-service': {
                  'has-military-service': {
                    title:
                      'Have you ever served in the military or armed forces?',
                  },
                },
                'organization-details': {
                  'organization-details': {
                    label: 'Organization Details',
                    title:
                      'Please provide details about your organizational memberships.',
                  },
                },
                'organization-membership': {
                  'has-organization-membership': {
                    title:
                      'Have you ever been a member of any organization, association, fund, foundation, party, club, society, or similar group?',
                  },
                },
                'political-affiliation': {
                  'has-political-affiliation': {
                    title:
                      'Have you ever been affiliated with any political organization or party?',
                  },
                },
                'political-details': {
                  'political-details': {
                    label: 'Political Affiliation Details',
                    title:
                      'Please provide details about your political affiliations.',
                  },
                },
                title: 'Legal History and Affiliations',
              },
            },
            'personal-information': {
              'demographics-and-birth': {
                'additional-info': {
                  ethnicity: {
                    label: 'Race, Ethnicity, or Tribal Group',
                    title: 'What is your ethnicity?',
                  },
                  religion: {
                    label: 'Religion',
                    title: 'What is your religion?',
                  },
                  title: 'Additional Information',
                },
                'basic-demographics': {
                  dob: {
                    label: 'Date of Birth',
                    title: 'When were you born?',
                  },
                  sex: {
                    title: 'What is your sex?',
                  },
                },
                'birth-location': {
                  'birth-city': {
                    label: 'City of Birth',
                    title: 'In which city were you born?',
                  },
                  'birth-country': {
                    label: 'Country of Birth',
                    title: 'In which country were you born?',
                  },
                },
                nationality: {
                  'birth-nationality': {
                    label: 'Nationality at Birth',
                    title: 'What was your nationality at birth?',
                  },
                  'current-nationality': {
                    label: 'Current Nationality',
                    title: 'What is your current nationality? (Citizenship)',
                  },
                },
                title: 'Demographics and Birth',
              },
              'language-proficiency': {
                'english-proficiency': {
                  'read-write-english': {
                    title: 'Do you read and write English?',
                  },
                  'speak-english': {
                    title: 'Do you speak English fluently?',
                  },
                },
                'native-language': {
                  'native-language': {
                    label: 'Native Language',
                    title: 'What is your native language?',
                  },
                },
                'other-languages': {
                  'other-languages': {
                    label: 'Other Languages',
                    title: 'Which other languages do you speak fluently?',
                  },
                },
                'spanish-proficiency': {
                  'read-write-spanish': {
                    title: 'Do you read and write Spanish?',
                  },
                  'speak-spanish': {
                    title: 'Do you speak Spanish fluently?',
                  },
                },
                title: 'Language Proficiency',
              },
              'name-and-aliases': {
                'additional-names': {
                  'maiden-name': {
                    label: 'Maiden Name',
                  },
                  'other-names': {
                    label: 'Other Names',
                  },
                  title: 'What other names or surnames have you used?',
                },
                'additional-names-title': 'Additional Names',
                'alias-information': {
                  'alias-name': {
                    label: 'What is or was your alias?',
                  },
                  'has-alias': {
                    title: 'Have you used an alias?',
                  },
                },
                'basic-names': {
                  title: 'What is your full name?',
                },
                title: 'Names and Aliases',
              },
            },
            residence: {
              'current-address': {
                address: {
                  title: 'Current Address',
                },
                title: 'Current Address',
              },
              'us-residence-status': {
                title: 'US Residence Status',
                'us-residence-status': {
                  'lives-in-us': {
                    title: 'Do you currently live in the United States?',
                  },
                  'us-residence-requirement':
                    'You must be living in the United States to submit this form.',
                },
              },
            },
            screenTitle: 'Personal Information',
            title: 'Personal Info',
          },
          interview: {
            description:
              'Attend your scheduled asylum interview with an officer or judge.',
            title: 'Interview',
          },
          progress: {
            screenTitle: 'Application Progress',
          },
          review: {
            description:
              'Verify that all your answers and uploads are complete and accurate.',
            title: 'Review',
          },
          subtitle: 'I-589 Application for Asylum',
          title: 'Asylum',
          waiting: {
            description:
              'Track the status of your application while it is under review.',
            title: 'Wait',
          },
        },
        i765: {
          subtitle: 'I-765 Application for Employment Authorization',
          title: 'Work Permit',
        },
        popular: 'Popular Services',
        screenTitle: 'Services',
        searchPlaceholder: 'Search services...',
        title: 'iMigration Services',
      },
    },
  },
  es: {
    translation: {},
  },
};
