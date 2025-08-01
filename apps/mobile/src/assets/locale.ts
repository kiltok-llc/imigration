export default {
  en: {
    translation: {
      error: {
        message:
          'There was an error loading this content:\n<pre>{{message}}</pre>',
        retry: 'Retry',
        title: 'An error occurred',
      },
      next: 'Next',
      no: 'No',
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
        i589: {
          appeal: {
            description:
              'Submit an appeal to reopen or review your case if your application is denied.',
            stepTitle: 'Appeal',
          },
          decision: {
            description:
              'Receive the official determination on your asylum application.',
            stepTitle: 'Decision',
          },
          documents: {
            description:
              'Upload required identity documents (e.g., passport, birth certificate).',
            stepTitle: 'Documents',
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
            'criminal-history': {
              'has-criminal-history':
                'Have you ever been convicted of a serious crime?',
              title: 'Criminal Convictions',
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
            stepTitle: 'Eligibility',
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
          interview: {
            description:
              'Attend your scheduled asylum interview with an officer or judge.',
            stepTitle: 'Interview',
          },
          'personal-info': {
            description:
              'Enter your personal details such as name, date of birth, and nationality.',
            stepTitle: 'Personal Info',
          },
          progress: {
            screenTitle: 'Application Progress',
          },
          review: {
            description:
              'Verify that all your answers and uploads are complete and accurate.',
            stepTitle: 'Review',
          },
          waiting: {
            description:
              'Track the status of your application while it is under review.',
            stepTitle: 'Wait',
          },
        },
      },
      yes: 'Yes',
    },
  },
  es: {
    translation: {},
  },
};
