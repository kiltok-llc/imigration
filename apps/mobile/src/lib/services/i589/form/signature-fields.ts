import { atom } from 'jotai';

import { nameAtom } from '@/lib/data/user';
import { prettifyName } from '@/lib/data/utils';
import { PDFField } from '@/lib/services/i589/form/types';

export const signatureFields = atom<PDFField[]>((get) =>
  [
    [`TextField20[0]`, prettifyName(get(nameAtom))],
    ['TextField20[1]', 'native alphabet name'], // Native alphabet name

    ['PtD_ckboxynd1[1]', true], // Family assistance no
    ['PtD_ckboxynd1[0]', false], // Family assistance yes

    ['PtD_ChildName1[0]', 'family 1 name'], // Family member 1 name
    ['PtD_RelationshipOfChild1[0]', 'family 1 relationship'], // Family member 1 relationship

    ['PtD_ChildName2[0]', 'family 2 name'], // Family member 2 name
    ['PtD_RelationshipOfChild2[0]', 'family 2 relationship'], // Family member 2 relationship

    ['ckboxynd2[1]', true], // Non-family assistance no
    ['ckboxynd2[0]', false], // Non-family assistance yes

    ['ckboxynd3[0]', true], // presented with list of attorneys

    ['TextField22[0]', 'client signature'], // Client signature
    ['DateTimeField48[0]', new Date()], // Client signature date

    ['PtE_PreparerSignature[0]', 'prepareer signature'], // Preparer signature
    ['PtE_PreparerName[0]', 'preparer name'],

    ['TextField25[1]', 'prepare area code'],
    ['TextField25[0]', 'preparer phone number'],
    ['PtE_StreetNumAndName[0]', 'preparer address line 1'],
    ['PtE_AptNumber[0]', 'preparer address line 2'],
    ['PtE_City[0]', 'preparer city'],
    ['PtE_State[0]', 'preparer state'],
    ['PtE_ZipCode[0]', 'preparer zip code'],

    ['CheckBox1[0]', false], // G-28 yes
    ['AttorneyStateBarNumber[0]', 'attorney bar'], // Attorney bar number
    ['USCISOnlineAcctNumber[0]', 'attorney uscis'], // Attorney USCIS number
  ].map(([k, v]) => [`form1[0].#subform[10].${k}`, v])
);
