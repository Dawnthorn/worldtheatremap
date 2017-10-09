import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { createContainer } from 'meteor/react-meteor-data';
import SearchShows from '../pages/SearchShows.jsx';

export default createContainer(() => {
  const languagesSubscribe = Meteor.subscribe('languages.public');
  const countriesSubscribe = TAPi18n.subscribe('countries.public');
  const interestsSubscribe = TAPi18n.subscribe('interests.public');
  const localitiesSubscribe = Meteor.subscribe('localities.public');
  const administrativeAreasSubscribe = Meteor.subscribe('administrativeAreas.public');

  const loading = !(localitiesSubscribe.ready() && countriesSubscribe.ready() && interestsSubscribe.ready() && administrativeAreasSubscribe.ready() && languagesSubscribe.ready());
  return {
    loading,
  };
}, SearchShows);
