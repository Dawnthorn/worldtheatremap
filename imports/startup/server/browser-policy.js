import { Meteor } from 'meteor/meteor';
import { BrowserPolicy } from 'meteor/browser-policy-common';

Meteor.startup(() => {
  BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
  BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
  BrowserPolicy.content.allowOriginForAll('*.google-analytics.com');
  BrowserPolicy.content.allowEval('https://ajax.googleapis.com');
  BrowserPolicy.content.allowOriginForAll(`${Meteor.settings.AWSTargetBucket}.s3.amazonaws.com`);
  BrowserPolicy.content.allowOriginForAll(`${Meteor.settings.AWSSourceBucket}.s3.amazonaws.com`);
  BrowserPolicy.content.allowOriginForAll('s3.amazonaws.com');
  // Allow images from the new play map server
  BrowserPolicy.content.allowOriginForAll('newplaymap.org');
  // Pulling HowlRound posts
  BrowserPolicy.content.allowOriginForAll('howlround.com');
  BrowserPolicy.content.allowOriginForAll('*.howlround.com');
});
