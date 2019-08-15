import { createStackNavigator, createAppContainer } from 'react-navigation';
import { DrawScreen, EventScreen, ListScreen } from './screens';
import { SCREENS } from './constants';

const Navigator = createStackNavigator(
	{
		Draw: DrawScreen,
		Event: EventScreen,
		List: ListScreen
	},
	{
		initialRouteName: SCREENS.DRAW,
		headerMode: 'none'
	}
);

export default createAppContainer(Navigator);
