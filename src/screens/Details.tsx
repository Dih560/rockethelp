import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import Header from '../components/Header';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';

import { dateFormat } from '../utils/firestoreDateFormat';
import { Alert } from 'react-native';
import Loading from '../components/Loading';
import { CircleWavyCheck, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import CardDetails from '../components/CardDetails';
import Input from '../components/Input';
import Button from '../components/Button';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

const Details = () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ solution, setSolution ] = useState('');
    const [ state, setState ] = useState<OrderDetails>({} as OrderDetails);
    const { colors } = useTheme();

    const route = useRoute();
    const { orderId } = route.params as RouteParams;
    const navigation = useNavigation();

    const handleOrderClose = () => {
        if (!solution) {
            return Alert.alert('Solicitaçaõ', 'Informe a solução do problema!');
        }

        firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .update({
            status: 'closed',
            solution,
            closed_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            Alert.alert('Solicitação', 'Solicitação encerrada com sucesso!');
            navigation.goBack();
        })
        .catch(error => {
            console.log(error);
            return Alert.alert('Solicitação', 'Ocorreu um erro ao tentar encerrar a solicitação, tente novamente mais tarde!');
        })
    }

    useEffect(() => {
        let subscripber = firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .get()
        .then(doc => {
            let { patrimony, description, status, created_at, closed_at, solution } = doc.data();

            let closed = closed_at ? dateFormat(closed_at) : '';

            setState({
                id: doc.id,
                patrimony,
                description,
                status,
                solution,
                when: dateFormat(created_at),
                closed
            })

            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Solicitação', 'Ocorreu um erro ao tentar buscar os dados, tente novamente mais tarde!');
            return navigation.goBack();
        })

    }, [orderId]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box px={6} bg='gray.600'>
                <Header title="Solicitação" />
            </Box>
            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    state.status === 'closed'
                    ?
                    <CircleWavyCheck size={22} color={colors.green[300]} />
                    :
                    <Hourglass size={22} color={colors.secondary[700]} />
                }
                <Text fontSize="sm" color={state.status === 'closed' ? colors.green[300] : colors.secondary[700]} ml={2} textTransform="uppercase">{state.status === 'closed' ? 'Finalizado' : 'Em andamento'}</Text>
            </HStack>
            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="Equipamento"
                    description={`Patrimônio ${state.patrimony}`}
                    icon={DesktopTower}
                />
                <CardDetails
                    title="Descrição do problema"
                    description={state.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${state.when}`}
                />

                <CardDetails
                    title="Solução"
                    description={state.solution}
                    icon={CircleWavyCheck}
                    footer={state.closed && `Encerrado em ${state.closed}`}
                    children={!state.solution && <Input placeholder="Descreva a solução do problema" onChangeText={setSolution} value={solution} h={24} textAlignVertical="top" multiline />}
                />
            </ScrollView>
            {
                state.status === 'open' &&
                <Button title="Encerrar Solicitação" onPress={handleOrderClose} m={5} />
            }
        </VStack>
    )
}

export default Details;