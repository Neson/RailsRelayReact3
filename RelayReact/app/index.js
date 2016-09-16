import React, { Component } from 'react';
import Relay, { DefaultNetworkLayer } from 'react-relay';

Relay.injectNetworkLayer(
  new DefaultNetworkLayer('http://localhost:3000/graphql')
);

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Navigator,
  StatusBar,
  TouchableOpacity
} from 'react-native';

import WelcomePage from './WelcomePage';

import NavigationBarTitle from 'components/NavigationBarTitle';
import NavigationBarPostTitleContainer from 'containers/NavigationBarPostTitleContainer';

import SitePostsContainer from 'containers/SitePostsContainer';
import PostWithCommentsContainer from 'containers/PostWithCommentsContainer';
import NewPostContainer from 'containers/NewPostContainer';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#262D36"
          barStyle="light-content"
        />
        <Navigator
          initialRoute={{ name: 'latestPosts' }}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={{
                LeftButton: (route, navigator, index, navState) => {
                  if (index > 0) return (
                    <TouchableOpacity style={styles.navigationLeftButton} onPress={navigator.pop}>
                      <Text style={styles.navigationLeftButtonText}> ‹ </Text>
                    </TouchableOpacity>
                  );
                },
                RightButton: (route, navigator, index, navState) => {},
                Title: (route, navigator, index, navState) => {
                  switch (route.name) {
                  case 'latestPosts':
                    return (
                      <NavigationBarTitle>
                        Latest Posts
                      </NavigationBarTitle>
                    );
                  case 'post':
                    return (
                      <NavigationBarPostTitleContainer
                        postID={route.postID}
                      />
                    );
                  case 'newPost':
                    return (
                      <NavigationBarTitle>
                        New Post
                      </NavigationBarTitle>
                    );
                  default:
                    return (
                      <NavigationBarTitle>
                        Welcome
                      </NavigationBarTitle>
                    );
                  }
                }
              }}
              style={styles.navigationBar}
            />
          }
          renderScene={(route, navigator) => {
            switch (route.name) {
            case 'latestPosts':
              return (
                <View style={styles.content}>
                  <SitePostsContainer
                    onPostPress={(postID) => {
                      navigator.push({ name: 'post', postID });
                    }}
                  />
                  <TouchableOpacity
                    style={styles.newPostBtn}
                    onPress={() => {
                      navigator.push({ name: 'newPost' });
                    }}
                  >
                    <Text style={styles.newPostBtnText}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            case 'post':
              return (
                <View style={styles.content}>
                  <PostWithCommentsContainer
                    postID={route.postID}
                  />
                </View>
              );
            case 'newPost':
              return (
                <View style={styles.content}>
                  <NewPostContainer
                    onCreateSuccess={(post) => {
                      navigator.pop();
                    }}
                  />
                </View>
              );
            default:
              return (
                <View style={styles.content}>
                  <WelcomePage navigator={navigator} />
                </View>
              );
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigationBar: {
    backgroundColor: '#313B47'
  },
  navigationLeftButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  navigationLeftButtonText: {
    color: '#FFF',
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '200'
  },
  content: {
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: 64
      },
      android: {
        paddingTop: 56
      }
    }),
    backgroundColor: '#F0F4F7'
  },
  newPostBtn: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    borderRadius: 9999,
    height: 45,
    width: 45,
    backgroundColor: '#FD6E4D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  newPostBtnText: {
    fontSize: 24,
    lineHeight: 24,
    color: '#FFF'
  }
});
