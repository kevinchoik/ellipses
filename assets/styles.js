import { StyleSheet, Platform } from 'react-native';
import { MAIN_BLUE, MAIN_BLACK, MAIN_GREY } from './colorScheme';

const styles = StyleSheet.create({
	// Draw screen styles
	drawContainer: {
		flex: 1
	},
	drawBackground: {
		flex: 1,
		backgroundColor: MAIN_BLACK
	},
	point: {
		position: 'absolute',
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: MAIN_BLUE
	},
	// List screen styles
	listBackground: {
		flex: 1,
		backgroundColor: MAIN_BLACK
	},
	listWrap: {
		flex: 1,
		marginTop: 10
	},
	listItem: {
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 15
	},
	evenItem: {
		backgroundColor: MAIN_GREY
	},
	// headerMore: {
	// 	fontSize: 40,
	// 	fontWeight: 'bold',
	// 	marginTop: -20
	// },
	// headerDrop: {
	// 	width: 100,
	// 	position: 'absolute',
	// 	top: 0,
	// 	right: 0,
	// 	backgroundColor: 'white'
	// },
	// dropItem: {

	// },
	// Event screen styles
	eventBackground: {
		flex: 1,
		backgroundColor: MAIN_BLACK
	},
	eventReplay: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	replayText: {
		paddingRight: 10,
		fontSize: 36
	},
	// Header styles
	header: {
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerTitle: {
		fontSize: 25
	},
	headerLink: {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center'
	},
	linkRight: {
		right: 0
	},
	linkLeft: {
		left: 0
	},
	btnRight: {
		marginRight: 10,
		marginLeft: 8
	},
	btnLeft: {
		marginRight: 8,
		marginLeft: 10
	},
	headerBtn: {
		fontSize: 20
	},
	// Global styles
	extend: {
		flex: 1
	},
	text: {
		color: MAIN_BLUE,
		fontSize: 18
	}
});
export default styles;
