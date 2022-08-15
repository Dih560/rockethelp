import { useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base';
import { CaretLeft, SignOut } from 'phosphor-react-native';
import Logo from '../assets/logo_secondary.svg';

type Props = StyledProps & {
    title: string;
}

const Header = ({title, ...rest}) => {
    const { colors } = useTheme()
    const navigation = useNavigation()

    const handleGoBack = () => {
        navigation.goBack();
    }

    return (
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={6}
            {...rest}
        >
            <IconButton
                icon={<CaretLeft color={colors.gray[200]} size={24} />}
                onPress={handleGoBack}
            />

            <Heading color="gray.100" textAlign="center" fontSize="lg" flex={1} ml={-6}>
                {title}
            </Heading>
        </HStack>
    )
}

export default Header;