import { isEqual } from '@ver0/deep-equal';
import { useLocalSearchParams } from 'expo-router';
import { atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { View } from 'react-native';
import z from 'zod/v4';

import { FormBlock } from '@/components/form/block';
import { ConditionalFormWrapper, FormField } from '@/components/form/field';
import { FormArray, FormArrayItems } from '@/components/form/fieldarray';
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
  childIsInUsaAtom,
  childNameAtom,
  childPassportAtom,
  childSsnAtom,
  childUscisNumberAtom,
} from '@/lib/data/child';
import {
  DEFAULT_PASSPORT,
  DEFAULT_USA_ENTRY,
  PassportTypeEnum,
} from '@/lib/data/schema';
import {
  spouseAlienNumberAtom,
  spouseEntriesAtom,
  spouseImmigrationCourtStatusAtom,
  spouseIsInUsaAtom,
  spouseNameAtom,
  spousePassportAtom,
  spouseSsnAtom,
  spouseUscisNumberAtom,
} from '@/lib/data/spouse';
import {
  alienNumberAtom,
  entriesAtom,
  immigrationCourtStatusAtom,
  nameAtom,
  passportAtom,
  ssnAtom,
  uscisNumberAtom,
} from '@/lib/data/user';
import { ImmigrationCourtStatusEnum } from '@/lib/schemas';
import { TranslationContextProvider } from '@/lib/translation';
import { required } from '@/lib/utils';

const contextFamily = <T,>(
  clientAtom: PrimitiveAtom<T>,
  spouseAtom: PrimitiveAtom<T>,
  childAtom: (id: string) => PrimitiveAtom<T>
) =>
  atomFamily(({ context, id }: Param) => {
    switch (context) {
      case 'child': {
        return childAtom(id ?? '');
      }
      case 'client': {
        return clientAtom;
      }
      case 'spouse': {
        return spouseAtom;
      }
    }
  }, isEqual);

type Context = 'child' | 'client' | 'spouse';
type Param = {
  context: Context;
  id?: string;
};

