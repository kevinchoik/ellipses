import { StyleSheet, Platform } from 'react-native';

const MAIN_COLOR = '#3178d6';
const styles = StyleSheet.create({
	// Draw screen styles
	drawContainer: {
		flex: 1
	},
	drawHeader: {
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	timerText: {
		fontSize: 25
	},
	headerLink: {
		position: 'absolute',
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 10
	},
	headerText: {
		paddingRight: 5,
		fontSize: 20
	},
	drawBackground: {
		flex: 1,
		backgroundColor: '#323232',
		paddingTop: Platform.OS === 'android' ? 25 : 0
	},
	point: {
		position: 'absolute',
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: MAIN_COLOR
	},
	// Global styles
	extend: {
		flex: 1
	},
	text: {
		// color: 'white'
		color: MAIN_COLOR
	}
});
export default styles;
