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
      name: 'Customer |||| Customers',
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
      calendars: "Calendars",
      event: {
        type: {
          job: "Job",
          holiday: "Holiday",
          permit: "Permit",
          sickness: "Sick",
          makeup: "Comp"
        },
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
        },
        labels: {
          employee: "Employee",
          customer: "Customer",
          all_day: "All Day",
          start_date: "Start Date",
          end_date: "End Date",
          default_timezone: "Default Timezone",
          custom_timezone: "Custom Timezone",
          hide_timezone: "Hide Timezone",
          start_date_timezone: "Start Date Timezone",
          end_date_timezone: "End Date Timezone",
          recurring_event: "Recurring event",
          every: "Every",
          interval: "Interval",
          frequency: "Frequency",
          days: "Days",
          weeks: "Weeks",
          months: "Months",
          years: "Years",
          stop_after: "Stop after",
          never: "Never",
          date: "Date",
          occurrences: "Occurrences",
          until_date: "Until Date",
          until_occurrences: "Occurrences Number"
        }
      },
      calendarlist: {
        number: "Number",
        select_all: "Select All",
        deselect_all: "Deselect All"
      },
      dialog: {
        new_event_title: "New event",
        edit_event_title: "Edit event",
        edit_recurring_event_title: "Edit recurring event",
      }
    },
    users: {
      password_update: {
        btn_label: "Change Password",
        updated: "Password changed successfully!",
        updated_error: "Something went wrong while changing the password.",
        field_label: "New password"
      },
      preferences: {
        title: "User Preferences",
        timezone: "Timezone",
        language: "Language",
        success_update: "Preferences updated successfully!",
        error_update: "Failed to update preferences.",
        error_fetch: "Failed to fetch preferences.",
      },
    },
    summary: {
      name: "Report"
    }
  }
};

export default customEnglishMessages;