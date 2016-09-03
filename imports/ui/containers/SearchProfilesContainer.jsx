import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import SearchProfiles from '../pages/SearchProfiles.jsx';

export default createContainer(() => {
  const profilesSubscribe = Meteor.subscribe('profiles.search');
  const localitiesSubscribe = Meteor.subscribe('localities.public');
  return {
    loading: (!profilesSubscribe.ready() || !localitiesSubscribe.ready()),
  };
}, SearchProfiles);
