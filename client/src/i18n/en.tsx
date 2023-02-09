import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

const customEnglishMessages: TranslationMessages = {
    ...englishMessages,
    resources: {
      employee: {
          name: 'Employee |||| Employees',
          fields: {
              number: 'Number',
              active: 'Is active?',
              color: 'Color',
              name: 'Name',
              surname: 'Surname',
              phone: 'Phone number',
              email: 'Email address',
          },
      },
      customer: {
          name: 'Cliente |||| Clienti',
          fields: {
              vat: 'VAT number',
              name: 'Name',
              email: 'Email address',
              phone: 'Phone address',
              zipcode: 'ZIP code',
              city: 'City',
              website: 'Website',
          }
      }
  },
  ess: {
    calendar: {
      name: "Calendar"
    }
  }
};

export default customEnglishMessages;