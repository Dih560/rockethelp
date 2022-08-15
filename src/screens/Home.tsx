import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { dateFormat } from '../utils/firestoreDateFormat';

import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import Logo from '../assets/logo_secondary.svg';
import Filter from '../components/Filter';
import Order, { OrderProps } from '../components/Order';
import Button from '../components/Button';
import { Alert } from 'react-native';
import Loading from '../components/Loading';

const Home = () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ statusSelected, setStatusSelected ] = useState<'open' | 'closed'>('open')
    const [ orders, setOrders ] = useState<OrderProps[]>([]);
    const { colors } = useTheme()
    const navigation = useNavigation();

    const handleNewOrder = () => {
        navigation.navigate('new');
    }

    const handleOpenDetails = (orderId: string) => {
        navigation.navigate('details', { orderId })
    }

    const handleLogout = () => {
        auth()
        .signOut()
        .catch(error => {
            console.log(error);
            return Alert.alert('Sair', 'Ocorreu um erro ao tentar sair, tente novamente mais tarde!');
        })
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
        .collection('orders')
        .where('status', '==', statusSelected)
        .onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => {
                const { patrimony, description, status, created_at } = doc.data();

                return {
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    when: dateFormat(created_at)
                }
            })

            setOrders(data);
            setIsLoading(false);
        })

        return subscriber;
    }, [statusSelected])

    return (
    <VStack flex={1} pb={6} bg="gray.700">
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={5}
            px={6}
        >
            <Logo />
            <IconButton
                icon={<SignOut size={26} color={colors.gray[300]} />}
                onPress={handleLogout}
            />
        </HStack>
        <VStack flex={1} px={6}>
            <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                <Heading color="gray.100">Solicitações</Heading>
                <Text color="gray.200">{isLoading ? <Loading /> : orders.length}</Text>
            </HStack>
            <HStack space={3} mb={8}>
                <Filter
                    title="Em andamento"
                    type="open"
                    onPress={() => setStatusSelected('open')}
                    isActive={statusSelected === 'open'}
                />
                <Filter
                    title="Finalizados"
                    type="closed"
                    onPress={() => setStatusSelected('closed')}
                    isActive={statusSelected === 'closed'}
                />
            </HStack>
            {
                isLoading ? <Loading /> :
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    ListEmptyComponent={() => (
                        <Center>
                            <ChatTeardropText color={colors.gray[300]} size={40} />
                            <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                Você não possui {'\n'}
                                solicitações { statusSelected === 'open' ? 'em andamento' : 'finalizadas' }
                            </Text>
                        </Center>
                    )}
                />
            }

            <Button title="Nova solicitação" onPress={handleNewOrder} />
        </VStack>
    </VStack>
    );
}

export default Home;