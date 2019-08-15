import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	TextInput
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE, EVENT_BLUE } from '../assets/colorScheme';

export default props => {
	const [date, setDate] = useState('');
	const [replay, setReplay] = useState(true);
	const [listPts, setListPts] = useState([]);
	const [index, setIndex] = useState('');
	const [remove, setRemove] = useState(false);
	const [title, setTitle] = useState('');

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
						View all
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
						<Text style={styles.text}>More info</Text>
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
		</SafeAreaView>
	);
};
