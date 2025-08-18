import { useState } from 'react';
import { View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import tw from 'twrnc';
import z from 'zod/v4';

import { AddressSchema, DEFAULT_ADDRESS, FormAddressInput } from '@/components/form/address';
import { FormBlock } from '@/components/form/block';
import { ConditionalFormFieldBlock, FormField } from '@/components/form/field';
import { FormFieldArray, FormFieldArrayItemBlocks } from '@/components/form/fieldarray';
import { FormBooleanInput } from '@/components/form/radio';
import { FormRangeInput } from '@/components/form/range';
import { QuizDateInput } from '@/components/quiz/date';
import { QuizFieldArrayAdd, QuizFieldArrayItemHeader } from '@/components/quiz/fieldarray';
import { QuizFieldTitle, QuizPageTitle } from '@/components/quiz/label';
import { useQuiz } from '@/components/quiz/layout';
import { QuizPage, QuizScreen } from '@/components/quiz/screen';
import { Trans, TransButton, TransText } from '@/components/trans';
import { required } from '@/lib/utils';

export default function PreviousAddresses() {
  const [dialogVisible, setDialogVisible] = useState(true);
  const { setisNextPage } = useQuiz();

  return (
    <QuizScreen>
      <QuizPage
        defaultValues={{
          residences: [],
        }}
        onSubmit={({ residences }) => true}
        pageId="previous-residence"
        schema={z.object({
          residences: z.array(z.object({
            address: AddressSchema,
            range: z.object({
              end: required(z.date().nullable()),
              start: required(z.date().nullable()),
            }),
          })),
        })}
      >
        {({ control, lens }) => (
          <>
            <Portal>
              <Dialog visible={dialogVisible}>
                <Dialog.Title>
                  <Trans i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.title'/>
                </Dialog.Title>
                <Dialog.Content>
                  <TransText i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.content' />
                </Dialog.Content>
                <Dialog.Actions>
                  <View style={tw`flex-1`}>
                    <TransButton
                      i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.confirm'
                      mode='contained-tonal'
                      onPress={() => setisNextPage(true)}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <TransButton
                      i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.cancel'
                      onPress={() => setDialogVisible(false)}
                    />
                  </View>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormFieldArray control={control} name="residences">
              <FormFieldArrayItemBlocks>
                {(idx) => (
                  <>
                    <FormBlock>
                      <QuizFieldArrayItemHeader />
                      <FormAddressInput lens={lens.focus(`residences.${idx}.address`)} />
                      <FormRangeInput lens={lens.focus(`residences.${idx}.range`)} />
                    </FormBlock>
                  </>
                )}
              </FormFieldArrayItemBlocks>
              <QuizFieldArrayAdd value={{
                address: DEFAULT_ADDRESS,
                range: {
                  end: null,
                  start: null,
                },
              }} />
            </FormFieldArray>
          </>
        )}
      </QuizPage>

      <QuizPage
        defaultValues={{
          residences: [],
        }}
        onSubmit={({ residences }) => {
          if (residences.length === 0 && !dialogVisible) {
            setDialogVisible(true);
            return false;
          }

          setDialogVisible(false);
          return true;
        }}
        pageId="past-residences"
        schema={z.object({
          residences: z.array(z.object({
            address: AddressSchema,
            range: z.object({
              end: required(z.date().nullable()),
              start: required(z.date().nullable()),
            }),
          })),
        })}
      >
        {({ control, lens }) => (
          <>
            <Portal>
              <Dialog visible={dialogVisible}>
                <Dialog.Title>
                  <Trans i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.title'/>
                </Dialog.Title>
                <Dialog.Content>
                  <TransText i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.content' />
                </Dialog.Content>
                <Dialog.Actions>
                  <View style={tw`flex-1`}>
                    <TransButton
                      i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.confirm'
                      mode='contained-tonal'
                      onPress={() => setisNextPage(true)}
                    />
                  </View>
                  <View style={tw`flex-1`}>
                    <TransButton
                      i18nKey='services.i589.info.residence.previous-addresses.past-residences.dialog.cancel'
                      onPress={() => setDialogVisible(false)}
                    />
                  </View>
                </Dialog.Actions>
              </Dialog>
            </Portal>

            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormFieldArray control={control} name="residences">
              <FormFieldArrayItemBlocks>
                {(idx) => (
                  <>
                    <FormBlock>
                      <QuizFieldArrayItemHeader />
                      <FormAddressInput lens={lens.focus(`residences.${idx}.address`)} />
                      <FormRangeInput lens={lens.focus(`residences.${idx}.range`)} />
                    </FormBlock>
                  </>
                )}
              </FormFieldArrayItemBlocks>
              <QuizFieldArrayAdd value={{
                address: DEFAULT_ADDRESS,
                range: {
                  end: null,
                  start: null,
                },
              }} />
            </FormFieldArray>
          </>
          )}
      </QuizPage>
    </QuizScreen>
);
}
