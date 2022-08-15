import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { VStack } from 'native-base';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const navigation = useNavigation();
    const [ state, setState ] = useState({
        patrimony: '',
        description: ''
    });

    const handleChange = (value, prop) => {
        let newState = {...state}
        newState[prop] = value;

        setState({...newState});
    }

    const handleNewOrderRegister = () => {
        if (!state.patrimony || !state.description) {
            return Alert.alert('Registrar', 'Preencha todos os campos!');
        }

        setIsLoading(true);
        firestore()
        .collection('orders')
        .add({
            ...state,
            status: 'open',
            created_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            Alert.alert('Solicitação', 'Solicitação registrada com sucesso!');
            navigation.goBack();
        })
        .catch(error => {
            console.log(error)
            setIsLoading(false)
            return Alert.alert('Solicitação', 'Ocorreu um erro ao tentar registrar a solicitação!');
        })
    }

    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Nova solicitação" />
            <Input
                placeholder="Número do patrimônio"
                mt={4}
                value={state.patrimony}
                onChangeText={value => handleChange(value, 'patrimony')}
            />
            <Input
                placeholder="Descrição do problema"
                mt={5}
                flex={1}
                multiline
                textAlignVertical="top"
                value={state.description}
                onChangeText={value => handleChange(value, 'description')}
            />
            <Button title="Cadastrar" mt={5} isLoading={isLoading} onPress={handleNewOrderRegister} />
        </VStack>
    )
}

export default Register;