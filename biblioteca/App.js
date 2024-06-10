import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

import BookLoanModal from './src/components/BookLoanModal';

export default function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [visiblePopup, setVisiblePopup] = useState(null); // Estado para controlar qual pop-up está visível
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [publicationYear, setPublicationYear] = useState();

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const openPopup = (popup) => {
    setVisiblePopup(popup);
  };

  const closePopup = () => {
    setVisiblePopup(null);
  };

  const handleRegisterUser = () => {
    const usuario = {
      nome: username,
      email: email,
      cpf: cpf
    };

    console.log('Enviando dados do usuário:', usuario);

    axios.post('http://10.0.0.109:8080/biblioteca/usuario', usuario)
      .then(response => {
        console.log('Resposta do servidor:', response);
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        setUsername('');
        setEmail('');
        setCpf('');
        closePopup();
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        Alert.alert('Erro', 'Falha ao cadastrar o usuário. Tente novamente.');
      });
  };

  const handleRegisterBook = () => {
    const livro = {
      titulo: bookTitle,
      anoPublicacao: publicationYear
    };

    console.log('Enviando dados do livro:', livro);

    axios.post('http://10.0.0.109:8080/biblioteca/livro', livro)
      .then(response => {
        console.log('Resposta do servidor:', response);
        Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
        setBookTitle('');
        setPublicationYear('');
        closePopup();
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
        Alert.alert('Erro', 'Falha ao cadastrar o livro. Tente novamente.');
      });
  };

  return (
    <View style={styles.container}>
      {isSideBarOpen && (
        <View style={styles.sideBar}>
          <TouchableOpacity style={styles.sideBarButton} onPress={() => openPopup('user')}>
            <MaterialIcons name="person-add" size={24} color="black" />
            <Text style={styles.sideBarText}>Cadastrar usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideBarButton} onPress={() => openPopup('book')}>
            <MaterialIcons name="library-books" size={24} color="black" />
            <Text style={styles.sideBarText}>Cadastrar livro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideBarButton} onPress={() => openPopup('loan')}>
            <MaterialIcons name="compare-arrows" size={24} color="black" />
            <Text style={styles.sideBarText}>Criar empréstimo</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.hamburgueButton} onPress={toggleSideBar}>
          <MaterialIcons name="menu" size={45} color="white" />
        </TouchableOpacity>
      </View>

      {/* Pop-up para Cadastrar Usuário */}
      <Modal visible={visiblePopup === 'user'} transparent={true} animationType="slide">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
              <MaterialIcons name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.popupText}>Cadastrar usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email do usuário"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="CPF do usuário"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegisterUser}>
              <Text style={styles.registerButtonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pop-up para Cadastrar Livro */}
      <Modal visible={visiblePopup === 'book'} transparent={true} animationType="slide">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <TouchableOpacity onPress={closePopup}>
              <MaterialIcons name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.popupText}>Cadastrar livro</Text>
            <TextInput
              style={styles.input}
              placeholder="Título do Livro"
              value={bookTitle}
              onChangeText={setBookTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Ano de Publicação"
              value={publicationYear}
              onChangeText={setPublicationYear}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegisterBook}>
              <Text style={styles.registerButtonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pop-up para Realizar Empréstimo */}
      <BookLoanModal
        modalType={visiblePopup}
        closeModal={closePopup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1C4',
  },
  header: {
    flex: 0.15,
    backgroundColor: '#EECE4F',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    height: '100%',
    resizeMode: 'contain',
    flex: 0.3,
    top: '5%',
  },
  hamburgueButton: {
    position: 'absolute',
    left: '2.5%',
    top: '50%',
  },
  sideBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    top: '12%',
    bottom: 0,
    left: 0,
    width: '60%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  sideBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '75%',
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  sideBarText: {
    color: 'black',
    marginLeft: 10,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  popupText: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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
