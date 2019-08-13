import { createStackNavigator, createAppContainer } from 'react-navigation';
import { DrawScreen, EventScreen, ListScreen } from './screens';
import { SCREENS } from './constants';
import { MAIN_BLUE } from './assets/colorScheme';
import styles from './assets/styles';

const navigationOptions = {
	headerStyle: styles.header,
	headerTintColor: MAIN_BLUE
};

const Navigator = createStackNavigator(
	{
		Draw: {
			screen: DrawScreen,
			navigationOptions: {
				header: null
			}
		},
		Event: {
			screen: EventScreen,
			navigationOptions
		},
		List: {
			screen: ListScreen,
			navigationOptions
		}
	},
	{ initialRouteName: SCREENS.DRAW }
);

export default createAppContainer(Navigator);
