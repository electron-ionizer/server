import * as React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { setApp } from './actions/app';
import { setUser } from './actions/user';
import PageWrapper from './components/PageWrapper';
import PluginList from './components/PluginList';

import AkSpinner from '@atlaskit/spinner';

import * as styles from './App.scss';

class App extends React.PureComponent<{ app: Application, user: User, setUser: typeof setUser, setApp: typeof setApp }, {}> {
  async componentDidMount() {
    const response = await fetch('/rest/config', { credentials: 'include' });
    const config: { user: User, app: Application } = await response.json();
    this.props.setUser(config.user);
    this.props.setApp(config.app);
  }

  render() {
    if (!this.props.app.name) {
      return (
        <div className={styles.loader}>
          <AkSpinner size={160} />
        </div>
      )
    }

    return (
      <Router>
        <PageWrapper>
          <Route exact path="/" component={() => <Redirect to="/plugins" />} />
          <Route path="/plugins">
            <Route exact path="/">
              <PluginList />
            </Route>
          </Route>
          {/*<Route path="*" component={NotFoundPage} />*/}
        </PageWrapper>
      </Router>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  app: state.app,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: user => dispatch(setUser(user)),
  setApp: app => dispatch(setApp(app)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);