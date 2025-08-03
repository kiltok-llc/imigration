import { useAtomValue, useSetAtom } from 'jotai';
import { forwardRef } from 'react';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS_WITH_COUNTRY,
  DEFAULT_FORM_SHORT_ADDRESS,
  FormAddressWithCountryInput,
  FormAddressWithCountrySchema,
  FormShortAddressInput,
  FormShortAddressSchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import {
  DEFAULT_FORM_NAME,
  FormNameInput,
  FormNameSchema,
} from '@/components/form/name';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import {
  QuizPage,
  QuizPageHandle,
  QuizPageProps,
} from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import {
  parentAddressAtom,
  parentAliveAtom,
  parentBirthLocation,
  parentNameAtom,
} from '@/lib/data/parent';
import { DEFAULT_ADDRESS } from '@/lib/data/schema';
import { nameAtom } from '@/lib/data/user';
import { TranslationContextProvider } from '@/lib/translation';
import { required } from '@/lib/utils';

export default function ParentDetails() {
  return (
    <QuizScreen>
      {['father', 'mother'].map((parent) => (
        <ParentPage key={parent} pageId='parent' parent={parent} />
      ))}
    </QuizScreen>
  );
}

const ParentPage = forwardRef<
  QuizPageHandle,
  QuizPageProps & { parent: string }
>(function ParentPage({ pageId, parent }, ref) {
  const setAlive = useSetAtom(parentAliveAtom(parent));
  const setAddressAtom = useSetAtom(parentAddressAtom(parent));
  const setBirthLocation = useSetAtom(parentBirthLocation(parent));
  const setName = useSetAtom(parentNameAtom(parent));
  const lastName = useAtomValue(nameAtom).last;

  return (
    <TranslationContextProvider
      value={{ context: parent === 'mother' ? 'female' : 'male' }}
    >
      <QuizPage
        defaultValues={{
          alive: null,
          birthLocation: DEFAULT_FORM_SHORT_ADDRESS,
          name: {
            ...DEFAULT_FORM_NAME,
            last: lastName,
          },
        }}
        onSuccess={({ alive, birthLocation, currentLocation, name }) => {
          setName(name);
          setBirthLocation(birthLocation);
          setAlive(alive);
          setAddressAtom(currentLocation ?? DEFAULT_ADDRESS);
        }}
        pageId={pageId}
        pageKey={parent}
        ref={ref}
        schema={z.object({
          alive: required(z.boolean().nullable()),
          birthLocation: FormShortAddressSchema,
          currentLocation: FormAddressWithCountrySchema.optional(),
          name: FormNameSchema,
        })}
      >
        {({ control, lens, watch }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name='name' variant='titleLarge' />
              <FormNameInput lens={lens.focus('name')} />
            </FormBlock>

            <FormBlock>
              <QuizFieldTitle name='birth-location' variant='titleLarge' />
              <FormShortAddressInput lens={lens.focus('birthLocation')} />
            </FormBlock>

            <FormBlock>
              <FormField control={control} name='alive'>
                <QuizFieldTitle />
                <FormBooleanInput />
              </FormField>
            </FormBlock>

            <ConditionalFormWrapper
              active={!!watch('alive')}
              activeValue={DEFAULT_FORM_ADDRESS_WITH_COUNTRY}
              control={control}
              name='currentLocation'
            >
              <FormBlock animated>
                <QuizFieldTitle variant='titleLarge' />
                <FormAddressWithCountryInput
                  lens={lens
                    .focus('currentLocation')
                    .narrow<z.input<typeof FormAddressWithCountrySchema>>()}
                />
              </FormBlock>
            </ConditionalFormWrapper>
          </>
        )}
      </QuizPage>
    </TranslationContextProvider>
  );
});
