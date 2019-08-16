import { createStackNavigator, createAppContainer } from 'react-navigation';
import { DrawScreen, EventScreen, ListScreen, SettingsScreen } from './screens';
import { SCREENS } from './constants';

const Navigator = createStackNavigator(
	{
		Draw: DrawScreen,
		Event: EventScreen,
		List: ListScreen,
		Settings: SettingsScreen
	},
	{
		initialRouteName: SCREENS.DRAW,
		headerMode: 'none'
	}
);

export default createAppContainer(Navigator);