const dummyClientInUsaAtom = atom<boolean | null>(true);

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
  const setEntries = useSetAtom(
    contextFamily(entriesAtom, spouseEntriesAtom, childEntriesAtom)(param)
  );
  const [isInUsa, setIsInUsa] = useAtom(
    contextFamily(
      dummyClientInUsaAtom,
      spouseIsInUsaAtom,
      childIsInUsaAtom
    )(param)
  );

  return (
    <TranslationContextProvider value={{ values: { name } }}>
      <QuizScreen screenKey={`${context}${id ? `-${id}` : ''}`}>
        <QuizPage
          defaultValues={{
            hasPassport: null,
          }}
          onSuccess={({ passport }) => {
            setPassport({ ...passport, ...DEFAULT_PASSPORT });
          }}
          pageId='passport'
          schema={z.object({
            hasPassport: required(z.boolean().nullable()),
            passport: z
              .object({
                number: z.string().nonempty(),
                ...(context === 'client'
                  ? {
                      country: z.string().nonempty(),
                      expiration: z.date().nullable(),
                      type: PassportTypeEnum,
                    }
                  : {}),
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

              <ConditionalFormWrapper
                active={!!watch('hasPassport')}
                activeValue={{ country: '', number: '' }}
                control={control}
                name='passport'
              >
                <FormBlock>
                  <FormField control={control} name='passport.country'>
                    <QuizFieldTitle />
                    <QuizTextInput />
                  </FormField>

                  <FormField control={control} name='passport.number'>
                    <QuizFieldTitle />
                    <QuizTextInput />
                  </FormField>

                  {context === 'client' && (
                    <>
                      <FormField control={control} name='passport.expiration'>
                        <QuizFieldTitle />
                        <QuizDateInput />
                      </FormField>

                      <FormField control={control} name='passport.type'>
                        <QuizFieldTitle />
                        <FormRadioGroup>
                          {PassportTypeEnum.options.map((type) => (
                            <QuizRadioItem key={type} value={type} />
                          ))}
                        </FormRadioGroup>
                      </FormField>
                    </>
                  )}
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{ hasAlienNumber: null }}
          onSuccess={({ number }) => {
            setAlienNumber(number ?? '');
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

              <ConditionalFormWrapper
                active={!!watch('hasAlienNumber')}
                activeValue={''}
                control={control}
                name='number'
              >
                <FormBlock>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            hasSsn: null,
          }}
          onSuccess={({ number }) => {
            setSsn(number ?? '');
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

              <ConditionalFormWrapper
                active={!!watch('hasSsn')}
                activeValue={''}
                control={control}
                name='number'
              >
                <FormBlock>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            hasUscis: null,
          }}
          onSuccess={({ number }) => {
            setUscisNumber(number ?? '');
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

              <ConditionalFormWrapper
                active={!!watch('hasUscis')}
                activeValue={''}
                control={control}
                name='number'
              >
                <FormBlock>
                  <QuizFieldTitle />
                  <QuizTextInput />
                </FormBlock>
              </ConditionalFormWrapper>
            </>
          )}
        </QuizPage>

        <QuizPage
          defaultValues={{
            status: null,
          }}
          onSuccess={({ status }) => {
            setImmigrationCourtStatus(status);
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

        {context === 'child' && (
          <QuizPage
            defaultValues={{
              isInUsa: null,
            }}
            onSuccess={({ isInUsa }) => {
              setIsInUsa(isInUsa);
            }}
            pageId='is-in-usa'
            schema={z.object({
              isInUsa: required(z.boolean().nullable()),
            })}
          >
            {({ control }) => (
              <FormBlock>
                <FormField control={control} name='isInUsa'>
                  <QuizFieldTitle />
                  <FormBooleanInput />
                </FormField>
              </FormBlock>
            )}
          </QuizPage>
        )}

        {isInUsa && (
          <QuizPage
            defaultValues={DEFAULT_USA_ENTRY}
            onSuccess={({ date, port, status }) => {
              setEntries([{ date, port, status }]);
            }}
            pageId='first-entry'
            schema={z.object({
              date: required(z.date().nullable()),
              port: z.string().nonempty(),
              status: z.string(),
            })}
          >
            {({ control }) => (
              <>
                <FormBlock>
                  <QuizPageTitle />
                </FormBlock>

                <FormBlock>
                  <FormField control={control} name='date'>
                    <View>
                      <QuizFieldTitle />
                      <QuizFieldTip />
                    </View>
                    <QuizDateInput />
                  </FormField>

                  <FormField control={control} name='port'>
                    <QuizFieldTitle />
                    <QuizTextInput />
                  </FormField>

                  <FormField control={control} name='status'>
                    <QuizFieldTitle />
                    <QuizTextInput hint='optional' />
                  </FormField>
                </FormBlock>
              </>
            )}
          </QuizPage>
        )}

        {context === 'spouse' && isInUsa && (
          <QuizPage
            defaultValues={{
              hasPreviousEntry: null,
            }}
            onSuccess={({ entryDate }) => {
              if (entryDate) {
                setEntries(([first]) => [
                  first!,
                  { ...DEFAULT_USA_ENTRY, date: entryDate },
                ]);
              }
            }}
            pageId='previous-entry'
            schema={z.object({
              entryDate: z.date().nullable().optional(),
              hasPreviousEntry: required(z.boolean().nullable()),
            })}
          >
            {({ control, watch }) => (
              <>
                <FormBlock>
                  <FormField control={control} name='hasPreviousEntry'>
                    <QuizFieldTitle />
                    <FormBooleanInput />
                  </FormField>
                </FormBlock>

                <ConditionalFormWrapper
                  active={!!watch('hasPreviousEntry')}
                  activeValue={null}
                  control={control}
                  name='entryDate'
                >
                  <FormBlock animated>
                    <QuizFieldDescription />
                    <QuizDateInput />
                  </FormBlock>
                </ConditionalFormWrapper>
              </>
            )}
          </QuizPage>
        )}

        {context === 'client' && (
          <QuizPage
            defaultValues={{
              hasOtherEntries: null,
            }}
            onSuccess={({ entries }) => {
              if (entries) {
                setEntries(([first]) => [first!, ...entries]);
              }
            }}
            pageId='other-entries'
            schema={z.object({
              entries: z
                .array(
                  z.object({
                    date: z.date().nullable(),
                    port: z.string().nonempty(),
                    status: z.string(),
                  })
                )
                .nonempty()
                .optional(),
              hasOtherEntries: z.boolean().nullable(),
            })}
          >
            {({ control, watch }) => (
              <>
                <FormBlock>
                  <FormField control={control} name='hasOtherEntries'>
                    <QuizFieldTitle />
                    <QuizFieldDescription />
                    <FormBooleanInput />
                  </FormField>
                </FormBlock>

                <ConditionalFormWrapper
                  active={!!watch('hasOtherEntries')}
                  activeValue={[{ date: null, port: '', status: '' }]}
                  control={control}
                  name='entries'
                >
                  <FormArray control={control} name='entries'>
                    <FormArrayItems>
                      {(idx) => (
                        <TranslationContextProvider value={{ count: idx + 2 }}>
                          <FormBlock animated>
                            <QuizFieldArrayItemHeader removeButton={idx > 0} />
                            <FormField
                              control={control}
                              name={`entries.${idx}.date`}
                            >
                              <QuizDateInput />
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
                              <QuizTextInput hint='optional' />
                            </FormField>
                          </FormBlock>
                        </TranslationContextProvider>
                      )}
                    </FormArrayItems>

                    {(watch('entries')?.length ?? 0) < 2 && (
                      <FormBlock animated>
                        <QuizFieldArrayAdd
                          value={{
                            date: null,
                            port: '',
                            status: '',
                          }}
                        />
                      </FormBlock>
                    )}
                  </FormArray>
                </ConditionalFormWrapper>
              </>
            )}
          </QuizPage>
        )}
      </QuizScreen>
    </TranslationContextProvider>
  );
}
