import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	AsyncStorage,
	Switch,
	Picker,
	Alert,
	Linking
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

export default props => {
	const [notif, setNotif] = useState(true);
	const [picker, setPicker] = useState(false);
	const [hourDelay, setHourDelay] = useState(0);
	const [minDelay, setMinDelay] = useState(30);
	const [hourTemp, setHourTemp] = useState(0);
	const [minTemp, setMinTemp] = useState(0);

	// List of valid hour and minute input
	const hours = [];
	for (let i = 0; i < 24; i++) {
		hours.push(i);
	}
	const mins = [];
	for (let i = 0; i < 60; i += 5) {
		mins.push(i);
	}

	const updateSetting = (value, param) => {
		// Update settings values
		if (param === 'notif') {
			// Check if notifications are allowed
			if (value) {
				Permissions.getAsync(Permissions.NOTIFICATIONS)
					.then(({ status }) => {
						if (status !== 'granted') {
							Alert.alert(
								'Notifications',
								'In order to receive reminders, you must allow notifications for this application.',
								[
									{
										text: 'Go to Settings',
										onPress: () =>
											Linking.openURL('app-settings:')
									},
									{ text: 'Cancel', style: 'cancel' }
								]
							);
						}
					})
					.catch(err => console.log(err));
			} else {
				// Remove all notifications
				Notifications.cancelAllScheduledNotificationsAsync().catch(
					err => console.log(err)
				);
				setNotif(value);
			}
		} else if (param === 'hour') {
			setHourTemp(value);
		} else if (param === 'min') {
			setMinTemp(value);
		}
	};

	const copyDelay = () => {
		// Copy current delay values and render picker
		setHourTemp(hourDelay);
		setMinTemp(minDelay);
		setPicker(true);
	};

	const updateDelay = () => {
		// Update to new delay values and hide picker
		setHourDelay(hourTemp);
		setMinDelay(minTemp);
		setPicker(false);
	};

	useEffect(() => {
		// Read the settings
		AsyncStorage.getItem('settings')
			.then(settings => {
				settings = JSON.parse(settings);
				setNotif(settings.notif);
				setHourDelay(Math.floor(settings.notifDelay / 60));
				setMinDelay(settings.notifDelay % 60);
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		// Save whenever settings changes
		const notifDelay = 60 * hourDelay + minDelay;
		AsyncStorage.setItem('settings', JSON.stringify({ notif, notifDelay }));
	}, [notif, hourDelay, minDelay]);

	return (
		<SafeAreaView style={styles.eventBackground}>
			<View style={styles.header}>
				<Text style={[styles.text, styles.headerTitle]}>Settings</Text>
				<TouchableOpacity
					style={[styles.headerLink, styles.linkLeft]}
					onPress={() => props.navigation.navigate(SCREENS.LIST)}
				>
					<View style={styles.btnLeft}>
						<Icon
							name="chevron-left"
							type="font-awesome"
							color={MAIN_BLUE}
							size={20}
						/>
					</View>
					<Text style={[styles.text, styles.headerBtn]}>Back</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.settingsWrap}>
				<View style={[styles.listItem, styles.evenItem]}>
					<Text style={[styles.text, styles.settingsItem]}>
						Reminders
					</Text>
					<Switch
						value={notif}
						trackColor={{ true: MAIN_BLUE }}
						onValueChange={value => updateSetting(value, 'notif')}
					/>
				</View>
				{notif && (
					<View style={styles.listItem}>
						<Text style={[styles.text, styles.settingsItem]}>
							Reminder delay
						</Text>
						<TouchableOpacity onPress={copyDelay}>
							<Text style={[styles.text, styles.settingsItem]}>
								{hourDelay +
									(hourDelay === 1 ? ' hour  ' : ' hours  ') +
									minDelay +
									' min'}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				{picker && (
					<View>
						<View style={styles.pickerStack}>
							<Picker
								style={styles.settingsPicker}
								itemStyle={[styles.text, styles.pickerItem]}
								selectedValue={hourTemp}
								onValueChange={value =>
									updateSetting(value, 'hour')
								}
							>
								{hours.map(hour => (
									<Picker.Item
										key={hour}
										label={hour}
										value={hour}
									/>
								))}
							</Picker>
							<View style={styles.pickerLabelWrap}>
								<Text
									style={[
										styles.text,
										styles.pickerLabel,
										styles.pickerHour
									]}
								>
									{hourDelay === 1 ? 'hour' : 'hours'}
								</Text>
							</View>
							<Picker
								style={styles.settingsPicker}
								itemStyle={[styles.text, styles.pickerItem]}
								selectedValue={minTemp}
								onValueChange={value =>
									updateSetting(value, 'min')
								}
							>
								{mins.map(min => (
									<Picker.Item
										key={min}
										label={min}
										value={min}
									/>
								))}
							</Picker>
							<View style={styles.pickerLabelWrap}>
								<Text style={[styles.text, styles.pickerLabel]}>
									min
								</Text>
							</View>
						</View>
						<View style={styles.pickerFooter}>
							<TouchableOpacity
								style={styles.footerBtnWrap}
								onPress={updateDelay}
							>
								<Text style={styles.text}>Update</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.footerBtnWrap}
								onPress={() => setPicker(false)}
							>
								<Text style={[styles.text, styles.deleteBtn]}>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
};
