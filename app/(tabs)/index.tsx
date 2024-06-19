import {
  StyleSheet,
  TextInput,
  View,
  Button,
  StatusBar,
  ScrollView,
  SafeAreaView,
  FlatList, Text, Linking, Platform
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { white } from 'colorette';

export default function HomeScreen() {
  const API_KEY = '183daca270264bad86fc5b72972fb82a';
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState();
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const newsSearchSubmit = () => {
    setError(false);
    // show error if no search input
    if (searchValue.length === 0) {
      setError(true);
      setErrorText('Please input a search term')
    } else {
      setLoadingSearch(true);
      return fetch('https://newsapi.org/v2/top-headlines?' + new URLSearchParams({
        apiKey: API_KEY,
        q: searchValue,
      }), {
        method: "GET",
      })
          .then(response => response.json())
          .then(json => {
            // return first 5 results from response
            if (json.articles?.length >= 5) {
              setSearchResults(json.articles.slice(0, 5))
            } else {
              setSearchResults(json.articles);
            }
            setLoadingSearch(false);
          })
          .catch(error => {
            console.error(error);
            setLoadingSearch(false);
          });
    }
  }

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">News Search!</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>Find up to 5 articles for any search</ThemedText>
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
        {!loadingSearch && searchResults && searchResults.length > 0 && Platform.OS === 'web' &&(
            <View>
              <ol style={{paddingLeft:'30px'}}>
                {searchResults.map(article =>
                  <li style={{marginBottom: '20px'}} key={article.title}>
                    <Text>{article.title}</Text>
                    <Text style={{color: 'blue'}}
                        onPress={() => Linking.openURL(article.url)}>
                      {article.url}
                    </Text>
                  </li>
                )}
              </ol>
            </View>
        )}

        {!loadingSearch && searchResults && searchResults.length > 0 && Platform.OS === 'ios' &&(
            <View>
              <ThemedText type="title">Results:</ThemedText>
                {searchResults.map(article =>
                  <ThemedText style={{paddingTop:20, paddingBottom:20}}>
                    <Text>{article.title}</Text>
                    <Text style={{color: 'blue'}}
                      onPress={() => Linking.openURL(article.url)}>
                      {article.url}
                    </Text>
                  </ThemedText>
                )}
            </View>
        )}

        {!loadingSearch && searchResults && searchResults.length === 0 && (
            <View>
              <ThemedText type="title">No results found</ThemedText>
            </View>
        )}
      </ThemedView>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 50,
    paddingBottom: 20
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white'
  },
  scrollView: {
    marginHorizontal: 20,
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
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
});
