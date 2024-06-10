import React, { useState, useEffect } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import axios from 'axios';

export default function BookLoanModal({ modalType, closeModal }) {
  const [bookDropdownValue, setBookDropdownValue] = useState(null);
  const [bookDropdownIsFocus, setBookDropdownIsFocus] = useState(false);

  const [userDropdownValue, setUserDropdownValue] = useState(null);
  const [userDropdownIsFocus, setUserDropdownIsFocus] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [userData, setUserData] = useState([]);
  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    axios.get("http://10.0.0.109:8080/biblioteca/usuarios")
      .then((response) => {
        const usuarios = response.data.map((res) => ({
          label: res.nome,
          value: res.id,
        }));
        setUserData(usuarios);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });

    axios.get("http://10.0.0.109:8080/biblioteca/livros")
      .then((response) => {
        const livros = response.data.map((res) => ({
          label: res.titulo,
          value: res.id,
        }));
        setBookData(livros);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }, []);

  const today = new Date();
  const minimunLoanDay = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY/MM/DD');

  function handleLoan() {
    const loanRegister = {
      book: bookDropdownValue,
      user: userDropdownValue,
      returnDate: selectedDate
    };

    if (Object.values(loanRegister).includes(null)) {
      Alert.alert(
        'Atenção!', 'Para fazer um empréstimo é necessário preencher todos os campos.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed!') }]
      );

      return;
    }

    console.log(loanRegister);
  }

  return (
    <Modal visible={modalType === 'loan'} transparent={true} animationType="slide">
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              setBookDropdownValue(null);
              setUserDropdownValue(null);
              setSelectedDate(null);
              closeModal();
            }}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Empréstimo/Devolução</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, bookDropdownIsFocus && { borderColor: '#EECE4F' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={bookData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!bookDropdownIsFocus ? 'Selecionar livro' : '...'}
              searchPlaceholder="Procurar..."
              value={bookDropdownValue}
              onFocus={() => setBookDropdownIsFocus(true)}
              onBlur={() => setBookDropdownIsFocus(false)}
              onChange={item => {
                setBookDropdownValue(item.value);
                setBookDropdownIsFocus(false);
              }}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, userDropdownIsFocus && { borderColor: '#EECE4F' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={userData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!userDropdownIsFocus ? 'Selecionar usuário' : '...'}
              searchPlaceholder="Procurar..."
              value={userDropdownValue}
              onFocus={() => setUserDropdownIsFocus(true)}
              onBlur={() => setUserDropdownIsFocus(false)}
              onChange={item => {
                setUserDropdownValue(item.value);
                setUserDropdownIsFocus(false);
              }}
            />
          </View>

          <Text style={{ fontSize: 16, alignSelf: 'center', marginTop: 20 }}>
            Data de devolução:
          </Text>

          <DatePicker
            mode='calendar'
            minimumDate={minimunLoanDay}
            onSelectedChange={date => setSelectedDate(date)}
          />
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleLoan}
            >
              <Text style={styles.registerButtonText}>Empréstimo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={() => {}}>
              <Text style={styles.registerButtonText}>Devolução</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  // dropdown styles
  dropdownContainer: {
    backgroundColor: 'white',
    marginVertical: 10
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#EECE4F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
