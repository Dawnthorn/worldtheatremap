// Meteor
import { TAPi18n } from 'meteor/tap:i18n';
import { Factory } from 'meteor/factory';

// Utilities
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

// Forms
import React from 'react';
import t from 'tcomb-form';
import ReactSelect from 'react-select';

// API
// import { allCountriesFactory } from '../../api/countries/countries.js';
import {
  interestsSelectFactory,
  interestsCheckboxFactory,
} from '../../api/interests/interests.js';
import {
  rolesSelectFactory,
  rolesCheckboxFactory,
} from '../../api/selfDefinedRoles/selfDefinedRoles.js';
import {
  orgTypesSelectFactory,
  orgTypesCheckboxFactory,
} from '../../api/orgTypes/orgTypes.js';
import {
  gendersSelectFactory,
  gendersCheckboxFactory,
} from '../../api/genders/genders.js';

// Containers
import DuplicateProfileTextboxContainer from '../../ui/containers/DuplicateProfileTextboxContainer.jsx'; // eslint-disable-line max-len

class ProfilesCollection extends TAPi18n.Collection {
  // insert(profile, callback) {
  //   const ourProfile = profile;
  //   return super.insert(ourProfile, callback);
  // }

  // update(profileId, profile, callback) {
  //   const ourProfile = profile.$set;
  //   return super.update(profileId, {
  //     $set: ourProfile,
  //   });
  // }

  // remove(selector, callback) {
  //   return super.remove(selector, callback);
  // }
}

export const Profiles = new ProfilesCollection('Profiles');

// Deny all client-side updates since we will be using methods to manage this collection
Profiles.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// React Select integration: https://github.com/gcanti/tcomb-form/issues/249
// Profile type options
const ProfileType = [
  {
    value: 'Individual',
    label: <FormattedMessage
      id="profileType.Individual"
      description="Profile Type: Individual"
      defaultMessage="Individual"
    />,
  },
  {
    value: 'Organization',
    label: <FormattedMessage
      id="profileType.Organization"
      description="Profile Type: Organization"
      defaultMessage="Organization"
    />,
  },
  {
    value: 'Festival',
    label: <FormattedMessage
      id="profileType.Festival"
      description="Profile Type: Festival"
      defaultMessage="Festival"
    />,
  },
];
// Profile type template
const ProfileTypeTags = t.form.Form.templates.select.clone({
  renderSelect: (locals) => {
    function onChange(options) {
      const values = (options || []).map(({ value }) => value);
      locals.onChange(values);
    }

    const placeholder = (
      <FormattedMessage
        id="forms.selectPlaceholder"
        description="Select widget placeholder"
        defaultMessage="Select..."
      />
    );

    return (
      <ReactSelect
        multi
        autoBlur
        disabled={locals.disabled}
        options={ProfileType}
        value={locals.value}
        onChange={onChange}
        className="profile-type-edit"
        placeholder={placeholder}
      />
    );
  },

  renderHelp: (locals) => {
    const className = {
      'help-block': true,
      disabled: locals.disabled,
    };

    return (
      <span
        id={`${locals.attrs.id}-tip`}
        className={classnames(className)}
      >
        {locals.help}
      </span>
    );
  },
});

ProfileTypeTags.renderVertical = (locals) => ([
  ProfileTypeTags.renderLabel(locals),
  ProfileTypeTags.renderHelp(locals),
  ProfileTypeTags.renderError(locals),
  ProfileTypeTags.renderSelect(locals),
]);

// Profile type Factory
class ReactSelectProfileTypeFactory extends t.form.Component {
  getTemplate() {
    return ProfileTypeTags;
  }
}
// Profile type transformer
ReactSelectProfileTypeFactory.transformer = t.form.List.transformer;

