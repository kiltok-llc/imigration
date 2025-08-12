import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';

import { FadeView } from '@/components/fade-view';
import { Trans } from '@/components/trans';
import { FormLabel } from '@/components/ui/form/label';
import { FormBooleanInput } from '@/components/ui/form/radio';
import { QuizPage, QuizScreen } from '@/components/ui/quiz/screen';

export default function CurrentAddress() {
  const { t } = useTranslation();
  const [streetAddress, setStreetAddress] = useAtom(
    answerFamily('streetAddress')
  );
  const [apartmentUnit, setApartmentUnit] = useAtom(
    answerFamily('hasApartmentUnit')
  );
  const [apartmentNumber, setApartmentNumber] = useAtom(
    answerFamily('apartmentNumber')
  );
  const [city, setCity] = useAtom(answerFamily('city'));
  const [state, setState] = useAtom(answerFamily('state'));
  const [zipCode, setZipCode] = useAtom(answerFamily('zipCode'));

  return (
    <QuizScreen>
      {/* Page 1: Street Address and Apartment Information */}
      <QuizPage
        onSubmit={() => {
          if (!streetAddress || apartmentUnit === undefined) {
            toast.error(t('quiz.missing'));
            return false;
          }

          if (apartmentUnit && !apartmentNumber) {
            toast.error(t('quiz.missing'));
            return false;
          }

          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.residence.current-address.title' />
        </FormLabel>

        <TextInput
          label={t(
            'services.i589.info.residence.current-address.street_address'
          )}
          onChangeText={setStreetAddress}
          value={streetAddress}
        />

        <FormLabel>
          <Trans i18nKey='services.i589.info.residence.current-address.apartment_unit' />
        </FormLabel>
        <FormBooleanInput onChange={setApartmentUnit} value={apartmentUnit} />

        <FadeView visible={apartmentUnit === true}>
          <TextInput
            label={t(
              'services.i589.info.residence.current-address.apartment_number'
            )}
            onChangeText={setApartmentNumber}
            value={apartmentNumber}
          />
        </FadeView>
      </QuizPage>

      {/* Page 2: City, State, and ZIP Code */}
      <QuizPage
        onSubmit={() => {
          if (!city || !state || !zipCode) {
            toast.error(t('quiz.missing'));
            return false;
          }
          return true;
        }}
      >
        <FormLabel>
          <Trans i18nKey='services.i589.info.residence.current-address.location_title' />
        </FormLabel>

        <TextInput
          label={t('services.i589.info.residence.current-address.city')}
          onChangeText={setCity}
          value={city}
        />

        <TextInput
          label={t('services.i589.info.residence.current-address.state')}
          onChangeText={setState}
          value={state}
        />

        <TextInput
          label={t('services.i589.info.residence.current-address.zip_code')}
          onChangeText={setZipCode}
          value={zipCode}
        />
      </QuizPage>
    </QuizScreen>
  );
}
