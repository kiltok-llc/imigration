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
        boolean: {
          no: 'No',
          yes: 'Yes',
        },
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
                }
              },
              title: 'Arrival Date',
            },
            'country-of-origin': {
              'is-from-safe-country': {
                'is-from-safe-country': {
                  title: 'Do you come from a country that the U.S. considers “safe” where you could have applied for protection?',
                }
              },
              title: 'Country of Origin',
            },
            description:
              'Complete a short quiz to check if you qualify to apply for asylum.',
            'physical-presence': {
              'is-in-usa': {
                'is-in-usa': {
                  title: 'Are you currently in the United States?'
                },
              },
              title: 'Physical Presence in the US',
            },
            'previous-applications': {
              'has-previous-app': {
                'has-previous-app': {
                  title: 'Have you ever applied for asylum in the United States before?'
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
                  title: 'Was that harm based on one of these reasons?\n(Select all that apply)'
                },
              },
              'is-escaping-harm': {
                'is-escaping-harm': {
                  title: 'Did you leave your home country because you feared harm or persecution?'
                },
              },
              'is-harmed-by-gov': {
                'is-harmed-by-gov': {
                  title: 'Was the harm caused by your government or by people your government could not control?'
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
            children: {
              'children-details': {
                'add-child': 'Add Child',
                'additional-info-title': 'Additional Information',
                'basic-info-title': 'Basic Information',
                'birth-city': 'City of Birth',
                'birth-country': 'Country of Birth',
                'birth-info-title': 'Birth Information',
                'child-number': 'Child {{current}} of {{total}}',
                dob: 'Date of Birth',
                ethnicity: 'Race, Ethnicity, or Tribal Group',
                'first-name': 'First Name',
                'last-name': 'Last Name',
                'lives-in-us': 'Do they currently live in the United States?',
                'middle-name': 'Middle Name',
                nationality: 'Nationality',
                sex: 'Sex',
                'sex-options': {
                  female: 'Female',
                  male: 'Male',
                },
                title: 'Children Details',
              },
            },
            description:
              'Enter your personal details such as name, date of birth, and nationality.',
            education: {
              'school-information': {
                'attendance-period-title': 'Attendance Period',
                'location-title': 'School Location',
                'school-city': 'City',
                'school-country': 'Country',
                'school-from': 'From when you attended (mm/yyyy)',
                'school-level': 'Type (Level) of School',
                'school-level-options': {
                  'elementary-or-primary': 'Elementary or Primary',
                  secondary: 'Secondary',
                  university: 'University',
                  'vocational-technical': 'Vocational/Technical',
                },
                'school-name': 'Name of School/College',
                'school-state': 'State',
                'school-to': 'To when you attended (mm/yyyy)',
                title: 'School Information',
              },
            },
            employment: {
              'employment-history': {
                'employer-address': 'Workplace Street Address',
                'employer-city': 'City',
                'employer-country': 'Country',
                'employer-location-title': 'Employer Location',
                'employer-name': 'Employer / Company Name',
                'employer-state': 'State',
                'employment-period-title': 'Employment Period',
                occupation: 'What was/is your occupation?',
                title: 'Employment History',
                'work-from': 'From when you worked there (mm/yyyy)',
                'work-to': 'To when you worked there (mm/yyyy)',
              },
            },
            'family-status': {
              'marital-and-children': {
                'children-title': 'Children Information',
                'has-children':
                  'Do you have children (regardless of age, location, or marital status)?',
                'marital-status': 'What is your marital status?',
                'marital-status-options': {
                  divorced: 'Divorced',
                  married: 'Married',
                  single: 'Single',
                  widowed: 'Widowed',
                },
                'number-of-children': 'How many children do you have?',
                title: 'Marital Status and Children',
              },
              'spouse-information': {
                'marriage-info-title': 'Marriage Information',
                'spouse-city-marriage': 'City Where Married',
                'spouse-country-marriage': 'Country Where Married',
                'spouse-first-name': "Spouse's First Name",
                'spouse-last-name': "Spouse's Full Last Name",
                'spouse-marriage-date': 'Marriage Date',
                'spouse-middle-name': "Spouse's Middle Name",
                'spouse-name-title': 'Spouse Name',
                title: 'Spouse Information',
              },
            },
            'personal-information': {
              'demographics-and-birth': {
                'additional-info': {
                  title: 'Additional Information',
                },
                'basic-demographics': {
                  dob: {
                    label: 'Date of Birth',
                    title: 'When were you born?',
                  },
                  sex: {
                    title: 'What is your sex?',
                  }
                },
                'birth-location': {
                  'birth-city': {
                    label: 'City of Birth',
                    title: 'In which city were you born?'
                  },
                  'birth-country': {
                    label: 'Country of Birth',
                    title: 'In which country were you born?'
                  },
                },
                'birth-location-title': 'Birth Location',
                dob: 'Date of Birth',
                ethnicity: 'Race, Ethnicity, or Tribal Group',
                nationality: {
                  'birth-nationality': {
                    label: 'Nationality at Birth',
                    title: 'What was your nationality at birth?'
                  },
                  'current-nationality': {
                    label: 'Current Nationality',
                    title: 'What is your current nationality? (Citizenship)'
                  },
                },
                'nationality-title': 'Nationality',
                religion: 'Religion',
                title: 'Demographics and Birth',
              },
              'language-proficiency': {
                'english-proficiency-title': 'English Proficiency',
                'native-language':
                  'Native Language (include dialect if applicable)',
                'other-languages':
                  'What other languages do you speak fluently?',
                'read-write-english': 'Do you read and write English fluently?',
                'read-write-spanish': 'Do you read and write Spanish fluently?',
                'spanish-other-languages-title': 'Spanish and Other Languages',
                'speak-english': 'Do you speak English fluently?',
                'speak-spanish': 'Do you speak Spanish fluently?',
                title: 'Language Proficiency',
              },
              'name-and-aliases': {
                'additional-names': {
                  'maiden-name': {
                    label: 'Maiden Name'
                  },
                  'other-names': {
                    label: 'Other Names',
                  },
                  title: 'What other names or surnames have you used?',
                },
                'additional-names-title': 'Additional Names',
                'alias-information': {
                  'alias-name': {
                    label: 'What is or was your alias?'
                  },
                  'has-alias': {
                    title: 'Have you used an alias?'
                  },
                },
                'basic-names': {
                  'first-name': {
                    label: 'First Name'
                  },
                  'last-name': {
                    label: 'Last Name'
                  },
                  'middle-name': {
                    label: 'Middle Name'
                  },
                  title: 'What is your full name?',
                },
                title: 'Names and Aliases',
              },
            },
            residence: {
              'current-address': {
                'apartment-number': 'Unit Number',
                'apartment-unit': 'Is this a Department/Apartment or Unit?',
                city: 'City',
                'location-title': 'Location',
                state: 'State',
                'street-address': 'Street Number and Name',
                title: 'Current Address',
                'zip-code': 'ZIP Code',
              },
              'us-residence-status': {
                'lives-in-us': 'Do you currently live in the United States?',
                title: 'US Residence Status',
                'us-residence-requirement':
                  'You must be living in the United States to submit this form.',
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