// Prevent duplicates on profile name
const duplicateProfileTextboxTemplate = t.form.Form.templates.textbox.clone({
  renderVertical: (locals) => ([
    duplicateProfileTextboxTemplate.renderLabel(locals),
    duplicateProfileTextboxTemplate.renderHelp(locals),
    duplicateProfileTextboxTemplate.renderError(locals),
    duplicateProfileTextboxTemplate.renderTextbox(locals),
  ]),

  renderTextbox: (locals) => {
    // @TODO: Investigate locals.path for multiple. Also something like locals.onChange({0: evt})
    const onChange = (evt) => locals.onChange(evt);
    const parentValue = (locals.value !== '') ? locals.value : '';

    return (
      <div className="form-group">
        <DuplicateProfileTextboxContainer
          disabled={locals.disabled}
          parentValue={parentValue}
          updateParent={onChange}
          attrs={locals.attrs}
        />
      </div>
    );
  },

  renderLabel: (locals) => {
    const className = {
      'control-label': true,
      disabled: locals.disabled,
    };
    return (
      <label
        htmlFor={locals.attrs.id}
        className={classnames(className)}
      >
        {locals.label}
      </label>
    );
  },

  renderHelp: (locals) => {
    const className = {
      'help-block': true,
      disabled: locals.disabled,
    };

    return (
      <span
        id={`${locals.attrs.id}-tip`}
        className={classnames(className)}
      >
        {locals.help}
      </span>
    );
  },
});

// Prevent duplicates on profile name: factory
export class DuplicateProfileFactory extends t.form.Textbox {
  getTemplate() {
    return duplicateProfileTextboxTemplate;
  }
}

// Reorder field elements
const genericFieldTemplate = t.form.Form.templates.textbox.clone({
  renderVertical: (locals) => ([
    genericFieldTemplate.renderLabel(locals),
    genericFieldTemplate.renderHelp(locals),
    genericFieldTemplate.renderError(locals),
    genericFieldTemplate.renderTextbox(locals),
  ]),
});

// Get field labels to change based on disabled value
export const disabledFieldTemplate = t.form.Form.templates.textbox.clone({
  renderVertical: (locals) => ([
    disabledFieldTemplate.renderLabel(locals),
    disabledFieldTemplate.renderHelp(locals),
    disabledFieldTemplate.renderError(locals),
    disabledFieldTemplate.renderTextbox(locals),
  ]),

  renderLabel: (locals) => {
    const className = {
      'control-label': true,
      disabled: locals.disabled,
    };
    return (
      <label
        title="Select profile type"
        htmlFor={locals.attrs.id}
        className={classnames(className)}
      >
        {locals.label}
      </label>
    );
  },

  renderHelp: (locals) => {
    const className = {
      'help-block': true,
      disabled: locals.disabled,
    };

    return (
      <span
        id={`${locals.attrs.id}-tip`}
        className={classnames(className)}
      >
        {locals.help}
      </span>
    );
  },
});

// Get field labels to change based on disabled value
const disabledListTemplate = t.form.Form.templates.list.clone({
  renderFieldset: (children, locals) => {
    const className = {
      'control-label': true,
      disabled: locals.disabled,
    };

    const title = (locals.disabled) ? 'Select profile type' : '';

    const legend = (<label
      title={title}
      // htmlFor={locals.attrs.id}
      className={classnames(className)}
    >
      {locals.label}
    </label>);

    const props = {
      className: classnames('form-group-depth-1', { disabled: locals.disabled }, locals.path),
      disabled: locals.disabled,
    };

    return React.createElement.apply(null, [
      'fieldset',
      props,
      legend,
    ].concat(children));
  },

  renderLabel: (locals) => {
    const className = {
      'control-label': true,
      disabled: locals.disabled,
    };

    return (
      <label
        title="Select profile type"
        // htmlFor={locals.attrs.id}
        className={classnames(className)}
      >
        {locals.label}
      </label>
    );
  },

  renderHelp: (locals) => {
    const className = {
      'help-block': true,
      disabled: locals.disabled,
    };

    return (
      <span
        // id={`${locals.attrs.id}-tip`}
        className={classnames(className)}
      >
        {locals.help}
      </span>
    );
  },
});

export const profileSchema = t.struct({
  profileType: t.maybe(t.list(t.String)),
  name: t.String, // Required
  gender: t.maybe(t.list(t.String)),
  genderOther: t.maybe(t.list(t.String)),
  selfDefinedRoles: t.maybe(t.list(t.String)),
  foundingYear: t.maybe(t.String),
  orgTypes: t.maybe(t.list(t.String)),
  startDate: t.maybe(t.Date),
  endDate: t.maybe(t.Date),
  interests: t.maybe(t.list(t.String)),
  about: t.maybe(t.String),
  email: t.maybe(t.String),
  phone: t.maybe(t.String),
  website: t.maybe(t.String),
  agent: t.maybe(t.String),
  facebook: t.maybe(t.String),
  twitter: t.maybe(t.String),
  instagram: t.maybe(t.String),
  social: t.maybe(t.String),
  lat: t.maybe(t.String),
  lon: t.maybe(t.String),
  streetAddress: t.maybe(t.String),
  locality: t.maybe(t.String), // City
  administrativeArea: t.maybe(t.String), // Province, Region, State
  country: t.maybe(t.String),
  postalCode: t.maybe(t.String),
  howlroundPostSearchText: t.maybe(t.String),
});

