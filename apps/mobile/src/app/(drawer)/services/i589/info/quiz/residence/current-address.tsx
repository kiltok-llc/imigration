import {
  AddressSchema,
  DEFAULT_ADDRESS,
  FormAddressInput,
} from '@/components/ui/form/address';
import { FormBlock } from '@/components/ui/form/block';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';
import { QuizPageTitle } from '@/components/ui/quiz/title';

export default function CurrentAddress() {
  return (
    <QuizScreen>
      <QuizPage
        defaultValues={DEFAULT_ADDRESS}
        onSubmit={() => true}
        pageId='address'
        schema={AddressSchema}
      >
        {({ lens }) => (
          <>
            <FormBlock>
              <QuizPageTitle />
            </FormBlock>

            <FormBlock>
              <FormAddressInput lens={lens} />
            </FormBlock>
          </>
        )}
      </QuizPage>
    </QuizScreen>
  );
}
