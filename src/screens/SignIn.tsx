import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Heading, Icon, VStack, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg';
import Button from '../components/Button';
import Input from '../components/Input';
import { Alert } from 'react-native';


const SignIn = () => {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ state, setState ] = useState({
        email: '',
        password: ''
    })
    const { colors } = useTheme();
    const errorSignIn = {
        'auth/invalid-email': 'E-mail inválido!',
        'auth/user-not-found': 'Usuário e/ou senha inválida!',
        'auth/wrong-password': 'Usuário e/ou senha inválida!',
    }

    const handleChange = (value, prop) => {
        let newState = {...state}

        newState[prop] = value
        setState({ ...newState })
    }

    const handleValidate = () => {
        if (!state.email || !state.password) {
            Alert.alert('Entrar', 'Informe e-mail e senha');
            return false;
        }

        return true;
    }

    const handleSignIn = () => {
        if (!handleValidate()) {
            return;
        }

        setIsLoading(true)

        auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .catch(error => {
            console.log(error);
            setIsLoading(false)

            if (errorSignIn[error.code]) {
                return Alert.alert('Entrar', errorSignIn[error.code])
            }

            return Alert.alert('Entrar', 'Ocorreu um erro interno, tente novamente mais tarde!')
        })
    }

    return (
        <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
            <Logo />
            <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>
            <Input
            placeholder="E-mail"
            mb={4}
            InputLeftElement={
                <Icon as={<Envelope color={colors.gray[300]} />}
                ml={4}
            />}
            value={state.email}
            onChangeText={value => handleChange(value, 'email')}
            />
            <Input
            mb={8}
            placeholder="Senha"
            secureTextEntry
            InputLeftElement={
                <Icon as={<Key color={colors.gray[300]} />}
                ml={4}
            />}
            value={state.password}
            onChangeText={value => handleChange(value, 'password')}
            />
            <Button title="Entrar" w="full" onPress={handleSignIn} isLoading={isLoading} />
        </VStack>
    )
}

export default SignIn