export const profileFormSchema = t.struct({
  profileType: t.maybe(t.list(t.String)),
  name: t.String, // Required
  gender: t.maybe(t.list(t.String)),
  genderOther: t.maybe(t.list(t.String)),
  selfDefinedRoles: t.maybe(t.list(t.String)),
  foundingYear: t.maybe(t.String),
  orgTypes: t.maybe(t.list(t.String)),
  startDate: t.maybe(t.Date),
  endDate: t.maybe(t.Date),
  interests: t.maybe(t.list(t.String)),
  about: t.maybe(t.String),
  email: t.maybe(t.String),
  phone: t.maybe(t.String),
  website: t.maybe(t.String),
  agent: t.maybe(t.String),
  facebook: t.maybe(t.String),
  twitter: t.maybe(t.String),
  instagram: t.maybe(t.String),
  social: t.maybe(t.String),
  lat: t.maybe(t.String),
  lon: t.maybe(t.String),
  streetAddress: t.maybe(t.String),
  locality: t.maybe(t.String), // City
  administrativeArea: t.maybe(t.String), // Province, Region, State
  country: t.maybe(t.String),
  postalCode: t.maybe(t.String),
});

export const profileFiltersSchema = t.struct({
  name: t.maybe(t.String),
  selfDefinedRoles: t.maybe(t.list(t.String)),
  interests: t.maybe(t.list(t.String)),
  orgTypes: t.maybe(t.list(t.String)),
  locality: t.maybe(t.String), // City
  administrativeArea: t.maybe(t.String), // Province, Region, State
  country: t.maybe(t.String),
  postalCode: t.maybe(t.String),
  gender: t.maybe(t.String),
});

export const profileFestivalsFiltersSchema = t.struct({
  name: t.maybe(t.String),
  startDate: t.maybe(t.Date),
  endDate: t.maybe(t.Date),
  interests: t.maybe(t.list(t.String)),
  locality: t.maybe(t.String), // City
  administrativeArea: t.maybe(t.String), // Province, Region, State
  country: t.maybe(t.String),
});

