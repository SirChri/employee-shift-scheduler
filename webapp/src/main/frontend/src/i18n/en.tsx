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
      name: "Calendar",
      event: {
        error: "Something went wrong.",
        error_create: "Error on event creation",
        success_create: "Event created",
        error_update: "Error on event update",
        success_update: "Event updated",
        error_delete: "Error on event delete",
        success_delete: "Event removed",
        recurring: {
          thisev: "This event",
          thisandfoll: "This and the following events"
        }
      },
      calendarlist: {
        number: "Number"
      },
    },
    users: {
      password_update: {
        btn_label: "Change Password",
        updated: "Password changed successfully!",
        updated_error: "Something went wrong while changing the password.",
        field_label: "New password"
      }
    },
    summary: {
      name: "Report"
    }
  }
};

export default customEnglishMessages;