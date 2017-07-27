import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import * as DropdownListModule from '@atlaskit/droplist';

const { default: DropdownList, Group, Item } = DropdownListModule;

class UserDropDown extends React.PureComponent<RouteComponentProps<void> & {
  user: User;
}, { open: boolean }> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
    };
  }

  _goToPlugins = () => {
    this.props.history.push('/plugins?me');
  }

  _openChange = (attrs) => {
    this.setState({
      open: attrs.isOpen
    });
  }

  _toggle = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    return (
      <DropdownList
        appearance="default"
        isOpen={this.state.open}
        isTriggerNotTabbable
        onOpenChange={this._openChange}
        position="right bottom"
        trigger={<div onClick={this._toggle}>{this.props.children}</div>}
      >
        <Group heading={this.props.user.displayName}>
          <Item onActivate={this._goToPlugins}>My Plugins</Item>
          <Item href="/rest/auth/logout">Logout</Item>
        </Group>
      </DropdownList>
    )
  }
}

export default withRouter(UserDropDown);
