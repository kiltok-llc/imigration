import { useAtom, useSetAtom } from 'jotai';
import z from 'zod/v4';

import {
  DEFAULT_FORM_ADDRESS,
  EXAMPLE_ADDRESS_WITH_COUNTRY,
  EXAMPLE_INTERNATIONAL_ADDRESS_WITH_COUNTRY,
  FormAddressWithCountryInput,
  FormAddressWithCountrySchema,
} from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { FormField } from '@/components/form/field';
import { FormArray, FormArrayItems } from '@/components/form/fieldarray';
import { FormRadioGroup, FormRadioItem } from '@/components/form/radio';
import {
  DEFAULT_FORM_RANGE,
  EXAMPLE_RANGE,
  FormRangeInput,
  FormRangeSchema,
} from '@/components/form/range';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import { QuizFormPage } from '@/components/quiz/form-page';
import {
  QuizFieldDescription,
  QuizFieldTitle,
  QuizPageDescription,
  QuizPageTitle,
} from '@/components/quiz/label';
import { QuizScreen } from '@/components/quiz/screen';
import { addressesAtom, persecutionCountryAtom } from '@/lib/data/user';

export default function PreviousAddresses() {
  const [addresses, setAddresses] = useAtom(addressesAtom);
  const setPersecutionCountry = useSetAtom(persecutionCountryAtom);
  const persecutionCountries = [
    ...new Set(
      addresses
        .map(({ country }) => country)
        .filter((country) => country !== 'USA')
    ),
  ];

  return (
    <QuizScreen>
      <QuizFormPage
        defaultValues={{
          residences: [],
        }}
        onSuccess={({ residences }) => {
          setAddresses(([first]) => [
            first!,
            ...residences.map(({ address, range }) => ({
              ...address,
              ...range,
            })),
          ]);
        }}
        pageId='past-residences'
        sampleData={{
          example: {
            residences: [
              {
                address: EXAMPLE_ADDRESS_WITH_COUNTRY,
                range: EXAMPLE_RANGE,
              },
              {
                address: EXAMPLE_INTERNATIONAL_ADDRESS_WITH_COUNTRY,
                range: EXAMPLE_RANGE,
              },
            ],
          },
        }}
        schema={z.object({
          residences: z
            .array(
              z.object({
                address: FormAddressWithCountrySchema,
                range: FormRangeSchema,
              })
            )
            .nonempty(),
        })}
      >
        {({ control, lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
              <QuizPageDescription />
            </FormBlock>

            <FormArray control={control} name='residences'>
              <FormArrayItems>
                {(idx) => (
                  <FormBlock>
                    <QuizFieldArrayItemHeader />
                    <FormAddressWithCountryInput
                      lens={lens.focus(`residences.${idx}.address`)}
                    />
                    <FormRangeInput
                      lens={lens.focus(`residences.${idx}.range`)}
                    />
                  </FormBlock>
                )}
              </FormArrayItems>
              <QuizFieldArrayAdd
                value={{
                  address: DEFAULT_FORM_ADDRESS,
                  range: DEFAULT_FORM_RANGE,
                }}
              />
            </FormArray>
          </>
        )}
      </QuizFormPage>

      <QuizFormPage
        defaultValues={{
          country: '',
        }}
        onSuccess={({ country }) => setPersecutionCountry(country)}
        pageId='persecution-country'
        schema={z.object({
          country: z.string().nonempty(),
        })}
      >
        {({ control }) => (
          <FormBlock>
            <FormField control={control} name='country'>
              <QuizFieldTitle />
              <QuizFieldDescription />
              <FormRadioGroup>
                {persecutionCountries.map((country) => (
                  <FormRadioItem
                    i18nKey={`country.${country}`}
                    key={country}
                    value={country}
                  />
                ))}
              </FormRadioGroup>
            </FormField>
          </FormBlock>
        )}
      </QuizFormPage>
    </QuizScreen>
  );
}
