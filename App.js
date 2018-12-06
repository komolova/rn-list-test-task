import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SectionList,
  Platform,
  TextInput,
  Image
} from 'react-native';

import { events } from './data';

const dataArr = Object.values(events);

export default class App extends Component {
  state = {
    inputValue: '',
    list: [],
    isTitleVisible: false
  }

  componentDidMount() {
    this.getInitialListState();
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;
    if (prevState.inputValue.trim() !== inputValue.trim()) {
      if (inputValue.length > 0) {
        this.searchItems();
      } else {
        this.getInitialListState();
      }
    }
  }

  onChangeText = (value) => {
    this.setState({
      inputValue: value
    });
  }

  getInitialListState = () => {
    this.setState({
      list: this.sortDefaultList(),
      isTitleVisible: true
    })
  }

  sortDefaultList = () => {
    const defaultList = this.getDefaultList().sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    return defaultList;
  }

  searchItems = () => {
    const { inputValue } = this.state;
    const defaultList = this.getDefaultList();
    const dataList = defaultList.reduce((acc, item) => {
      const itemData = item.data.filter(el =>
        el.toLowerCase().includes(inputValue.toLowerCase())
      );
      return [...acc, ...itemData];
    }, []);
    this.setState({
      list: [{ data: dataList }]
    })
  }

  groupByFirstLetter = () => {
    return dataArr.reduce((acc, current) => {
      (acc[current.title[0].toUpperCase()] =
        acc[current.title[0].toUpperCase()] ||
        []).push(current.title);
      return acc;
    }, {});
  }

  getDefaultList = () => {
    const grouppedData = this.groupByFirstLetter();
    let mergedList = [];

    for (let key in grouppedData) {
      let obj = { title: key, data: grouppedData[key] };
      mergedList = [...mergedList, obj];
    }

    return mergedList;
  }

  clearInput = () => {
    this.setState({
      inputValue: ''
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            value={this.state.inputValue}
            style={styles.input}
            onChangeText={this.onChangeText}
            blurOnSubmit={false}
            clearButtonMode={Platform.OS === 'ios' ? 'always' : 'never'}
          />
          {this.state.inputValue.length > 0 &&
            <TouchableOpacity onPress={this.clearInput}>
              <Image
                style={{ width: 24, height: 24 }}
                source={require('./assets/delete.png')}
              />
            </TouchableOpacity>
          }
        </View>
        <ScrollView>
          <SectionList
            renderItem={({ item, index }) => <Text style={styles.listItem} key={index}>{item}</Text>}
            renderSectionHeader={({ section: { title } }) => (
              title && this.state.isTitleVisible && <Text style={styles.sectionHeader}>{title}</Text>
            )}
            sections={this.state.list}
            keyExtractor={(item, index) => item + index}
          />
        </ScrollView>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 20
  },
  inputContainer: {
    borderColor: 'silver',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20
  },
  input: {
    height: 40,
    flex: 1,
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10
  },
  listItem: {
    lineHeight: 25,
  },
});