export const defaultFormOptions = () => ({
  error: <FormattedMessage
    id="forms.pageError"
    description="Generic page-level message for a form error"
    defaultMessage="Please fill in all required fields."
  />,
  fields: {
    name: {
      // factory: DuplicateProfileFactory,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier required"><FormattedMessage
            id="forms.requiredLabel"
            description="Addition to label indicating a field is required"
            defaultMessage="(required)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.profileNameLabel"
            description="Label for a Profile name form field"
            defaultMessage="Profile name"
          />,
        }}
      />,
      attrs: {
        className: 'profile-name-edit',
        autoComplete: 'off',
      },
      error: <FormattedMessage
        id="forms.profileNameError"
        description="Error for a Profile name form field"
        defaultMessage="Name is required"
      />,
    },
    about: {
      template: genericFieldTemplate,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.profileAboutLabel"
            description="Label for a Profile About form field"
            defaultMessage="About"
          />,
        }}
      />,
      help: <FormattedMessage
        id="forms.markdownHelpText"
        description="Help text markdown fields"
        defaultMessage="To make italic text wrap words or phrases in asterisks. For example: *this will be italic*. Typing URLs will automatically become links if you include the http://."
      />,
      type: 'textarea',
      attrs: {
        rows: '10',
        className: 'profile-about-edit',
      },
    },
    profileType: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.profileTypeLabel"
            description="Label for a Profile Type form field"
            defaultMessage="What kind of profile is this?"
          />,
        }}
      />,
      factory: ReactSelectProfileTypeFactory,
      help: <FormattedMessage
        id="forms.profileTypeHelpText"
        description="Help text for profile type field"
        defaultMessage="Is this profile representing an individual or an organization? Can be both if applicable." // eslint-disable-line max-len
      />,
    },
    startDate: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.startDateLabel"
            description="Label for a Start date form field"
            defaultMessage="Start date"
          />,
        }}
      />,
      error: <FormattedMessage
        id="forms.eventStartDateError"
        description="Error message for start date form field on events forms"
        defaultMessage="Start date is required"
      />,
      attrs: {
        className: 'event-start-date-edit',
      },
    },
    endDate: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.endDateLabel"
            description="Label for a End date form field"
            defaultMessage="End date"
          />,
        }}
      />,
      error: <FormattedMessage
        id="forms.eventEndDateError"
        description="Error message for End date form field on events forms"
        defaultMessage="End date is required"
      />,
      attrs: {
        className: 'event-end-date-edit',
      },
    },
    streetAddress: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.streetLabel"
            description="Label for a Street Address form field"
            defaultMessage="Street address"
          />,
        }}
      />,
      attrs: {
        className: 'profile-street-address-edit',
      },
    },
    locality: {
      disabled: true,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.localityLabel"
            description="Label for a Locality / City form field"
            defaultMessage="City"
          />,
        }}
      />,
      attrs: {
        className: 'profile-locality-edit location-field-automated',
      },
    },
    administrativeArea: {
      disabled: true,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.administrativeAreaLabel"
            description="Label for Administrative Area form field"
            defaultMessage="Province, Region, or State"
          />,
        }}
      />,
      attrs: {
        className: 'profile-administrative-area-edit location-field-automated',
      },
    },
    country: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.countryLabel"
            description="Label for a Country form field"
            defaultMessage="Country"
          />,
        }}
      />,
      // Imported factories need to be called as functions
      // factory: allCountriesFactory(),
    },
    postalCode: {
      disabled: true,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.postalCodeLabel"
            description="Label for a Postal code form field"
            defaultMessage="Postal Code"
          />,
        }}
      />,
      attrs: {
        className: 'profile-postal-code-edit location-field-automated',
      },
    },
    lat: {
      auto: 'none',
      attrs: {
        className: 'visually-hidden',
      },
      help: <FormattedMessage
        id="forms.setPinHelpText"
        description="Help text for set pin field"
        defaultMessage="We use the google places database to help us find locations. If the location you are searching for is not in the database don't worry! You can place the pin where you want and manually enter the address in the fields below." // eslint-disable-line max-len
      />,
    },
    lon: {
      auto: 'none',
      attrs: {
        className: 'visually-hidden',
      },
    },
    agent: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="profile.agentLabel"
            description="Label for an Agent form field"
            defaultMessage="Agent/Representative or Contact Person"
          />,
        }}
      />,
      template: genericFieldTemplate,
      attrs: {
        className: 'profile-agent-edit',
      },
      help: <FormattedMessage
        id="forms.agentHelpText"
        description="Help text for agent field"
        defaultMessage="Name and email"
      />,
    },
    phone: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="profile.phoneLabel"
            description="Label for a Profile Phone form field"
            defaultMessage="Phone"
          />,
        }}
      />,
      template: genericFieldTemplate,
      attrs: {
        className: 'profile-phone-edit',
      },
      help: <FormattedMessage
        id="forms.phoneHelpText"
        description="Help text for phone number field"
        defaultMessage="Format: {plus}[country code] [your number]"
        values={{ plus: '+' }}
      />,
    },
    email: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="profile.emailLabel"
            description="Label for a Profile Email form field"
            defaultMessage="Email"
          />,
        }}
      />,
      attrs: {
        className: 'profile-email-edit',
      },
    },
    website: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="profile.websiteLabel"
            description="Label for a Profile website form field"
            defaultMessage="Website"
          />,
        }}
      />,
      attrs: {
        className: 'profile-website-edit',
      },
    },
    facebook: {
      template: genericFieldTemplate,
      attrs: {
        className: 'profile-facebook-edit',
      },
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.facebookLabel"
            description="Label for the facebook form field"
            defaultMessage="Facebook"
          />,
        }}
      />,
      help: <FormattedMessage
        id="forms.facebookHelpText"
        description="Help text for Facebook field"
        defaultMessage="Please enter the URL for the Facebook profile for this person or organization." // eslint-disable-line max-len
      />,
    },
    twitter: {
      template: genericFieldTemplate,
      attrs: {
        className: 'profile-twitter-edit',
      },
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.twitterLabel"
            description="Label for the twitter form field"
            defaultMessage="Twitter"
          />,
        }}
      />,
      help: <FormattedMessage
        id="forms.twitterHelpText"
        description="Help text for Twitter field"
        defaultMessage="Please enter the Twitter handle related to this profile (do NOT include the @)." // eslint-disable-line max-len
      />,
    },
    instagram: {
      template: genericFieldTemplate,
      attrs: {
        className: 'profile-instagram-edit',
      },
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.instagramLabel"
            description="Label for the instagram form field"
            defaultMessage="Instagram"
          />,
        }}
      />,
      help: <FormattedMessage
        id="forms.instagramHelpText"
        description="Help text for Instagram field"
        defaultMessage="Please enter the Instagram account name related to this profile (do NOT include the @)." // eslint-disable-line max-len
      />,
    },
    social: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="profile.socialLabel"
            description="Label for a Social form field"
            defaultMessage="Additional Links"
          />,
        }}
      />,
      type: 'textarea',
      template: genericFieldTemplate,
      attrs: {
        rows: '10',
        className: 'profile-social-edit',
      },
      help: <FormattedMessage
        id="forms.profileSocialHelpText"
        description="Help text for an optional Social form field"
        defaultMessage="Add a label and a link. Enter a blank line between each link. For example: LinkedIn: https://www.linkedin.com/my_profile"
      />,
    },
    foundingYear: {
      template: disabledFieldTemplate,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.foundingYearLabel"
            description="Label for Founding year form field"
            defaultMessage="Founding year"
          />,
        }}
      />,
      attrs: {
        className: 'profile-founding-year-edit',
      },
      help: <FormattedMessage
        id="forms.foundingYearHelpText"
        description="Help text for an optional Founding Year form field"
        defaultMessage="If this profile is referencing an organization, what year was it founded?"
      />,
    },
    interests: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.interestsLabel"
            description="Label for Interests form field"
            defaultMessage="Interests"
          />,
        }}
      />,
      factory: interestsCheckboxFactory(),
    },
    orgTypes: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.orgTypesLabel"
            description="Label for an Organization Type form field"
            defaultMessage="What kind of organization is this?"
          />,
        }}
      />,
      factory: orgTypesCheckboxFactory(),
    },
    selfDefinedRoles: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.rolesLabel"
            description="Label for the Roles form field"
            defaultMessage="What does this person do in the theatre?"
          />,
        }}
      />,
      factory: rolesCheckboxFactory(),
    },
    gender: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.genderLabel"
            description="Label for the Gender form field"
            defaultMessage="Gender"
          />,
        }}
      />,
      help: <FormattedMessage
        id="forms.DemographicHelpText"
        description="Help text for demographic form fields instructing the user not to guess"
        defaultMessage="We encourage you not to guess. If you are not sure, leave these blank."
      />,
      factory: gendersCheckboxFactory(),
    },
    genderOther: {
      template: disabledListTemplate,
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.genderOtherLabel"
            description="Label for the Another Identify Gender form field"
            defaultMessage="Additional values to display in Gender section of profile"
          />,
        }}
      />,
      help: <FormattedMessage
        id="forms.genderOtherHelpText"
        description="Help text Another identity text field"
        defaultMessage="Please enter a value to display on the profile."
      />,
      error: <FormattedMessage
        id="forms.genderOtherError"
        description="Error for Gender Other form field"
        defaultMessage="What would you like displayed on the profile?"
      />,
    },
    howlroundPostSearchText: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.howlroundPostsLabel"
            description="Label for HowlRound Posts form field"
            defaultMessage="HowlRound Posts"
          />,
        }}
      />,
      template: genericFieldTemplate,
      attrs: {
        className: 'profile-howlround-posts-edit',
      },
      help: <FormattedMessage
        id="forms.HowlroundPostsHelpText"
        description="Help text for an optional HowlRound Posts form field"
        defaultMessage="Enter search terms here to display relevant HowlRound posts. http://howlround.com/search"
      />,
    },
  },
});

