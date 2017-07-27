import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AkAvatar from '@atlaskit/avatar';
import * as AkNavigationModule from '@atlaskit/navigation';

import UserDropDown from './UserDropDown';
import Logo from '../assets/Logo';

import * as styles from './PageWrapper.scss';

const { default: AkNavigation, AkContainerTitle, AkNavigationItemGroup, AkNavigationItem, AkGlobalItem } = AkNavigationModule;

const LinkWrapper = (props) => <Link {...props} to={props.href} />;

interface PageWrapperReduxProps {
  app: Application;
  user: UserSubState;
}
interface PageWrapperComponentProps {}

class PageWrapper extends React.PureComponent<{}, {}> {
  props: PageWrapperReduxProps & PageWrapperComponentProps;
  signedInSecondaryActions() {
    const photoUrl = (this.props.user.user.photos && this.props.user.user.photos.length > 0) ? this.props.user.user.photos[0].value : '';
    return [<UserDropDown user={this.props.user.user}><AkGlobalItem size="small"><AkAvatar size="small" src={photoUrl} /></AkGlobalItem></UserDropDown>];
  }

  signedOutSecondaryActions() {
    return [<AkGlobalItem size="small" href="/rest/auth/login"><AkAvatar size="small" /></AkGlobalItem>];
  }

  render() {
    const isSignedIn = this.props.user.signedIn;
    const navProps = isSignedIn ? () => ({
      globalSecondaryActions: this.signedInSecondaryActions(),
    }) : () => ({
      globalSecondaryActions: this.signedOutSecondaryActions(),
    });
    const isAdmin = this.props.user.signedIn ? this.props.user.user.isAdmin : false;
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.navContainer}>
          <AkNavigation
            globalPrimaryIcon={<Logo />}
            isResizeable={false}
            {...navProps()}
          >
            <AkContainerTitle text={`${this.props.app.name} Plugins`} subText="Powered by Ionizer" />
            <AkNavigationItemGroup title="Plugins">
              <AkNavigationItem text="View List" linkComponent={LinkWrapper} href="/plugins" />
              <AkNavigationItem text="Report An Issue" />
            </AkNavigationItemGroup>
            { isSignedIn ? 
            <AkNavigationItemGroup title="My Plugins">
              <AkNavigationItem text="View" linkComponent={LinkWrapper} href="/plugins?me" />
            </AkNavigationItemGroup> : null }
            { isAdmin ?
            <AkNavigationItemGroup title="Administration">
              <AkNavigationItem text="Review Submissions" href="/admin/review" linkComponent={LinkWrapper} />
            </AkNavigationItemGroup> : null
            }
          </AkNavigation>
        </div>
        <div className={styles.pageContainer}>{this.props.children}</div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  app: state.app,
  user: state.user,
});

export default connect<PageWrapperReduxProps, void, PageWrapperComponentProps>(mapStateToProps, null)(PageWrapper);
