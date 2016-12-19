// Utilities
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import React from 'react';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import { OutboundLink } from 'react-ga';

// Components
import Show from '../components/Show.jsx';
import ShowEdit from '../components/ShowEdit.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import Modal from '../components/Modal.jsx';
import AuthSignIn from '../components/AuthSignIn.jsx';
import Loading from '../components/Loading.jsx';

class ShowPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: this.props.editing ? this.props.show._id : null,
    };
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editing !== nextProps.editing) {
      this.setState({
        editing: nextProps.editing,
      });
    }
  }

  onEditingChange(id, editing) {
    this.setState({
      editing: editing ? id : null,
    });
  }

  render() {
    // const { show, showExists, loading } = this.props;
    const { loading, show, user, eventsByShow } = this.props;
    const { editing } = this.state;
    const { formatMessage, locale } = this.props.intl;
    const baseUrl = Meteor.absoluteUrl(false, { secure: true });

    const showPageClass = classnames({
      page: true,
      'shows-show': true,
      editing,
    });

    const siteName = formatMessage({
      'id': 'navigation.siteName',
      'defaultMessage': 'World Theatre Map',
      'description': 'Site name',
    });

    if (loading) {
      return (
        <Loading key="loading" />
      );
    } else if (!show) {
      return (
        <NotFoundPage />
      );
    } else if (editing && user) {
      return (
        <div className="overlay-wrapper">
          <Modal />
          <div className={showPageClass}>
            <Helmet
              title={`Edit ${show.name}`}
              meta={[
                { property: 'og:title', content: `${show.name} | ${siteName}` },
                { property: 'twitter:title', content: `${show.name} | ${siteName}` },
                { property: 'og:type', content: 'article' },
                { property: 'og:url', content: `${baseUrl}${locale}/shows/${show._id}` },
              ]}
            />
            {show.about ?
              <Helmet
                meta={[
                  { name: 'description', content: show.about },
                  { property: 'og:description', content: show.about },
                  { property: 'twitter:description', content: show.about },
                ]}
              /> : ''
            }
            <Link
              to={`/${locale}/shows/${show._id}`}
              title="Back"
              className="overlay-close"
            >
              &times;
            </Link>
            <ShowEdit
              show={show}
              onEditingChange={this.onEditingChange}
            />
          </div>
        </div>
      );
    } else if (editing) {
      return (
        <div className="overlay-wrapper">
          <Modal />
          <div className="page auth">
            <Message
              title="Access denied"
              subtitle="Sign in or register to participate in the World Theatre Map"
            />
            <div className="page-content">
              <Helmet title="Sign in to edit this show" />
              <AuthSignIn />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={showPageClass}>
          <Helmet
            title={show.name}
            meta={[
              { property: 'og:title', content: `${show.name} | ${siteName}` },
              { property: 'twitter:title', content: `${show.name} | ${siteName}` },
              { property: 'og:type', content: 'article' },
              { property: 'og:url', content: `${baseUrl}${locale}/shows/${show._id}` },
            ]}
          />
          {show.about ?
            <Helmet
              meta={[
                { name: 'description', content: show.about },
                { property: 'og:description', content: show.about },
                { property: 'twitter:description', content: show.about },
              ]}
            /> : ''
          }
          <div className="page-actions">
            <Link
              to={`/${locale}/shows/${show._id}/edit`}
              key={`${show._id}-edit`}
              title={`Edit ${show.name}`}
              className="page-edit-link"
            >
              <FormattedMessage
                id="ui.pageEdit"
                description="Page edit link"
                defaultMessage="Edit details"
              />
            </Link>

            <div className="page-actions-share">
              <OutboundLink
                eventLabel="twitter-share"
                to={`https://twitter.com/intent/tweet?text=${show.name} on the World Theatre Map ${baseUrl}${locale}/profiles/${show._id} %23howlround @HowlRound @WorldTheatreMap`}
                className="twitter-share"
              >
                <FormattedMessage
                  id="pageActions.tweet"
                  description="Twitter Share Text"
                  defaultMessage="Tweet"
                />
              </OutboundLink>
              <OutboundLink
                eventLabel="facebook-share"
                to={`https://www.facebook.com/dialog/share?app_id=662843947226126&display=popup&href=${baseUrl}${locale}/shows/${show._id}&redirect_uri=${baseUrl}${locale}/shows/${show._id}`}
                className="facebook-share"
              >
                <FormattedMessage
                  id="pageActions.share"
                  description="Facebook Share Text"
                  defaultMessage="Share"
                />
              </OutboundLink>
            </div>
          </div>
          <Show
            show={show}
            eventsByShow={eventsByShow}
            user={user}
            onEditingChange={this.onEditingChange}
          />
        </div>
      );
    }
  }
}

ShowPage.propTypes = {
  show: React.PropTypes.object,
  eventsByShow: React.PropTypes.array,
  editing: React.PropTypes.string,
  user: React.PropTypes.object,
  loading: React.PropTypes.bool,
  showExists: React.PropTypes.bool,
  intl: intlShape.isRequired,
};

export default injectIntl(ShowPage);
