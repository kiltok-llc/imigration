import { isEqual } from '@ver0/deep-equal';
import { useLocalSearchParams } from 'expo-router';
import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { View } from 'react-native';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import {
  FormFieldArray,
  FormFieldArrayItemBlocks,
} from '@/components/form/fieldarray';
import { FormBooleanInput, FormRadioGroup } from '@/components/form/radio';
import { QuizDateInput } from '@/components/quiz/date';
import {
  QuizFieldArrayAdd,
  QuizFieldArrayItemHeader,
} from '@/components/quiz/fieldarray';
import {
  QuizFieldDescription,
  QuizFieldTip,
  QuizFieldTitle,
  QuizPageTitle,
} from '@/components/quiz/label';
import { QuizPage } from '@/components/quiz/page';
import { QuizRadioItem } from '@/components/quiz/radio';
import { QuizScreen } from '@/components/quiz/screen';
import { QuizTextInput } from '@/components/quiz/text';
import {
  childAlienNumberAtom,
  childEntriesAtom,
  childImmigrationCourtStatusAtom,
  childNameAtom,
  childPassportAtom,
  childSsnAtom,
  childStatusExpirationAtom,
  childUscisNumberAtom,
} from '@/lib/data/child';
import { DEFAULT_PASSPORT } from '@/lib/data/schema';
import {
  spouseAlienNumberAtom,
  spouseEntriesAtom,
  spouseImmigrationCourtStatusAtom,
  spouseNameAtom,
  spousePassportAtom,
  spouseSsnAtom,
  spouseStatusExpirationAtom,
  spouseUscisNumberAtom,
} from '@/lib/data/spouse';
import {
  alienNumberAtom,
  entriesAtom,
  immigrationCourtStatusAtom,
  nameAtom,
  passportAtom,
  ssnAtom,
  statusExpirationAtom,
  uscisNumberAtom,
} from '@/lib/data/user';
import { ImmigrationCourtStatusEnum } from '@/lib/schema/common';
import { required } from '@/lib/utils';
import { TranslationContextProvider } from '@/providers/translation';

const contextFamily = <T,>(
  clientAtom: PrimitiveAtom<T>,
  spouseAtom: PrimitiveAtom<T>,
  childAtom: (id: string) => PrimitiveAtom<T>
) =>
  atomFamily(
    ({ context, id }: Param) =>
      ({
        child: childAtom(id ?? ''),
        client: clientAtom,
        spouse: spouseAtom,
      })[context],
    isEqual
  );

type Context = 'child' | 'client' | 'spouse';
type Param = {
  context: Context;
  id?: string;
};

