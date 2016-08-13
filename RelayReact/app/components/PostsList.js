/**
 * @providesModule components/PostsList
 */

import React, { PropTypes, Component } from 'react';
import Relay from 'react-relay';
import {
  StyleSheet,
  View,
  ListView
} from 'react-native';

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.__dataID__ !== r2.__dataID__
});

import PostTitle from 'components/PostTitle';

class PostsList extends Component {
  static propTypes = {
    postConnection: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.postConnection.edges)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.postConnection.edges !== nextProps.postConnection.edges) {
      this.setState({
        dataSource:
          dataSource.cloneWithRows(nextProps.postConnection.edges)
      });
    }
  }

  renderRow(rowData) {
    let edge = rowData;
    let { node } = edge;

    return (
      <PostTitle
        key={node.id}
        post={node}
      />
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={`sep-${sectionID}-${rowID}`}
        style={styles.separator}
      />
    );
  }

  render() {
    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderHeader={this.renderSeparator.bind(this, 'header')}
        renderFooter={this.renderSeparator.bind(this, 'footer')}
        renderSeparator={this.renderSeparator.bind(this)}
      />
    );
  }
}

export default Relay.createContainer(PostsList, {
  fragments: {
    postConnection: () => Relay.QL`
      fragment on PostConnection {
        edges {
          node {
            id
            ${PostTitle.getFragment('post')}
          }
        }
      }
    `
  }
});

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F0F4F7'
  }
});