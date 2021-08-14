import React from 'react';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

const App = () => {
  const [user, setUser] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const injectedJavaScript = `
      setTimeout(function() {
        document.querySelector("input[type=text]").setAttribute("autocapitalize", "off");
      }, 1);
      true;
      `;
  const authorization_url = `https://accounts.google.com/o/oauth2/v2/auth?
    scope=email%20profile&
    response_type=code&
    state=security_token%3D138r5719ru3e1%26url%3Dhttps%3A%2F%2Foauth2.recruitable.asia%2Ftoken&
    redirect_uri=https://www.recruitable.asia&
    client_id=969557936447-b0p1hp6fds4rsarp9kce5t1acqvmc9t5.apps.googleusercontent.com`;
  const googleRef = React.createRef<any>();

  const getAccessToken = async (code: string) => {
    return fetch(
      `https://oauth2.googleapis.com/token?grant_type=authorization_code&code=${code}&redirect_uri=https://www.recruitable.asia&client_id=969557936447-b0p1hp6fds4rsarp9kce5t1acqvmc9t5.apps.googleusercontent.com&client_secret=xk6K7zHb78vlcVGGreYTf6F_`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        return data.access_token;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }; 

  const handleWebViewNavigationStateChange = async (newNavState: any) => {
    const { url } = newNavState;

    if (!url) {
      googleRef.current.stopLoading();
      setModalVisible(false);
    } else if (url.includes('?code=')) {
      googleRef.current.stopLoading();
      const splittedUrl = url.split('?code=');
      const code = splittedUrl[1].split('&state=')[0];
      const accessToken = await getAccessToken(code);
      console.log('accessToken:', accessToken)
      // const { email, name, photo } = await getLinkedInUserInfo(accessToken);
      setModalVisible(false);
    }
  };

  const webBrowserAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(authorization_url);
    console.log("results:", result)
  }

  const renderWebview = () => {
    if (!modalVisible) {
      return null;
    }
    return (
      <WebView
        ref={googleRef}
        source={{
          uri: authorization_url
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        injectedJavaScript={injectedJavaScript}
        sharedCookiesEnabled
        incognito
      />
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Sign In with Google"
        onPress={() => webBrowserAsync()}>
      </Button>
      {
        user && <Text>{JSON.stringify(user)}</Text>
      }
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {renderWebview()}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;