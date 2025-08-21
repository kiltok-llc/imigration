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
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import {
  DEFAULT_NAME,
  FormNameInput,
  NameSchema,
} from '@/components/form/name';
import { FormBooleanInput } from '@/components/form/radio';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { QuizPage, QuizPageHandle } from '@/components/quiz/page';
import { QuizScreen } from '@/components/quiz/screen';
import {
  parentAddressAtom,
  parentAliveAtom,
  parentBirthLocation,
  parentNameAtom,
} from '@/lib/data/parent';
import { DEFAULT_ADDRESS } from '@/lib/data/schema';
import { nameAtom } from '@/lib/data/user';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

type ParentPageProps = {
  parent: string;
};

export default function ParentDetails() {
  return (
    <QuizScreen>
      {['father', 'mother'].map((parent) => (
        <ParentPage key={parent} parent={parent} />
      ))}
    </QuizScreen>
  );
}

const ParentPage = forwardRef<QuizPageHandle, ParentPageProps>(
  function ParentPage({ parent }, ref) {
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
              ...DEFAULT_NAME,
              last: lastName,
            },
          }}
          onSubmit={({ alive, birthLocation, currentLocation, name }) => {
            setName(name);
            setBirthLocation(birthLocation);
            setAlive(alive);
            setAddressAtom(currentLocation ?? DEFAULT_ADDRESS);

            return true;
          }}
          pageId='parent'
          pageKey={parent}
          ref={ref}
          schema={z.object({
            alive: required(z.boolean().nullable()),
            birthLocation: FormShortAddressSchema,
            currentLocation: FormAddressWithCountrySchema.optional(),
            name: NameSchema,
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

              <ConditionalFormFieldBlock
                active={!!watch('alive')}
                activeValue={DEFAULT_FORM_ADDRESS_WITH_COUNTRY}
                control={control}
                name='currentLocation'
              >
                <QuizFieldTitle variant='titleLarge' />
                <FormAddressWithCountryInput
                  lens={lens.focus('currentLocation')}
                />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>
      </TranslationContextProvider>
    );
  }
);
