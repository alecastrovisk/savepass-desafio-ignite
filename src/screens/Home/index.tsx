import React, { useState, useCallback } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  EditButton,
  Icon,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);
  const [isEditing, setIsEditing] = useState(false);

  async function loadData() {
    const dataKey = '@savepass:logins';
    const response = await AsyncStorage.getItem(dataKey);
    const parsedData = response ? JSON.parse(response) : [];

    if(parsedData) {
      setData(parsedData);
      setSearchListData(parsedData);
    }
    // Get asyncStorage data, use setSearchListData and setData
  }

  function handleFilterLoginData() {
    const filteredData = data.filter(data => {
      if(data.service_name.includes(searchText)) {
        return data;
      }
    });
    setSearchListData(filteredData);
    // Filter results inside data, save with setSearchListData
  }

  function handleChangeInputText(text: string) {
    if(text === '') {
      setSearchListData(data);
    }
    setSearchText(text);
    // Update searchText value
  }

  function handleEdit() {
    setIsEditing(!isEditing);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Alexandre',
          avatar_url: 'https://github.com/alecastrovisk.png'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}

          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <EditButton onPress={handleEdit}>
            <Icon
              name='edit'
            />
          </EditButton>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              id={loginData.id}
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
              isEditing={isEditing}
            />
          }}
        />
      </Container>
    </>
  )
}