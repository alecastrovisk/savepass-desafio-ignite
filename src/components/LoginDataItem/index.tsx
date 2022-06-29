import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard';

import {
  Container,
  ShowPasswordButton,
  Icon,
  PassData,
  Title,
  Password,
  LoginData,
  BoldTitle,
  Email,
  ClipboardButton,
  DeleteButton
} from './styles';
import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  id: string;
  service_name: string;
  email: string;
  password: string;
  isEditing: boolean;
}

export function LoginDataItem({
  id,
  service_name,
  email,
  password,
  isEditing
}: Props) {
  const [passIsVisible, setPassIsVisible] = useState(false);

  function handleTogglePassIsVisible() {
    setPassIsVisible(!passIsVisible);
    
  }

  async function copyEmailToClipboard() {
    await Clipboard.setStringAsync(`${email}`);
    Alert.alert('Email copiado! 😎');
  }

  async function copyPasswordToClipboard() {
    await Clipboard.setStringAsync(`${password}`);
    Alert.alert('Senha copiada! 🔢');
  }

  async function handleDeleteLoginDataItem({ id }: Props) {
    const dataKey = '@savepass:logins';
    const data = await AsyncStorage.getItem(dataKey);
    const parsedData = data ? JSON.parse(data) : [];

    const newData = parsedData.filter((item: any) => item.id !== id);
    console.log(newData);
    const dataFormatted = [
      ...newData,
    ];

    await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

  }

  return (
    <Container
      colors={[
        passIsVisible
          ? '#EBF2FF'
          : '#ffffff',
        '#ffffff'
      ]}
    >
      <ShowPasswordButton
        onPress={handleTogglePassIsVisible}
      >
        <Icon
          name={passIsVisible ? "eye" : "eye-off"}
          color={passIsVisible ? '#1967FB' : '#888D97'}
        />
      </ShowPasswordButton>

      {passIsVisible
        ? (
          <>
            <PassData>
              <Title>{service_name}</Title>
              <Password selectable={true}>{password}</Password>
            </PassData> 
            {!isEditing ? ( 
            <ClipboardButton onPress={copyPasswordToClipboard}>
              <Icon
                name='clipboard'
              />
            </ClipboardButton> ) : (
              <DeleteButton onPress={handleDeleteLoginDataItem}>
                <Icon
                  size={28}
                  name='trash'
                  color='#E83F5B'
                />
              </DeleteButton>
            )}
          </> 
        )
        : (
          <>
            <LoginData>
              <BoldTitle>{service_name}</BoldTitle>
              <Email selectable={true}>{email}</Email>
            </LoginData>
            {!isEditing ? (
              <ClipboardButton onPress={copyEmailToClipboard}>
                <Icon
                  name='clipboard'
                />
              </ClipboardButton>
              ) :
              <DeleteButton onPress={handleDeleteLoginDataItem}>
                <Icon
                  size={28}
                  name='trash'
                  color='#E83F5B'
                />
              </DeleteButton>
            } 
          </> 
        )
      }
    </Container>
  );
}