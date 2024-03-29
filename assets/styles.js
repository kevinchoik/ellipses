import { StyleSheet } from 'react-native';
import { MAIN_BLUE, MAIN_BLACK, MAIN_GREY, EVENT_RED } from './colorScheme';

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
		marginTop: 15
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
	// Settings screen styles
	settingsWrap: {
		flex: 1,
		marginTop: 15,
		position: 'relative'
	},
	settingsItem: {
		fontSize: 22
	},
	pickerStack: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	settingsPicker: {
		width: 50
	},
	pickerItem: {
		height: 120,
		fontSize: 22
	},
	pickerLabelWrap: {
		justifyContent: 'center'
	},
	pickerLabel: {
		fontSize: 22
	},
	pickerHour: {
		width: 60,
		marginRight: 10
	},
	pickerFooter: {
		flexDirection: 'row',
		marginVertical: 10
	},
	footerBtnWrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	// Event screen styles
	eventBackground: {
		flex: 1,
		backgroundColor: MAIN_BLACK
	},
	eventDate: {
		marginRight: 10,
		fontSize: 18
	},
	eventReplayWrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative'
	},
	eventReplay: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	replayText: {
		paddingRight: 10,
		fontSize: 36
	},
	eventFooter: {
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row'
	},
	footerItem: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	eventHeader: {
		position: 'absolute',
		top: 20,
		marginHorizontal: 20
	},
	eventTitle: {
		fontSize: 25,
		textAlign: 'center'
	},
	modalWrap: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal: {
		width: '80%',
		maxHeight: '80%',
		backgroundColor: MAIN_BLACK,
		borderRadius: 10,
		paddingHorizontal: 30,
		paddingVertical: 20,
		alignItems: 'center'
	},
	modalTitle: {
		fontSize: 24,
		marginBottom: 15
	},
	modalBody: {
		marginBottom: 20,
		width: '100%'
	},
	modalList: {
		flexGrow: 0,
		flexShrink: 0
	},
	modalSpacing: {
		marginBottom: 10
	},
	modalProgress: {
		flexDirection: 'row',
		borderRadius: 9,
		overflow: 'hidden'
	},
	progressBar: {
		height: 18,
		justifyContent: 'center'
	},
	progressDone: {
		backgroundColor: MAIN_BLUE,
		paddingRight: 5,
		alignItems: 'flex-end'
	},
	progressLeft: {
		backgroundColor: MAIN_GREY,
		paddingLeft: 5
	},
	textGrey: {
		color: MAIN_GREY
	},
	modalLabelWrap: {
		alignItems: 'flex-end'
	},
	modalLabelBottom: {
		flexDirection: 'row'
	},
	modalLabel: {
		fontSize: 12
	},
	labelTop: {
		marginBottom: 3
	},
	labelBottom: {
		marginTop: 3
	},
	modalBtn: {
		fontSize: 20
	},
	// Header styles
	header: {
		height: 35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerTitle: {
		fontSize: 28
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
	noIcon: {
		marginRight: 10
	},
	// Global styles
	extend: {
		flex: 1
	},
	text: {
		color: MAIN_BLUE,
		fontSize: 18
	},
	deleteBtn: {
		color: EVENT_RED
	}
});
export default styles;