export default function ImmigrationStatus() {
  const param = useLocalSearchParams<{
    context: Context;
    id: string;
  }>();
  const { context, id } = param;

  const name = useAtomValue(
    contextFamily(nameAtom, spouseNameAtom, childNameAtom)(param)
  ).first;
  const setPassport = useSetAtom(
    contextFamily(passportAtom, spousePassportAtom, childPassportAtom)(param)
  );
  const setAlienNumber = useSetAtom(
    contextFamily(
      alienNumberAtom,
      spouseAlienNumberAtom,
      childAlienNumberAtom
    )(param)
  );
  const setSsn = useSetAtom(
    contextFamily(ssnAtom, spouseSsnAtom, childSsnAtom)(param)
  );
  const setUscisNumber = useSetAtom(
    contextFamily(
      uscisNumberAtom,
      spouseUscisNumberAtom,
      childUscisNumberAtom
    )(param)
  );
  const setImmigrationCourtStatus = useSetAtom(
    contextFamily(
      immigrationCourtStatusAtom,
      spouseImmigrationCourtStatusAtom,
      childImmigrationCourtStatusAtom
    )(param)
  );
  const [entries, setEntries] = useAtom(
    contextFamily(entriesAtom, spouseEntriesAtom, childEntriesAtom)(param)
  );
  const setStatusExpiration = useSetAtom(
    contextFamily(
      statusExpirationAtom,
      spouseStatusExpirationAtom,
      childStatusExpirationAtom
    )(param)
  );

  return (
    <TranslationContextProvider
      value={{
        values: { name },
      }}
    >
      <QuizScreen screenKey={`${context}${id ? `-${id}` : ''}`}>
        <QuizPage
          defaultValues={{
            hasPassport: null,
          }}
          onSubmit={({ passport }) => {
            setPassport(passport ?? DEFAULT_PASSPORT);

            return true;
          }}
          pageId='passport'
          schema={z.object({
            hasPassport: required(z.boolean().nullable()),
            passport: z
              .object({
                country: z.string().nonempty(),
                number: z.string().nonempty(),
              })
              .optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasPassport'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasPassport')}
                activeValue={{ country: '', number: '' }}
                control={control}
                name='passport'
              >
                <FormField control={control} name='passport.country'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>

                <FormField control={control} name='passport.number'>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormField>
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{ hasAlienNumber: null }}
          onSubmit={({ number }) => {
            setAlienNumber(number ?? '');
            return true;
          }}
          pageId='alien-number'
          schema={z.object({
            hasAlienNumber: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasAlienNumber'>
                  <QuizFieldTitle />
                  <QuizFieldDescription />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasAlienNumber')}
                activeValue={''}
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            hasSsn: null,
          }}
          onSubmit={({ number }) => {
            setSsn(number ?? '');
            return true;
          }}
          pageId='ssn'
          schema={z.object({
            hasSsn: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasSsn'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasSsn')}
                activeValue={''}
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            hasUscis: null,
          }}
          onSubmit={({ number }) => {
            setUscisNumber(number ?? '');
            return true;
          }}
          pageId='uscis'
          schema={z.object({
            hasUscis: required(z.boolean().nullable()),
            number: z.string().nonempty().optional(),
          })}
        >
          {({ control, watch }) => (
            <>
              <FormBlock>
                <FormField control={control} name='hasUscis'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>

              <ConditionalFormFieldBlock
                active={!!watch('hasUscis')}
                activeValue={''}
                control={control}
                name='number'
              >
                <QuizFieldTitle />
                <QuizTextInput />
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            status: null,
          }}
          onSubmit={({ status }) => {
            setImmigrationCourtStatus(status);
            return true;
          }}
          pageId='court'
          schema={z.object({
            status: required(ImmigrationCourtStatusEnum.nullable()),
          })}
        >
          {({ control }) => (
            <>
              <FormBlock>
                <FormField control={control} name='status'>
                  <QuizFieldTitle />
                  <FormRadioGroup>
                    {ImmigrationCourtStatusEnum.options.map((status) => (
                      <QuizRadioItem key={status} value={status} />
                    ))}
                  </FormRadioGroup>
                </FormField>
              </FormBlock>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            isInUsa: null,
          }}
          onSubmit={({ entry }) => {
            if (entry) {
              const { date, port, status, statusExpiration } = entry;
              setEntries([{ date, port, status }]);
              setStatusExpiration(statusExpiration);
            } else {
              setEntries([]);
              setStatusExpiration(null);
            }

            return true;
          }}
          pageId='first-entry'
          schema={z.object({
            entry: z
              .object({
                date: required(z.date().nullable()),
                port: z.string().nonempty(),
                status: z.string(),
                statusExpiration: z.date().nullable(),
              })
              .optional(),
            isInUsa:
              context === 'client'
                ? z.boolean().nullable()
                : required(z.boolean().nullable()),
          })}
        >
          {({ control, watch }) => (
            <>
              {context !== 'client' && (
                <FormField control={control} name='isInUsa'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              )}

              <ConditionalFormFieldBlock
                active={context === 'client' || !!watch('isInUsa')}
                activeValue={{
                  date: null,
                  port: '',
                  status: '',
                  statusExpiration: null,
                }}
                control={control}
                name='entry'
              >
                <FormBlock>
                  <FormField control={control} name='entry.date'>
                    <View>
                      <QuizFieldTitle />
                      <QuizFieldTip />
                    </View>
                    <QuizDateInput />
                  </FormField>
                </FormBlock>

                <FormBlock>
                  <FormField control={control} name='entry.port'>
                    <QuizFieldTitle />
                    <QuizTextInput />
                  </FormField>
                </FormBlock>

                <FormBlock>
                  <FormField control={control} name='entry.status'>
                    <QuizFieldTitle />
                    <QuizTextInput optional />
                  </FormField>
                </FormBlock>

                <FormBlock>
                  <FormField control={control} name='entry.statusExpiration'>
                    <QuizFieldTitle />
                    <QuizDateInput optional />
                  </FormField>
                </FormBlock>
              </ConditionalFormFieldBlock>
            </>
          )}
        </QuizPage>

        {entries.length > 0 && (
          <QuizPage
            defaultValues={{ entries: [] }}
            onSubmit={({ entries }) => {
              setEntries(([first]) => [first!, ...entries]);
              return true;
            }}
            pageId='other-entries'
            schema={z.object({
              entries: z.array(
                z.object({
                  date: z.date().nullable(),
                  port: z.string().nonempty(),
                  status: z.string(),
                })
              ),
            })}
          >
            {({ control }) => (
              <>
                <FormBlock>
                  <QuizPageTitle />
                </FormBlock>

                <FormFieldArray control={control} name='entries'>
                  <FormFieldArrayItemBlocks>
                    {(idx) => (
                      <FormBlock>
                        <QuizFieldArrayItemHeader />
                        <FormField
                          control={control}
                          name={`entries.${idx}.date`}
                        >
                          <QuizTextInput />
                        </FormField>
                        <FormField
                          control={control}
                          name={`entries.${idx}.port`}
                        >
                          <QuizTextInput />
                        </FormField>
                        <FormField
                          control={control}
                          name={`entries.${idx}.status`}
                        >
                          <QuizTextInput optional />
                        </FormField>
                      </FormBlock>
                    )}
                  </FormFieldArrayItemBlocks>
                  <QuizFieldArrayAdd
                    value={{
                      date: null,
                      port: '',
                      status: '',
                    }}
                  />
                </FormFieldArray>
              </>
            )}
          </QuizPage>
        )}
      </QuizScreen>
    </TranslationContextProvider>
  );
}
