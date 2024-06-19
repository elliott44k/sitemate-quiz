import { Image, StyleSheet, Platform, TextInput, View, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

export default function HomeScreen() {

  const API_KEY = '183daca270264bad86fc5b72972fb82a';

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const newsSearchSubmit = () => {
    setError(false);
    if (searchValue.length === 0) {
      setError(true);
      setErrorText('Please input a search term')
    } else {
      setLoadingSearch(true);
      console.log(searchValue);
      return fetch('https://newsapi.org/v2/top-headlines?' + new URLSearchParams({
        apiKey: API_KEY,
        q: searchValue,
      }), {
        method: "GET",
      })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            setSearchResults(json.articles);
            setLoadingSearch(false);
          })
          .catch(error => {
            console.error(error);
            setLoadingSearch(false);
          });
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextInput
            style={styles.input}
            onChangeText={setSearchValue}
            value={searchValue}
            placeholder={'Find the news you seek'}
            onSubmitEditing={newsSearchSubmit}
        />
        {error && (
            <ThemedText>
              {errorText}
            </ThemedText>
        )}
        <View>
          <Button
              title="Search"
              onPress={() => newsSearchSubmit()}
          />
        </View>
        {!loadingSearch && searchResults && searchResults.length > 0 && (
            <View>
              <ThemedText type="title">fffff!</ThemedText>
              {searchResults.length}
            </View>
        )}

        {!loadingSearch && searchResults && searchResults.length === 0 && (
            <View>
              <ThemedText type="title">No results found</ThemedText>
            </View>
        )}

        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
