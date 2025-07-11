import { Stack, useRouter } from 'expo-router';
import { Suspense, useCallback } from 'react';
import { SafeAreaView, View } from 'react-native';
import tw from 'twrnc';

import { SurveyWrapper } from '@/components/survey';
import { SurveyProvider } from '@/components/survey/context';
import { SurveyLoader } from '@/components/survey/load';
import { useSurveyTitle } from '@/components/survey/title';
import { useSuspenseQuery } from '@/hooks/use-rn-query';
import { surveyQueryOptions } from '@/queries/survey';

const I589_SURVEY_ID = '448ce721-8c3c-4b20-9d6e-267b266c1eab';

export default function I589SurveyScreen() {
  const title = useSurveyTitle();

  return (
    <>
      <Stack.Screen options={{ title }} />
      <View style={tw`flex-1`}>
        <SafeAreaView />
        <SurveyProvider>
          <SurveyLoader>
            {/* SurveyLoader will handle the loading state */}
            <Suspense>
              <Survey />
            </Suspense>
          </SurveyLoader>
        </SurveyProvider>
      </View>
    </>
  );
}

function Survey() {
  const { data: survey } = useSuspenseQuery(surveyQueryOptions(I589_SURVEY_ID));
  const router = useRouter();

  const handleComplete = useCallback(
    async (_data: unknown) => {
      router.replace('./complete');
      return true;
    },
    [router]
  );

  return <SurveyWrapper onComplete={handleComplete} survey={survey} />;
}
