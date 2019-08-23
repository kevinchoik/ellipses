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
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

export default class Draw extends Component {
	constructor(props) {
		super(props);
		this.state = {
			points: [],
			record: [],
			startTime: 0,
			startDate: null,
			timer: 5
		};
		this.interval = null;
	}

	startRecord = event => {
		if (!this.interval) {
			this.interval = setInterval(() => {
				if (this.state.timer === 1) {
					this.saveRecord();
				} else {
					// Update timer
					this.setState({
						timer: this.state.timer - 1
					});
				}
			}, 1000);
			// Set start time and date for recording
			this.setState({
				startTime: event.nativeEvent.timestamp,
				startDate: new Date().getTime()
			});
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
			opacity: new Animated.Value(1),
			scale: new Animated.Value(1)
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
				// Animate fade and spread for one second
				Animated.parallel([
					Animated.timing(
						this.state.points[this.state.points.length - 1].opacity,
						{
							toValue: 0,
							duration: 1000
						}
					),
					Animated.timing(
						this.state.points[this.state.points.length - 1].scale,
						{
							toValue: 2,
							duration: 1000
						}
					)
				]).start();
			}
		);
	};

	// Reset values and navigate to list screen
	stopRecord = () => {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
			this.setState({
				points: [],
				record: [],
				startTime: 0,
				startDate: null,
				timer: 5
			});
		}
		this.props.navigation.navigate(SCREENS.LIST);
	};

	saveRecord = () => {
		clearInterval(this.interval);
		this.interval = null;
		const record = {
			record: this.state.record,
			time: this.state.startDate
		};
		// Send notification after certain time
		Permissions.getAsync(Permissions.NOTIFICATIONS)
			.then(({ status }) => {
				// Only send notification if permitted
				if (status === 'granted') {
					return AsyncStorage.getItem('settings');
				} else {
					throw 'Notification permission not granted';
				}
			})
			.then(settings => {
				settings = JSON.parse(settings);
				// Only send notification if allowed by user settings
				if (settings.notif) {
					Notifications.scheduleLocalNotificationAsync(
						{
							title: 'Ellipses',
							body: 'Fill in what you missed!'
						},
						{
							// Number of minutes set by user settings
							time:
								Date.now() +
								Number(settings.notifDelay) * 60 * 1000
						}
					);
				}
			})
			.catch(err => console.log(err));
		// Save recording
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
				return AsyncStorage.setItem(
					'record',
					JSON.stringify(recordList)
				);
			})
			// Reset values and navigate to list screen
			.then(() => {
				this.setState({
					points: [],
					record: [],
					startTime: 0,
					startDate: null,
					timer: 5
				});
				this.props.navigation.navigate(SCREENS.LIST);
			})
			.catch(err => console.log(err));
	};

	componentDidMount = () => {
		Permissions.askAsync(Permissions.NOTIFICATIONS)
			.then(({ status }) => {
				// Set default user setting
				AsyncStorage.getItem('settings')
					.then(settings => {
						if (!settings) {
							const defaultSettings = {
								notif: status === 'granted',
								notifDelay: 30
							};
							return AsyncStorage.setItem(
								'settings',
								JSON.stringify(defaultSettings)
							);
						}
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
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
					{this.state.points.map((point, index) => (
						<Animated.View
							key={index}
							style={{
								...styles.point,
								left: point.posX - 25,
								top: point.posY - 25,
								opacity: point.opacity,
								transform: [
									{ scaleX: point.scale },
									{ scaleY: point.scale }
								]
							}}
						/>
					))}
					<View style={styles.header}>
						<Text style={[styles.text, styles.headerTitle]}>
							{this.state.timer}
						</Text>
						<TouchableOpacity
							style={[styles.headerLink, styles.linkRight]}
							onPress={this.stopRecord}
						>
							<Text style={[styles.text, styles.headerBtn]}>
								Ellipses
							</Text>
							<View style={styles.btnRight}>
								<Icon
									name="chevron-right"
									type="font-awesome"
									color={MAIN_BLUE}
									size={20}
								/>
							</View>
						</TouchableOpacity>
						{this.interval && (
							<TouchableOpacity
								style={[styles.headerLink, styles.linkLeft]}
								onPress={this.saveRecord}
							>
								<View style={styles.btnLeft}>
									<Icon
										name="save"
										type="font-awesome-solid"
										color={MAIN_BLUE}
										size={20}
									/>
								</View>
								<Text style={[styles.text, styles.headerBtn]}>
									Save
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</SafeAreaView>
			</View>
		);
	}
}
