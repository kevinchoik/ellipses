import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	AsyncStorage,
	Switch,
	Picker
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

export default props => {
	const [notif, setNotif] = useState(true);
	const [picker, setPicker] = useState(true);
	const [notifDelay, setNotifDelay] = useState(30);

	// List of valid hour and minute input
	const hours = [];
	for (let i = 0; i < 24; i++) {
		hours.push(i);
	}
	const mins = [];
	for (let i = 0; i < 60; i++) {
		mins.push(i);
	}

	const updateSetting = (value, param) => {
		// Update the value
		if (param === 'notif') {
			setNotif(value);
		} else if (param === 'delay') {
			setNotifDelay(value);
		}
	};

	useEffect(() => {
		// Read the settings
		AsyncStorage.getItem('settings')
			.then(settings => {
				settings = JSON.parse(settings);
				setNotif(settings.notif);
				setNotifDelay(settings.notifDelay);
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		// Save whenever settings changes
		AsyncStorage.setItem('settings', JSON.stringify({ notif, notifDelay }));
	}, [notif, notifDelay]);

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
						Notifications
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
							Delay time
						</Text>
					</View>
				)}
				{notif && (
					<View style={styles.pickerStack}>
						<Picker
							style={styles.settingsPicker}
							itemStyle={[styles.text, styles.pickerItem]}
						>
							<Picker.Item label="Java" value="java" />
							<Picker.Item label="JavaScript" value="js" />
						</Picker>
						<View style={styles.pickerLabelWrap}>
							<Text
								style={[
									styles.text,
									styles.pickerLabel,
									styles.pickerHour
								]}
							>
								hr
							</Text>
						</View>
						<Picker
							style={styles.settingsPicker}
							itemStyle={[styles.text, styles.pickerItem]}
						>
							<Picker.Item label="Java" value="java" />
							<Picker.Item label="JavaScript" value="js" />
						</Picker>
						<View style={styles.pickerLabelWrap}>
							<Text style={[styles.text, styles.pickerLabel]}>
								min
							</Text>
						</View>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
};
