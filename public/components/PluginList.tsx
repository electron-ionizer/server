import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import AkSpinner from '@atlaskit/spinner';
import PageLoader from './PageLoader';

import { fetchPlugins, setPlugins } from '../actions/plugins';

import * as styles from './PluginList.scss';

interface PluginListReduxProps {
  plugins: PluginSubState
}
interface PluginListReduxDispatchProps {
  setPlugins: (plugins: IonizerPlugin[]) => any,
}
interface PluginListComponentProps {}

class PluginList extends React.PureComponent<{}, { loading: boolean }> {
  props: PluginListReduxProps & PluginListReduxDispatchProps & PluginListComponentProps;
  state = { loading: false };

  componentDidMount() {
    if (!this.props.plugins) {
      this.fetchPlugins();
    }
  }

  async fetchPlugins() {
    this.setState({
      loading: true,
    });
    this.props.setPlugins(await fetchPlugins());
    this.setState({
      loading: false,
    });
  }

  render() {
    return (
      <div>
        <h3>Plugins</h3>
        <PageLoader visible={this.state.loading} />
        {
          !this.state.loading && this.props.plugins ? 
          this.props.plugins.map((plugin) => {
            return (
              <div key={plugin.id}>
                {plugin.name}
              </div>
            );
          })
          : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  plugins: state.plugins
});

const mapDispatchToProps = (dispatch: Dispatch<void>) => ({
  setPlugins: (plugins: IonizerPlugin[]) => dispatch(setPlugins(plugins)),
})

export default connect<PluginListReduxProps, PluginListReduxDispatchProps, PluginListComponentProps>(mapStateToProps, mapDispatchToProps)(PluginList);
