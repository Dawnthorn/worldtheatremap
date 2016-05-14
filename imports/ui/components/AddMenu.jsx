import React from 'react';
import { Link } from 'react-router';

export default class AddMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }

  open(e) {
    this.setState({
      open: true,
    });
  }

  close(e) {
    this.setState({
      open: false,
    });
  }

  render() {
    const { open } = this.state;
    return (
      <div className="add-menu menu-container menu-right">
        <a href="#" className="add menu-parent" onClick={this.toggle}>
          + Add
        </a>
        { open ?
          <div className="add-options menu-children">
            <Link to="/profiles/add" className="add-profile" onClick={this.close}>Add Profile</Link>
            <Link to="/plays/add" className="add-play" onClick={this.close}>Add Play</Link>
          </div> : ''
        }
      </div>
    );
  }
}
