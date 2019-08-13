import React, { Component } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	AsyncStorage
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

class Draw extends Component {
	constructor(props) {
		super(props);
		this.state = {
			points: [],
			record: [],
			startTime: 0,
			timer: 5
		};
		this.interval = null;
	}

	startRecord = event => {
		if (!this.interval) {
			this.interval = setInterval(() => {
				if (this.state.timer === 1) {
					// When time runs out, go to list screen
					clearInterval(this.interval);
					// Save the new recording
					const record = {
						record: this.state.record,
						time: this.state.startTime
					};
					AsyncStorage.getItem('record')
						.then(recordList => {
							// Get current list of recordings
							if (!recordList) {
								recordList = [];
							} else {
								recordList = JSON.parse(recordList);
							}
							// Add new recording and save
							recordList.push(record);
							console.log(recordList);
							return AsyncStorage.setItem(
								'record',
								JSON.stringify(recordList)
							);
						})
						// Navigate to list screen
						.then(() =>
							this.props.navigation.navigate(SCREENS.LIST)
						)
						.catch(err => console.log(err));
				} else {
					// Update timer
					this.setState({ timer: this.state.timer - 1 });
				}
			}, 1000);
			// Set start time for recording
			this.setState({ startTime: event.nativeEvent.timestamp });
		}
		// Track the initial input as well
		this.trackRecord(event);
	};

	trackRecord = event => {
		// Get current touch coordinates
		const posX = event.nativeEvent.pageX;
		const posY = event.nativeEvent.pageY;
		// Prune the invisible points
		let pruneIndex = 0;
		for (let i = 0; i < this.state.points.length; i++) {
			if (this.state.points[0].opacity._value > 0.01) {
				pruneIndex = i;
				break;
			}
		}
		let points = this.state.points.slice(pruneIndex);
		// Add a new point to current screen and recording
		points.push({
			posX,
			posY,
			opacity: new Animated.Value(1)
		});
		record = [
			...this.state.record,
			{
				posX,
				posY,
				time: this.state.record.length
					? event.nativeEvent.timestamp - this.state.startTime
					: 0
			}
		];
		// Save the current screen and recording
		this.setState(
			{
				points,
				record
			},
			() => {
				// Animate the new point to fade in one second
				Animated.timing(
					this.state.points[this.state.points.length - 1].opacity,
					{
						toValue: 0,
						duration: 1000
					}
				).start();
			}
		);
	};

	render() {
		return (
			<View
				style={styles.extend}
				onStartShouldSetResponder={() => true}
				onResponderGrant={this.startRecord}
				onResponderMove={this.trackRecord}
			>
				<SafeAreaView style={styles.drawBackground}>
					<View style={styles.drawHeader}>
						<Text style={[styles.text, styles.timerText]}>
							{this.state.timer}
						</Text>
						<TouchableOpacity style={styles.headerLink}>
							<Text style={[styles.text, styles.headerText]}>
								View all
							</Text>
							<Icon
								name="chevron-right"
								type="font-awesome"
								color={MAIN_BLUE}
								size={20}
							/>
						</TouchableOpacity>
					</View>
				</SafeAreaView>
				{this.state.points.map((point, index) => (
					<Animated.View
						key={index}
						style={{
							...styles.point,
							left: point.posX - 25,
							top: point.posY - 25,
							opacity: point.opacity
						}}
					/>
				))}
			</View>
		);
	}
}

Draw.navigationOptions = {
	header: null
};

export default Draw;
