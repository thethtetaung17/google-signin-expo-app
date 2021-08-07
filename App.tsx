import React from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { fetchUserInfoAsync } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const App = () => {
  const [user, setUser] = useState<any>();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '969557936447-b0p1hp6fds4rsarp9kce5t1acqvmc9t5.apps.googleusercontent.com',
  });
  const fetchUser = async (accessToken: string) => {
    fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => {
        if(data) {
          console.log(data);
          setUser(data)
        }
      })
  }
  React.useEffect(() => {
    if (response?.type === 'success') {
        const { authentication } = response;
        console.log('Authentication:', authentication);
        if(authentication?.accessToken) {
          fetchUser(authentication.accessToken);
        }
      }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        title="Sign In with Google"
        onPress={() => promptAsync()}>
      </Button>
      {
        user && <Text>{JSON.stringify(user)}</Text>
      }
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