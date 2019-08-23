import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	TextInput,
	AsyncStorage,
	Alert
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import * as Google from 'expo-google-app-auth';
import { CLIENT_ID } from 'react-native-dotenv';
import { FlatList } from 'react-native-gesture-handler';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE, EVENT_BLUE } from '../assets/colorScheme';

const GCAL = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_TOKEN = 'https://www.googleapis.com/oauth2/v4/token';

export default props => {
	const [date, setDate] = useState('');
	const [replay, setReplay] = useState(true);
	const [listPts, setListPts] = useState([]);
	const [index, setIndex] = useState('');
	const [remove, setRemove] = useState(false);
	const [title, setTitle] = useState('');
	const [modal, setModal] = useState(false);
	const [eventList, setEventList] = useState([]);

	const seeList = () => {
		// Pass in index if the event is removed
		props.navigation.navigate(SCREENS.LIST, { index, remove, title });
	};

	const drawPts = () => {
		setReplay(false);
		const ptData = props.navigation.getParam('record');
		setListPts(
			ptData.map(point => ({
				...point,
				opacity: new Animated.Value(0),
				scale: new Animated.Value(1)
			}))
		);
	};

	const checkCalendar = async () => {
		// Get access token from memory
		let token = await AsyncStorage.getItem('accessToken');
		// Sign in if token doesn't exist
		if (!token) {
			try {
				token = await signIn();
			} catch (err) {
				console.log(err);
				Alert.alert(
					'GCal Sync',
					'Sync Ellipses to Google Calendar to see more information about what you missed.',
					[{ text: 'OK', style: 'cancel' }]
				);
				return;
			}
		}
		// Get the list of calendars the user has
		let calendarList = await fetch(`${GCAL}/users/me/calendarList`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});
		// Access token has expired
		if (!calendarList.ok) {
			refreshTokens();
			return;
		}
		calendarList = await calendarList.json();
		const calendarIds = calendarList.items.map(calendar => calendar.id);
		// Specify search parameter
		const timeCreated = moment(props.navigation.getParam('time'));
		const timeMin = timeCreated
			.clone()
			.subtract(1, 'seconds')
			.toISOString();
		const timeMax = timeCreated
			.clone()
			.add(1, 'seconds')
			.toISOString();
		let queries = [['timeMin', timeMin], ['timeMax', timeMax]];
		queries = queries.map(query => query.join('='));
		// Get every event that happend when ellipsis was crated
		let events = await Promise.all(
			calendarIds.map(id => {
				const eventUri =
					`${GCAL}/calendars/${id}/events?` + queries.join('&');
				return fetch(eventUri, {
					method: 'GET',
					headers: { Authorization: `Bearer ${token}` }
				});
			})
		);
		// Ignore the calendars that can't be read
		events = events.filter(event => event.ok);
		// Extract all events and flatten into one array
		events = await Promise.all(events.map(event => event.json()));
		events = events.map(event => event.items);
		events = events.flat();
		events = events.map(event => {
			filteredEvent = {};
			if (event.start.hasOwnProperty('dateTime')) {
				// Regular event
				const startTime = moment(event.start.dateTime);
				const endTime = moment(event.end.dateTime);
				filteredEvent.duration = endTime.diff(startTime, 'minutes');
				filteredEvent.elapsed = timeCreated.diff(startTime, 'minutes');
			} else {
				// All-day event
				const today = timeCreated.clone().startOf('day');
				filteredEvent.duration = 24 * 60;
				filteredEvent.elapsed = timeCreated.diff(today, 'minutes');
			}
			filteredEvent.title = event.summary;
			return filteredEvent;
		});
		// Save list of events and trigger modal
		await setEventList(events);
		setModal(true);
	};

	// Sign in to Google using OAuth 2.0
	const signIn = async () => {
		const { type, accessToken, refreshToken } = await Google.logInAsync({
			iosClientId: CLIENT_ID,
			scopes: ['https://www.googleapis.com/auth/calendar.readonly']
		});
		if (type === 'success') {
			await AsyncStorage.setItem('accessToken', accessToken);
			await AsyncStorage.setItem('refreshToken', refreshToken);
			return accessToken;
		} else {
			throw 'User denied access to Google Calendar';
		}
	};

	// Refresh access and refresh tokens
	const refreshTokens = async () => {
		const refresh = await AsyncStorage.getItem('refreshToken');
		let params = [
			['client_id', CLIENT_ID],
			['refresh_token', refresh],
			['grant_type', 'refresh_token']
		];
		params = params.map(param => param.join('='));
		const refreshUri = GOOGLE_TOKEN + '?' + params.join('&');
		let newTokens = await fetch(refreshUri, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		// Refresh token has expired, so sign in again
		if (!newTokens.ok) {
			Alert.alert(
				'Session expired',
				'Your Google session has expired. Please sign in again.',
				[
					{
						text: 'Sign in',
						onPress: () => {
							AsyncStorage.setItem('accessToken', '')
								.then(checkCalendar)
								.catch(err => console.log(err));
						}
					},
					{
						text: 'Cancel',
						onPress: () => {
							AsyncStorage.setItem('accessToken', '');
						}
					}
				]
			);
			return;
		}
		newTokens = await newTokens.json();
		// Save the new token values
		await AsyncStorage.setItem('accessToken', newTokens.access_token);
		if (newTokens.refresh_token) {
			await AsyncStorage.setItem('refreshToken', newTokens.refresh_token);
		}
		checkCalendar();
		return;
	};

	const renderEvents = ({ item }) => (
		<View style={styles.modalSpacing}>
			<Text style={styles.text}>{item.title}</Text>
			<View style={styles.modalLabelWrap}>
				<Text style={[styles.text, styles.modalLabel, styles.labelTop]}>
					{formatTime(item.duration)}
				</Text>
			</View>
			<View style={styles.modalProgress}>
				<View
					style={[
						{
							flex: item.elapsed / item.duration
						},
						styles.progressBar,
						styles.progressDone
					]}
				>
					{item.elapsed / item.duration >= 0.85 && (
						<Text style={[styles.textGrey, styles.modalLabel]}>
							{Math.floor((item.elapsed / item.duration) * 100)}%
						</Text>
					)}
				</View>
				<View
					style={[
						{
							flex: 1 - item.elapsed / item.duration
						},
						styles.progressBar,
						styles.progressLeft
					]}
				>
					{item.elapsed / item.duration < 0.85 && (
						<Text style={[styles.text, styles.modalLabel]}>
							{Math.floor((item.elapsed / item.duration) * 100)}%
						</Text>
					)}
				</View>
			</View>
			<View style={styles.modalLabelBottom}>
				<View
					style={[
						styles.modalLabelWrap,
						{ flex: item.elapsed / item.duration }
					]}
				>
					{item.elapsed / item.duration < 50 && (
						<Text
							style={[
								styles.text,
								styles.modalLabel,
								styles.labelBottom
							]}
						>
							{formatTime(item.elapsed)}
						</Text>
					)}
				</View>
				<View style={{ flex: 1 - item.elapsed / item.duration }}>
					{item.elapsed / item.duration >= 50 && (
						<Text
							style={[
								styles.text,
								styles.modalLabel,
								styles.labelBottom
							]}
						>
							{formatTime(item.elapsed)}
						</Text>
					)}
				</View>
			</View>
		</View>
	);

	const formatTime = minutes => {
		let result = '';
		if (minutes > 120) {
			result += Math.floor(minutes / 60) + 'hrs';
		} else if (minutes > 60) {
			result += Math.floor(minutes / 60) + 'hr';
		}
		if (minutes % 60) {
			result += ' ' + (minutes % 60) + 'min';
		}
		return result;
	};

	useEffect(() => {
		// Set the creation date, title, and index
		setDate(moment(props.navigation.getParam('time')).calendar());
		const title = props.navigation.getParam('title');
		if (title) {
			setTitle(title);
		}
		setIndex(props.navigation.getParam('index'));
	}, []);

	useEffect(() => {
		// Go back to list if event was removed
		if (remove) {
			seeList();
		}
	}, [remove]);

	useEffect(() => {
		for (let i = 0; i < listPts.length; i++) {
			setTimeout(() => {
				listPts[i].opacity.setValue(1);
				Animated.parallel([
					Animated.timing(listPts[i].opacity, {
						toValue: 0,
						duration: 1000
					}),
					Animated.timing(listPts[i].scale, {
						toValue: 2,
						duration: 1000
					})
				]).start();
			}, listPts[i].time + 250);
		}
		if (listPts.length > 0) {
			setTimeout(() => {
				setReplay(true);
			}, listPts[listPts.length - 1].time + 1500);
		}
	}, [listPts]);

	return (
		<SafeAreaView style={styles.eventBackground}>
			{/* <Modal isVisible={true} propagateSwipe style={styles.modalWrap}>
				<View style={styles.modal}>
					<Text style={styles.text}>Hi</Text>
				</View>
            </Modal> */}
			{!replay &&
				listPts.map((point, index) => {
					return (
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
					);
				})}
			<View style={styles.header}>
				<TouchableOpacity
					style={[styles.headerLink, styles.linkLeft]}
					onPress={seeList}
				>
					<View style={styles.btnLeft}>
						<Icon
							name="chevron-left"
							type="font-awesome"
							color={MAIN_BLUE}
							size={20}
						/>
					</View>
					<Text style={[styles.text, styles.headerBtn]}>
						Ellipses
					</Text>
				</TouchableOpacity>
				<View style={[styles.headerLink, styles.linkRight]}>
					<Text style={[styles.text, styles.eventDate]}>{date}</Text>
				</View>
			</View>
			<View style={styles.eventReplayWrap}>
				{replay && (
					<TouchableOpacity
						style={styles.eventReplay}
						onPress={drawPts}
					>
						<Text style={[styles.text, styles.replayText]}>
							Replay
						</Text>
						<Icon
							name="play"
							type="font-awesome"
							color={MAIN_BLUE}
							size={36}
						/>
					</TouchableOpacity>
				)}
				<View style={styles.eventHeader}>
					<TextInput
						style={[styles.text, styles.eventTitle]}
						selectionColor={MAIN_BLUE}
						placeholder={'Enter title'}
						placeholderTextColor={EVENT_BLUE}
						value={title}
						onChangeText={newTitle => setTitle(newTitle)}
					/>
				</View>
				<View style={styles.eventFooter}>
					<View style={styles.footerItem}>
						<TouchableOpacity onPress={checkCalendar}>
							<Text style={styles.text}>More info</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.footerItem}>
						<TouchableOpacity onPress={() => setRemove(true)}>
							<Text style={[styles.text, styles.deleteBtn]}>
								Delete
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			{modal && (
				<View style={styles.modalWrap}>
					<View style={styles.modal}>
						<Text style={[styles.text, styles.modalTitle]}>
							More Information
						</Text>
						{eventList.length ? (
							<View style={styles.modalBody}>
								<Text
									style={[styles.text, styles.modalSpacing]}
								>
									This ellipsis happened during these events:
								</Text>
								<FlatList
									style={styles.modalList}
									data={eventList}
									renderItem={renderEvents}
									keyExtractor={(item, index) => index + ''}
								/>
							</View>
						) : (
							<View style={styles.modalBody}>
								<Text style={styles.text}>
									There were no events in your Google Calendar
									when this ellipsis happened.
								</Text>
							</View>
						)}
						<TouchableOpacity onPress={() => setModal(false)}>
							<Text style={[styles.text, styles.modalBtn]}>
								OK
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
};