export const filtersFormOptions = () => ({
  fields: {
    // Name is the text search field
    name: {
      auto: 'none',
      attrs: {
        className: 'profile-search-text',
        autoComplete: 'off',
        placeholder: 'Search for profiles by name',
      },
    },
    profileType: {
      factory: ReactSelectProfileTypeFactory,
      label: <FormattedMessage
        id="forms.profileTypeLabel"
        description="Label for a Profile Type form field"
        defaultMessage="What kind of profile is this?"
      />,
      help: 'Is this profile representing an individual or an organization? Can be both if applicable.', // eslint-disable-line max-len
    },
    locality: {
      // The Factory function is applied later to allow reactive options
      label: <FormattedMessage
        id="forms.localityLabel"
        description="Label for a Locality / City form field"
        defaultMessage="City"
      />,
      attrs: {
        className: 'profile-locality-select-edit',
      },
    },
    administrativeArea: {
      // The Factory function is applied later to allow reactive options
      label: <FormattedMessage
        id="forms.administrativeAreaLabel"
        description="Label for Administrative Area form field"
        defaultMessage="Province, Region, or State"
      />,
      attrs: {
        className: 'profile-locality-select-edit',
      },
    },
    country: {
      // The Factory function is applied later to allow reactive options
      label: <FormattedMessage
        id="forms.countryLabel"
        description="Label for a Country form field"
        defaultMessage="Country"
      />,
      attrs: {
        className: 'profile-country-select-edit',
      },
    },
    postalCode: {
      label: <FormattedMessage
        id="forms.postalCodeLabel"
        description="Label for a Postal code form field"
        defaultMessage="Postal Code"
      />,
      attrs: {
        className: 'profile-postal-code-edit',
      },
    },
    interests: {
      label: <FormattedMessage
        id="forms.interestsLabel"
        description="Label for Interests form field"
        defaultMessage="Interests"
      />,
      factory: interestsSelectFactory(),
    },
    orgTypes: {
      label: <FormattedMessage
        id="forms.orgTypesLabel"
        description="Label for an Organization Type form field"
        defaultMessage="What kind of organization is this?"
      />,
      factory: orgTypesSelectFactory(),
    },
    selfDefinedRoles: {
      label: <FormattedMessage
        id="forms.rolesLabel"
        description="Label for the Roles form field"
        defaultMessage="What does this person do in the theatre?"
      />,
      factory: rolesSelectFactory(),
    },
    gender: {
      label: <FormattedMessage
        id="forms.genderLabel"
        description="Label for the Gender form field"
        defaultMessage="Gender"
      />,
      factory: gendersSelectFactory(),
    },
    startDate: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.startDateLabel"
            description="Label for a Start date form field"
            defaultMessage="Start date"
          />,
        }}
      />,
      error: <FormattedMessage
        id="forms.eventStartDateError"
        description="Error message for start date form field on events forms"
        defaultMessage="Start date is required"
      />,
      attrs: {
        className: 'event-start-date-edit',
      },
    },
    endDate: {
      label: <FormattedMessage
        id="forms.labelRequiredOrOptional"
        description="Label for a form field with required or optional specified"
        defaultMessage="{labelText} {optionalOrRequired}"
        values={{
          optionalOrRequired: <span className="field-label-modifier optional"><FormattedMessage
            id="forms.optionalLabel"
            description="Addition to label indicating a field is optional"
            defaultMessage="(optional)"
          /></span>,
          labelText: <FormattedMessage
            id="forms.endDateLabel"
            description="Label for a End date form field"
            defaultMessage="End date"
          />,
        }}
      />,
      error: <FormattedMessage
        id="forms.eventEndDateError"
        description="Error message for End date form field on events forms"
        defaultMessage="End date is required"
      />,
      attrs: {
        className: 'event-end-date-edit',
      },
    },
  },
});

// This represents the keys from Profiles objects that should be published
// to the client. If we add secret properties to Profile objects, don't profile
// them here to keep them private to the server.
Profiles.publicFields = {
  name: 1,
  nameSearch: 1,
  about: 1,
  profileType: 1,
  image: 1,
  startDate: 1,
  endDate: 1,
  streetAddress: 1,
  locality: 1,
  administrativeArea: 1,
  country: 1,
  postalCode: 1,
  lat: 1,
  lon: 1,
  imageWide: 1,
  agent: 1,
  phone: 1,
  email: 1,
  website: 1,
  social: 1,
  facebook: 1,
  twitter: 1,
  instagram: 1,
  foundingYear: 1,
  interests: 1,
  orgTypes: 1,
  selfDefinedRoles: 1,
  gender: 1,
  genderOther: 1,
  source: 1,
  howlroundPostSearchText: 1,
  savedHowlroundPosts: 1,
  howlroundPostsUrl: 1,
  requestRemoval: 1,
};

Profiles.autocompleteFields = {
  name: 1,
  nameSearch: 1,
  orgTypes: 1,
  locality: 1,
};

Factory.define('profile', Profiles, {});
