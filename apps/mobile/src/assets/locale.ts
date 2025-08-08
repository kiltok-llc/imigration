export default {
  en: {
    translation: {
      back: 'Back',
      error: {
        message:
          'There was an error loading this content:\n<pre>{{message}}</pre>',
        retry: 'Retry',
        title: 'An error occurred',
      },
      next: 'Next',
      no: 'No',
      onboarding: {
        english: 'Select English',
        language: 'Choose your language to get started.',
        spanish: 'Elige español',
        title: 'Welcome to iMigration',
      },
      quiz: {
        back: 'Back',
        continue: 'Continue',
        header: {
          nextTitle: 'Next: {{ nextTitle }}',
          progress: '{{ current }} of {{ total }}',
          title: '{{ title }}',
        },
        missing: 'Please answer all questions before continuing.',
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
              'is-recent': 'Have you arrived in the U.S. within the last year?',
              title: 'Arrival Date',
            },
            'country-of-origin': {
              'is-from-safe-country':
                'Do you come from a country that the U.S. considers “safe” where you could have applied for protection?',
              title: 'Country of Origin',
            },
            description:
              'Complete a short quiz to check if you qualify to apply for asylum.',
            'physical-presence': {
              'is-in-usa': 'Are you currently in the United States?',
              title: 'Physical Presence in the US',
            },
            'previous-applications': {
              'has-previous-app':
                'Have you ever applied for asylum in the United States before?',
              title: 'Previous Applications',
            },
            'reason-for-leaving': {
              // TODO make parentheses lower opacity/size/intensity etc
              'harm-reasons':
                'Was that harm based on one of these reasons?\n(Select all that apply)',
              'is-escaping-harm':
                'Did you leave your home country because you feared harm or persecution?',
              'is-harmed-by-gov':
                'Was the harm caused by your government or by people your government could not control?',
              other: 'Please specify the other reason for leaving',
              reasons: {
                nationality: 'Nationality',
                none: 'None of the above',
                other: 'Other',
                'political-opinion': 'Political Opinion',
                race: 'Race',
                religion: 'Religion',
                'social-group': 'Social Group',
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
                add_child: 'Add Child',
                additional_info_title: 'Additional Information',
                basic_info_title: 'Basic Information',
                birth_city: 'City of Birth',
                birth_country: 'Country of Birth',
                birth_info_title: 'Birth Information',
                child_number: 'Child {{current}} of {{total}}',
                dob: 'Date of Birth',
                ethnicity: 'Race, Ethnicity, or Tribal Group',
                first_name: 'First Name',
                last_name: 'Full Last Name',
                lives_in_us: 'Do they currently live in the United States?',
                middle_name: 'Middle Name',
                nationality: 'Nationality',
                sex: 'Sex',
                sex_options: {
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
                attendance_period_title: 'Attendance Period',
                location_title: 'School Location',
                school_city: 'City',
                school_country: 'Country',
                school_from: 'From when you attended (mm/yyyy)',
                school_level: 'Type (Level) of School',
                school_level_options: {
                  elementary_or_primary: 'Elementary or Primary',
                  secondary: 'Secondary',
                  university: 'University',
                  vocational_technical: 'Vocational/Technical',
                },
                school_name: 'Name of School/College',
                school_state: 'State',
                school_to: 'To when you attended (mm/yyyy)',
                title: 'School Information',
              },
            },
            employment: {
              'employment-history': {
                employer_address: 'Workplace Street Address',
                employer_city: 'City',
                employer_country: 'Country',
                employer_location_title: 'Employer Location',
                employer_name: 'Employer / Company Name',
                employer_state: 'State',
                employment_period_title: 'Employment Period',
                occupation: 'What was/is your occupation?',
                title: 'Employment History',
                work_from: 'From when you worked there (mm/yyyy)',
                work_to: 'To when you worked there (mm/yyyy)',
              },
            },
            'family-status': {
              'marital-and-children': {
                children_title: 'Children Information',
                has_children:
                  'Do you have children (regardless of age, location, or marital status)?',
                marital_status: 'What is your marital status?',
                marital_status_options: {
                  divorced: 'Divorced',
                  married: 'Married',
                  single: 'Single',
                  widowed: 'Widowed',
                },
                number_of_children: 'How many children do you have?',
                title: 'Marital Status and Children',
              },
              'spouse-information': {
                marriage_info_title: 'Marriage Information',
                spouse_city_marriage: 'City Where Married',
                spouse_country_marriage: 'Country Where Married',
                spouse_first_name: "Spouse's First Name",
                spouse_last_name: "Spouse's Full Last Name",
                spouse_marriage_date: 'Marriage Date',
                spouse_middle_name: "Spouse's Middle Name",
                spouse_name_title: 'Spouse Name',
                title: 'Spouse Information',
              },
            },
            'personal-information': {
              'demographics-and-birth': {
                additional_info_title: 'Additional Information (Optional)',
                birth_city: 'City of Birth',
                birth_country: 'Country of Birth',
                birth_location_title: 'Birth Location',
                birth_nationality: 'Nationality at Birth',
                current_nationality: 'Current Nationality (Citizenship)',
                dob: 'Date of Birth',
                ethnicity: 'Race, Ethnicity, or Tribal Group',
                nationality_title: 'Nationality',
                religion: 'Religion',
                sex: 'Sex',
                title: 'Demographics and Birth',
              },
              'language-proficiency': {
                english_proficiency_title: 'English Proficiency',
                native_language:
                  'Native Language (include dialect if applicable)',
                other_languages: 'What other languages do you speak fluently?',
                read_write_english: 'Do you read and write English fluently?',
                read_write_spanish: 'Do you read and write Spanish fluently?',
                spanish_other_languages_title: 'Spanish and Other Languages',
                speak_english: 'Do you speak English fluently?',
                speak_spanish: 'Do you speak Spanish fluently?',
                title: 'Language Proficiency',
              },
              'name-and-aliases': {
                additional_names_title: 'Additional Names',
                alias_name: 'What is or was your alias?',
                alias_title: 'Alias Information',
                first_name: 'First Name',
                last_name: 'Full Last Name',
                maiden_name: 'Maiden Name',
                middle_name: 'Middle Name',
                other_names: 'What other names or surnames have you used?',
                title: 'Name and Aliases',
                used_alias: 'Have you used an alias?',
              },
            },
            residence: {
              'current-address': {
                apartment_number: 'Unit Number',
                apartment_unit: 'Is this a Department/Apartment or Unit?',
                city: 'City',
                location_title: 'Location',
                state: 'State',
                street_address: 'Street Number and Name',
                title: 'Current Address',
                zip_code: 'ZIP Code',
              },
              'us-residence-status': {
                lives_in_us: 'Do you currently live in the United States?',
                title: 'US Residence Status',
                us_residence_requirement:
                  'You must be living in the United States to submit this form.',
              },
            },
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
      yes: 'Yes',
    },
  },
  es: {
    translation: {},
  },
};
