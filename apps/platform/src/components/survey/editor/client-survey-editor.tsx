'use client';

import { Json } from '@repo/supabase/database.types';
import { useEffect, useRef, useState } from 'react';
import 'survey-core/survey-core.css';
import 'survey-creator-core/survey-creator-core.css';
// Enable Ace Editor in the JSON Editor tab
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-searchbox';
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';

import { supabase } from '@/lib/supabase/client';
import { Survey } from '@/queries/survey';

export default function ClientSurveyEditor({ survey }: { survey: Survey }) {
  const [creator] = useState<SurveyCreator>(() => {
    const creator = new SurveyCreator({
      autoSaveEnabled: true,
      showTranslationTab: true,
    });

    creator.saveSurveyFunc = async (
      saveNumber: number,
      callback: (saveNumber: number, status: boolean) => void
    ) => {
      const { error } = await supabase
        .from('surveys')
        .update({ json: creator.JSON as Json })
        .eq('id', survey.id);

      if (error) {
        console.error('Error saving survey:', error);
      }

      callback(saveNumber, true);
    };

    creator.JSON = survey.json;
    return creator;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className='h-full w-full' ref={containerRef}>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
